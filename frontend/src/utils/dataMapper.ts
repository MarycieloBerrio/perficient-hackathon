// Funciones para mapear datos del backend a la estructura de UI
import type { ApiDome, ApiInventory, ApiSensor, ApiAlert } from '../types/backend';
import type { Dome, AlertStatus, DomeCategory, Control } from '../types';
import { defaultCategories } from '../data/domeControlData';

/**
 * Mapea el nivel de alerta del backend al tipo AlertStatus de la UI
 */
export function mapAlertLevel(alertLevel: number): AlertStatus {
  if (alertLevel >= 3) return 'critical';
  if (alertLevel >= 1) return 'warning';
  return 'ok';
}

/**
 * Mapea el nivel de alerta del API al tipo AlertStatus
 */
export function mapApiAlertLevel(level: string): AlertStatus {
  const normalized = level.toUpperCase();
  if (normalized === 'CRITICAL') return 'critical';
  if (normalized === 'WARNING') return 'warning';
  return 'ok';
}

/**
 * Calcula el status basado en el threshold de un recurso
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
 * Mapea un domo del backend a la estructura de UI
 */
export function mapDomeToUI(
  apiDome: ApiDome,
  inventory: ApiInventory[] = [],
  sensors: ApiSensor[] = [],
  alerts: ApiAlert[] = []
): Dome {
  // Calcular el status global basado en alertas activas
  const domeAlerts = alerts.filter(a => a.dome_id === apiDome.id && a.is_active);
  const hasCritical = domeAlerts.some(a => a.level === 'CRITICAL');
  const hasWarning = domeAlerts.some(a => a.level === 'WARNING');
  
  let globalStatus: AlertStatus = mapAlertLevel(apiDome.alert_level);
  if (hasCritical) globalStatus = 'critical';
  else if (hasWarning && globalStatus === 'ok') globalStatus = 'warning';

  // Calcular sistemas básicos desde el inventario
  const vitalResources = inventory.filter(inv => inv.resources.is_vital);
  const lifeSupportStatus = calculateLifeSupportStatus(vitalResources);
  const suppliesStatus = calculateSuppliesStatus(inventory);
  
  // Calcular potencia desde sensores
  const powerSensors = sensors.filter(s => s.category === 'POWER');
  const powerStatus = calculatePowerStatus(powerSensors);

  // Enriquecer las categorías con datos del backend
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
 * Enriquece las categorías con datos reales del backend
 */
function enrichCategoriesWithBackendData(
  categories: DomeCategory[],
  inventory: ApiInventory[],
  sensors: ApiSensor[]
): DomeCategory[] {
  return categories.map(category => {
    // Clonar la categoría para no mutar el original
    const enrichedCategory = JSON.parse(JSON.stringify(category)) as DomeCategory;

    // Inyectar recursos de inventario en las categorías apropiadas
    if (category.id === 'eclss') {
      enrichedCategory.systems = injectLifeSupportResources(category.systems, inventory, sensors);
    } else if (category.id === 'power') {
      enrichedCategory.systems = injectPowerResources(category.systems, inventory, sensors);
    } else if (category.id === 'supplies') {
      enrichedCategory.systems = injectSupplyResources(category.systems, inventory);
    }

    // Actualizar el status de la categoría basado en sus sistemas
    enrichedCategory.status = calculateCategoryStatus(enrichedCategory.systems);

    return enrichedCategory;
  });
}

/**
 * Inyecta recursos de soporte vital en los sistemas ECLSS
 */
function injectLifeSupportResources(systems: any[], inventory: ApiInventory[], sensors: ApiSensor[]): any[] {
  const enrichedSystems = [...systems];

  // Buscar recursos vitales
  const oxygenResource = inventory.find(inv => inv.resources.code === 'OXYGEN' || inv.resources.code === 'O2');
  const waterResource = inventory.find(inv => inv.resources.code === 'WATER');

  // Inyectar sensor de oxígeno si existe
  const oxygenSensor = sensors.find(s => s.category === 'LIFE_SUPPORT' && s.code.includes('O2'));
  
  if (oxygenResource || oxygenSensor) {
    // Encontrar el sistema de atmósfera y agregar control de progreso
    const atmosphereSystem = enrichedSystems.find(s => s.id === 'atmosphere');
    if (atmosphereSystem && oxygenResource) {
      atmosphereSystem.subsystems.push({
        id: 'oxygen-level',
        name: 'Oxygen Level',
        commanderControl: createResourceProgressControl(oxygenResource),
      });
    }
  }

  if (waterResource) {
    const waterSystem = enrichedSystems.find(s => s.id === 'water');
    if (waterSystem) {
      waterSystem.subsystems.push({
        id: 'water-level',
        name: 'Water Level',
        commanderControl: createResourceProgressControl(waterResource),
      });
    }
  }

  return enrichedSystems;
}

/**
 * Inyecta recursos de energía en los sistemas de power
 */
function injectPowerResources(systems: any[], inventory: ApiInventory[], sensors: ApiSensor[]): any[] {
  const enrichedSystems = [...systems];

  // Buscar sensores de potencia
  const powerSensors = sensors.filter(s => s.category === 'POWER');

  if (powerSensors.length > 0) {
    const distributionSystem = enrichedSystems.find(s => s.id === 'distribution');
    if (distributionSystem) {
      powerSensors.forEach(sensor => {
        distributionSystem.subsystems.push({
          id: `power-sensor-${sensor.id}`,
          name: sensor.name,
          commanderControl: createSensorProgressControl(sensor),
        });
      });
    }
  }

  return enrichedSystems;
}

/**
 * Inyecta recursos de suministros
 */
function injectSupplyResources(systems: any[], inventory: ApiInventory[]): any[] {
  const enrichedSystems = [...systems];

  // Buscar recursos de comida y suministros
  const foodResources = inventory.filter(inv => 
    inv.resources.subcategory === 'FOOD' || 
    inv.resources.code.includes('FOOD')
  );

  if (foodResources.length > 0) {
    const agricultureSystem = enrichedSystems.find(s => s.id === 'agriculture');
    if (agricultureSystem) {
      foodResources.forEach(resource => {
        agricultureSystem.subsystems.push({
          id: `food-${resource.resource_id}`,
          name: `${resource.resources.name} Stock`,
          commanderControl: createResourceProgressControl(resource),
        });
      });
    }
  }

  return enrichedSystems;
}

/**
 * Crea un control de tipo progress-bar para un recurso
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
    locked: true, // Los recursos son read-only
    critical: inventory.resources.is_vital,
    requiresConfirmation: false,
  };
}

/**
 * Crea un control de tipo progress-bar para un sensor
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
    value: 0, // Se actualizará con telemetría
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
 * Calcula el status del soporte vital
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
 * Calcula el status de suministros
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
 * Calcula el status de potencia
 */
function calculatePowerStatus(sensors: ApiSensor[]): { value: string; status: AlertStatus } {
  // Por ahora retornamos un valor por defecto
  // Se actualizará con telemetría en tiempo real
  return { value: '450kW', status: 'ok' };
}

/**
 * Calcula el status general de una categoría basado en sus sistemas
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

/**
 * Obtiene la posición por defecto de un domo basado en su código
 */
function getDefaultDomePosition(code: string): { x: number; y: number } {
  // Mapeo simple basado en el código
  const positions: Record<string, { x: number; y: number }> = {
    'DOME_ALPHA': { x: 35, y: 45 },
    'DOME_BETA': { x: 60, y: 55 },
    'DOME_GAMMA': { x: 45, y: 70 },
  };

  return positions[code] || { x: 50, y: 50 };
}

/**
 * Calcula la población estimada basada en el tipo de domo
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
 * Exporta las categorías por defecto para uso en otros lugares
 */
export { defaultCategories };

