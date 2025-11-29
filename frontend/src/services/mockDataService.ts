// Service to provide mock data when backend is unavailable
import type {
  ApiDome,
  ApiResource,
  ApiResourceCategory,
  ApiInventory,
  ApiSensor,
  ApiTelemetryReading,
  ApiAlert,
} from '../types/backend';

// Local state to simulate telemetry
const mockTelemetryData: Record<string, ApiTelemetryReading> = {};

// Generate simulated telemetry for a sensor
export function generateMockTelemetry(sensorId: string, sensorCategory: string): ApiTelemetryReading {
  const now = new Date().toISOString();
  
  // If it already exists, update it slightly
  if (mockTelemetryData[sensorId]) {
    const existing = mockTelemetryData[sensorId];
    // Simulate small variation
    const variation = (Math.random() - 0.5) * 5;
    mockTelemetryData[sensorId] = {
      ...existing,
      value: Math.max(0, Math.min(100, existing.value + variation)),
      timestamp: now,
    };
    return mockTelemetryData[sensorId];
  }

  // Create new telemetry
  let value = 50;
  switch (sensorCategory) {
    case 'POWER':
      value = 65 + Math.random() * 20;
      break;
    case 'LIFE_SUPPORT':
      value = 85 + Math.random() * 10;
      break;
    case 'TEMPERATURE':
      value = 20 + Math.random() * 5;
      break;
    default:
      value = 50 + Math.random() * 30;
  }

  const reading: ApiTelemetryReading = {
    id: `telemetry-${sensorId}-${Date.now()}`,
    sensor_id: sensorId,
    value: value,
    timestamp: now,
  };

  mockTelemetryData[sensorId] = reading;
  return reading;
}

// Mock dome data - Domos reales del backend
export const mockDomes: ApiDome[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    code: 'CHARLIE',
    name: 'Dome Charlie',
    dome_type: 'HABITATION',
    alert_level: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'OPERATIONAL',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    code: 'ALPHA',
    name: 'Dome Alpha',
    dome_type: 'RESEARCH',
    alert_level: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'OPERATIONAL',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    code: 'BRAVO',
    name: 'Dome Bravo',
    dome_type: 'AGRICULTURE',
    alert_level: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'OPERATIONAL',
  },
];

// Mock resources
export const mockResources: ApiResource[] = [
  {
    id: 'res-oxygen',
    code: 'OXYGEN',
    name: 'Oxygen',
    unit: 'L',
    category_id: 'cat-vital',
    subcategory: 'LIFE_SUPPORT',
    is_vital: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-water',
    code: 'WATER',
    name: 'Water',
    unit: 'L',
    category_id: 'cat-vital',
    subcategory: 'LIFE_SUPPORT',
    is_vital: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-food',
    code: 'FOOD',
    name: 'Food Rations',
    unit: 'kg',
    category_id: 'cat-supplies',
    subcategory: 'FOOD',
    is_vital: true,
    created_at: new Date().toISOString(),
  },
];

// Mock resource categories
export const mockResourceCategories: ApiResourceCategory[] = [
  {
    id: 'cat-vital',
    name: 'Vital Resources',
    description: 'Essential resources for life support',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-supplies',
    name: 'Supplies',
    description: 'General supplies and materials',
    created_at: new Date().toISOString(),
  },
];

// Generate mock inventory for a dome
export function generateMockInventory(domeId: string): ApiInventory[] {
  return [
    {
      id: `inv-${domeId}-oxygen`,
      dome_id: domeId,
      resource_id: 'res-oxygen',
      quantity: 8500 + Math.random() * 1000,
      min_threshold: 5000,
      max_threshold: 10000,
      last_updated: new Date().toISOString(),
      resources: mockResources[0],
    },
    {
      id: `inv-${domeId}-water`,
      dome_id: domeId,
      resource_id: 'res-water',
      quantity: 6000 + Math.random() * 2000,
      min_threshold: 4000,
      max_threshold: 8000,
      last_updated: new Date().toISOString(),
      resources: mockResources[1],
    },
    {
      id: `inv-${domeId}-food`,
      dome_id: domeId,
      resource_id: 'res-food',
      quantity: 300 + Math.random() * 100,
      min_threshold: 200,
      max_threshold: 500,
      last_updated: new Date().toISOString(),
      resources: mockResources[2],
    },
  ];
}

// Generate mock sensors for a dome
export function generateMockSensors(domeId: string): ApiSensor[] {
  return [
    {
      id: `sensor-${domeId}-power-1`,
      dome_id: domeId,
      code: `PWR_${domeId.slice(-4).toUpperCase()}_001`,
      name: 'Main Power Bus',
      category: 'POWER',
      unit: 'kW',
      is_critical: true,
      metadata: { min: 0, max: 500 },
      created_at: new Date().toISOString(),
    },
    {
      id: `sensor-${domeId}-temp-1`,
      dome_id: domeId,
      code: `TEMP_${domeId.slice(-4).toUpperCase()}_001`,
      name: 'Internal Temperature',
      category: 'TEMPERATURE',
      unit: '°C',
      is_critical: false,
      metadata: { min: 15, max: 30 },
      created_at: new Date().toISOString(),
    },
    {
      id: `sensor-${domeId}-o2-1`,
      dome_id: domeId,
      code: `O2_${domeId.slice(-4).toUpperCase()}_001`,
      name: 'Oxygen Level',
      category: 'LIFE_SUPPORT',
      unit: '%',
      is_critical: true,
      metadata: { min: 0, max: 100 },
      created_at: new Date().toISOString(),
    },
  ];
}

// Mock alerts
export const mockAlerts: ApiAlert[] = [
  {
    id: 'alert-1',
    dome_id: '550e8400-e29b-41d4-a716-446655440002',
    resource_id: 'res-oxygen',
    level: 'WARNING',
    message: 'Oxygen levels below optimal range',
    is_active: true,
    acknowledged: false,
    acknowledged_by: null,
    acknowledged_at: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

// Function to check if backend is available
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 seconds timeout
    
    const response = await fetch('http://localhost:3000/api/domes', {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Save flag to localStorage
const BACKEND_STATUS_KEY = 'mars-colony-backend-available';
const BACKEND_CHECK_INTERVAL = 30000; // Check every 30 seconds

let lastCheck = 0;
let cachedStatus = false;

export async function checkBackendStatus(): Promise<boolean> {
  const now = Date.now();
  
  // If we already checked recently, use cache
  if (now - lastCheck < BACKEND_CHECK_INTERVAL) {
    return cachedStatus;
  }
  
  const available = await isBackendAvailable();
  cachedStatus = available;
  lastCheck = now;
  
  localStorage.setItem(BACKEND_STATUS_KEY, JSON.stringify(available));
  
  return available;
}

