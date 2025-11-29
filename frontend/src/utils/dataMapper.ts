// Functions to map backend data to UI structure
import type { ApiDome, ApiInventory, ApiSensor, ApiAlert } from '../types/backend';
import type { Dome, AlertStatus, DomeCategory, Control } from '../types';
import { defaultCategories } from '../data/domeControlData';

/**
 * Maps backend alert level to UI AlertStatus type
 */
export function mapAlertLevel(alertLevel: number): AlertStatus {
  if (alertLevel >= 3) return 'critical';
  if (alertLevel >= 1) return 'warning';
  return 'ok';
}

/**
 * Maps API alert level to AlertStatus type
 */
export function mapApiAlertLevel(level: string): AlertStatus {
  const normalized = level.toUpperCase();
  if (normalized === 'CRITICAL') return 'critical';
  if (normalized === 'WARNING') return 'warning';
  return 'ok';
}

/**
 * Calculates status based on resource threshold
 */
export function calculateResourceStatus(
  quantity: number,
  minThreshold: number,
  maxThreshold: number
): AlertStatus {
  const percentage = (quantity / maxThreshold) * 100;
  
  if (quantity <= minThreshold) return 'critical';
  if (percentage < 30) return 'warning';
  return 'ok';
}

/**
 * Maps a backend dome to UI structure
 */
export function mapDomeToUI(
  apiDome: ApiDome,
  inventory: ApiInventory[] = [],
  sensors: ApiSensor[] = [],
  alerts: ApiAlert[] = []
): Dome {
  const domeAlerts = alerts.filter(a => a.dome_id === apiDome.id && a.is_active);
  const hasCritical = domeAlerts.some(a => a.level === 'CRITICAL');
  const hasWarning = domeAlerts.some(a => a.level === 'WARNING');
  
  let globalStatus: AlertStatus = mapAlertLevel(apiDome.alert_level);
  if (hasCritical) globalStatus = 'critical';
  else if (hasWarning && globalStatus === 'ok') globalStatus = 'warning';

  const vitalResources = inventory.filter(inv => inv.resources.is_vital);
  const lifeSupportStatus = calculateLifeSupportStatus(vitalResources);
  const suppliesStatus = calculateSuppliesStatus(inventory);
  
  const powerSensors = sensors.filter(s => s.category === 'POWER');
  const powerStatus = calculatePowerStatus(powerSensors);

  const enrichedCategories = enrichCategoriesWithBackendData(
    defaultCategories,
    inventory,
    sensors
  );

  return {
    id: apiDome.id,
    name: apiDome.name,
    position: getDefaultDomePosition(apiDome.code),
    status: globalStatus,
    population: calculatePopulation(apiDome.dome_type),
    systems: [
      { name: 'Life Support', value: lifeSupportStatus.value, status: lifeSupportStatus.status },
      { name: 'Power', value: powerStatus.value, status: powerStatus.status },
      { name: 'Structural', value: '100%', status: 'ok' },
      { name: 'Supplies', value: suppliesStatus.value, status: suppliesStatus.status },
    ],
    categories: enrichedCategories,
  };
}

/**
 * Enriches categories with real backend data
 */
function enrichCategoriesWithBackendData(
  categories: DomeCategory[],
  inventory: ApiInventory[],
  sensors: ApiSensor[]
): DomeCategory[] {
  return categories.map(category => {
    const enrichedCategory = JSON.parse(JSON.stringify(category)) as DomeCategory;

    if (category.id === 'eclss') {
      enrichedCategory.systems = injectLifeSupportResources(category.systems, inventory, sensors);
    } else if (category.id === 'power') {
      enrichedCategory.systems = injectPowerResources(category.systems, inventory, sensors);
    } else if (category.id === 'supplies') {
      enrichedCategory.systems = injectSupplyResources(category.systems, inventory);
    }

    enrichedCategory.status = calculateCategoryStatus(enrichedCategory.systems);

    return enrichedCategory;
  });
}

/**
 * Injects life support resources into ECLSS systems
 */
function injectLifeSupportResources(systems: any[], inventory: ApiInventory[], sensors: ApiSensor[]): any[] {
  const enrichedSystems = [...systems];

  const oxygenResource = inventory.find(inv => inv.resources.code === 'OXYGEN' || inv.resources.code === 'O2');
  const waterResource = inventory.find(inv => inv.resources.code === 'WATER');
  const oxygenSensor = sensors.find(s => s.category === 'LIFE_SUPPORT' && s.code.includes('O2'));
  
  if (oxygenResource || oxygenSensor) {
    const atmosphereSystem = enrichedSystems.find(s => s.id === 'atmosphere');
    if (atmosphereSystem && oxygenResource) {
      const existingSubsystem = atmosphereSystem.subsystems.find((sub: any) => sub.id === 'oxygen-level');
      if (!existingSubsystem) {
        atmosphereSystem.subsystems.push({
          id: 'oxygen-level',
          name: 'Oxygen Level',
          commanderControl: createResourceProgressControl(oxygenResource),
        });
      }
    }
  }

  if (waterResource) {
    const waterSystem = enrichedSystems.find(s => s.id === 'water');
    if (waterSystem) {
      const existingSubsystem = waterSystem.subsystems.find((sub: any) => sub.id === 'water-level');
      if (!existingSubsystem) {
        waterSystem.subsystems.push({
          id: 'water-level',
          name: 'Water Level',
          commanderControl: createResourceProgressControl(waterResource),
        });
      }
    }
  }

  return enrichedSystems;
}

/**
 * Injects power resources into power systems
 */
function injectPowerResources(systems: any[], inventory: ApiInventory[], sensors: ApiSensor[]): any[] {
  const enrichedSystems = [...systems];

  // Find power sensors
  const powerSensors = sensors.filter(s => s.category === 'POWER');

  if (powerSensors.length > 0) {
    const distributionSystem = enrichedSystems.find(s => s.id === 'distribution');
    if (distributionSystem) {
      // Get existing IDs to avoid duplicates
      const existingIds = new Set(
        distributionSystem.subsystems.map((sub: any) => sub.id)
      );
      
      powerSensors.forEach(sensor => {
        const subsystemId = `power-sensor-${sensor.id}`;
        // Only add if it doesn't already exist
        if (!existingIds.has(subsystemId)) {
          distributionSystem.subsystems.push({
            id: subsystemId,
            name: sensor.name,
            commanderControl: createSensorProgressControl(sensor),
          });
          existingIds.add(subsystemId);
        }
      });
    }
  }

  return enrichedSystems;
}

/**
 * Injects supply resources
 */
function injectSupplyResources(systems: any[], inventory: ApiInventory[]): any[] {
  const enrichedSystems = [...systems];

  // Find food and supply resources
  const foodResources = inventory.filter(inv => 
    inv.resources.subcategory === 'FOOD' || 
    inv.resources.code.includes('FOOD')
  );

  if (foodResources.length > 0) {
    const agricultureSystem = enrichedSystems.find(s => s.id === 'agriculture');
    if (agricultureSystem) {
      // Get existing IDs to avoid duplicates
      const existingIds = new Set(
        agricultureSystem.subsystems.map((sub: any) => sub.id)
      );
      
      foodResources.forEach(resource => {
        const subsystemId = `food-${resource.resource_id}`;
        // Only add if it doesn't already exist
        if (!existingIds.has(subsystemId)) {
          agricultureSystem.subsystems.push({
            id: subsystemId,
            name: `${resource.resources.name} Stock`,
            commanderControl: createResourceProgressControl(resource),
          });
          existingIds.add(subsystemId);
        }
      });
    }
  }

  return enrichedSystems;
}

/**
 * Creates a progress-bar type control for a resource
 */
function createResourceProgressControl(inventory: ApiInventory): Control {
  const status = calculateResourceStatus(
    inventory.quantity,
    inventory.min_threshold,
    inventory.max_threshold
  );

  return {
    id: `resource-${inventory.resource_id}`,
    label: inventory.resources.name,
    description: `Current: ${inventory.quantity} ${inventory.resources.unit} / Max: ${inventory.max_threshold} ${inventory.resources.unit}`,
    type: 'progress-bar',
    value: inventory.quantity,
    min: 0,
    max: inventory.max_threshold,
    unit: inventory.resources.unit,
    status,
    locked: true, // Resources are read-only
    critical: inventory.resources.is_vital,
    requiresConfirmation: false,
  };
}

/**
 * Creates a progress-bar type control for a sensor
 */
function createSensorProgressControl(sensor: ApiSensor): Control {
  const metadata = sensor.metadata || {};
  const min = metadata.min || 0;
  const max = metadata.max || 100;

  return {
    id: `sensor-${sensor.id}`,
    label: sensor.name,
    description: `Monitoring ${sensor.category}`,
    type: 'progress-bar',
    value: 0, // Will be updated with telemetry
    min,
    max,
    unit: sensor.unit,
    status: 'ok',
    locked: true,
    critical: sensor.is_critical,
    requiresConfirmation: false,
  };
}

/**
 * Calculates life support status
 */
function calculateLifeSupportStatus(vitalResources: ApiInventory[]): { value: string; status: AlertStatus } {
  if (vitalResources.length === 0) {
    return { value: 'N/A', status: 'ok' };
  }

  let totalPercentage = 0;
  let worstStatus: AlertStatus = 'ok';

  vitalResources.forEach(resource => {
    const percentage = (resource.quantity / resource.max_threshold) * 100;
    totalPercentage += percentage;
    
    const resourceStatus = calculateResourceStatus(
      resource.quantity,
      resource.min_threshold,
      resource.max_threshold
    );
    
    if (resourceStatus === 'critical') worstStatus = 'critical';
    else if (resourceStatus === 'warning' && worstStatus === 'ok') worstStatus = 'warning';
  });

  const avgPercentage = Math.round(totalPercentage / vitalResources.length);
  return { value: `${avgPercentage}%`, status: worstStatus };
}

/**
 * Calculates supplies status
 */
function calculateSuppliesStatus(inventory: ApiInventory[]): { value: string; status: AlertStatus } {
  if (inventory.length === 0) {
    return { value: 'N/A', status: 'ok' };
  }

  let totalPercentage = 0;
  let worstStatus: AlertStatus = 'ok';

  inventory.forEach(resource => {
    const percentage = (resource.quantity / resource.max_threshold) * 100;
    totalPercentage += percentage;
    
    const resourceStatus = calculateResourceStatus(
      resource.quantity,
      resource.min_threshold,
      resource.max_threshold
    );
    
    if (resourceStatus === 'critical') worstStatus = 'critical';
    else if (resourceStatus === 'warning' && worstStatus === 'ok') worstStatus = 'warning';
  });

  const avgPercentage = Math.round(totalPercentage / inventory.length);
  return { value: `${avgPercentage}%`, status: worstStatus };
}

/**
 * Calculates power status
 */
function calculatePowerStatus(sensors: ApiSensor[]): { value: string; status: AlertStatus } {
  // For now we return a default value
  // Will be updated with real-time telemetry
  return { value: '450kW', status: 'ok' };
}

/**
 * Calculates overall category status based on its systems
 */
function calculateCategoryStatus(systems: any[]): AlertStatus {
  let hasCritical = false;
  let hasWarning = false;

  systems.forEach(system => {
    if (system.status === 'critical') hasCritical = true;
    else if (system.status === 'warning') hasWarning = true;
  });

  if (hasCritical) return 'critical';
  if (hasWarning) return 'warning';
  return 'ok';
}

function getDefaultDomePosition(code: string): { x: number; y: number } {
  const positions: Record<string, { x: number; y: number }> = {
    'DOME_CHARLIE': { x: 20, y: 25 },
    'DOME_ALPHA': { x: 75, y: 30 },
    'DOME_BRAVO': { x: 45, y: 70 },
  };

  return positions[code] || { x: 50, y: 50 };
}

/**
 * Calculates estimated population based on dome type
 */
function calculatePopulation(domeType: string): number {
  const populations: Record<string, number> = {
    'HABITATION': 8,
    'AGRICULTURE': 4,
    'RESEARCH': 6,
    'INDUSTRIAL': 2,
  };

  return populations[domeType] || 5;
}

/**
 * Exports default categories for use elsewhere
 */
export { defaultCategories };

