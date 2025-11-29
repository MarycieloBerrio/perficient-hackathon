// Data service that automatically uses mock data when backend is unavailable
import * as api from './api';
import * as mockService from './mockDataService';
import type {
  ApiDome,
  ApiInventory,
  ApiSensor,
  ApiTelemetryReading,
  ApiAlert,
  ApiResource,
  ApiResourceCategory,
} from '../types/backend';

let useBackend = true;
let backendCheckInProgress = false;

// Check backend availability periodically
async function ensureBackendStatus(): Promise<void> {
  if (backendCheckInProgress) return;
  
  try {
    backendCheckInProgress = true;
    useBackend = await mockService.checkBackendStatus();
  } finally {
    backendCheckInProgress = false;
  }
}

// Generic wrapper to handle errors and fallback
async function withFallback<T>(
  backendCall: () => Promise<T>,
  mockData: T | (() => T)
): Promise<T> {
  if (!useBackend) {
    return typeof mockData === 'function' ? (mockData as () => T)() : mockData;
  }

  try {
    return await backendCall();
  } catch (error) {
    console.warn('Backend call failed, using mock data:', error);
    useBackend = false; // Switch to mock for future calls
    return typeof mockData === 'function' ? (mockData as () => T)() : mockData;
  }
}

// ========== DOMES ==========

export async function getDomes(): Promise<ApiDome[]> {
  await ensureBackendStatus();
  return withFallback(() => api.getDomes(), mockService.mockDomes);
}

export async function getDome(id: string): Promise<ApiDome> {
  await ensureBackendStatus();
  return withFallback(
    () => api.getDome(id),
    () => {
      const dome = mockService.mockDomes.find(d => d.id === id);
      if (!dome) throw new Error(`Dome ${id} not found`);
      return dome;
    }
  );
}

export async function getDomeInventory(domeId: string): Promise<ApiInventory[]> {
  await ensureBackendStatus();
  return withFallback(
    () => api.getDomeInventory(domeId),
    () => mockService.generateMockInventory(domeId)
  );
}

export async function getDomeSensors(domeId: string): Promise<ApiSensor[]> {
  await ensureBackendStatus();
  return withFallback(
    () => api.getDomeSensors(domeId),
    () => mockService.generateMockSensors(domeId)
  );
}

// ========== RESOURCE CATEGORIES ==========

export async function getResourceCategories(): Promise<ApiResourceCategory[]> {
  await ensureBackendStatus();
  return withFallback(
    () => api.getResourceCategories(),
    mockService.mockResourceCategories
  );
}

// ========== RESOURCES ==========

export async function getResources(): Promise<ApiResource[]> {
  await ensureBackendStatus();
  return withFallback(() => api.getResources(), mockService.mockResources);
}

export async function getResource(id: string): Promise<ApiResource> {
  await ensureBackendStatus();
  return withFallback(
    () => api.getResource(id),
    () => {
      const resource = mockService.mockResources.find(r => r.id === id);
      if (!resource) throw new Error(`Resource ${id} not found`);
      return resource;
    }
  );
}

// ========== TELEMETRY ==========

export async function getLatestTelemetry(sensorId: string): Promise<ApiTelemetryReading> {
  await ensureBackendStatus();
  
  if (!useBackend) {
    // Generate mock telemetry based on sensor ID
    const category = sensorId.includes('power') ? 'POWER' : 
                     sensorId.includes('temp') ? 'TEMPERATURE' : 
                     sensorId.includes('o2') ? 'LIFE_SUPPORT' : 'GENERIC';
    return mockService.generateMockTelemetry(sensorId, category);
  }

  try {
    return await api.getLatestTelemetry(sensorId);
  } catch (error) {
    // If it fails, generate mock data for this specific sensor
    console.warn(`Telemetry not found for sensor ${sensorId}, using mock data`);
    const category = sensorId.includes('power') ? 'POWER' : 
                     sensorId.includes('temp') ? 'TEMPERATURE' : 
                     sensorId.includes('o2') ? 'LIFE_SUPPORT' : 'GENERIC';
    return mockService.generateMockTelemetry(sensorId, category);
  }
}

export async function getTelemetryHistory(
  sensorId: string,
  filters?: api.TelemetryFilters
): Promise<ApiTelemetryReading[]> {
  await ensureBackendStatus();
  
  if (!useBackend) {
    // Generate mock history
    const category = sensorId.includes('power') ? 'POWER' : 
                     sensorId.includes('temp') ? 'TEMPERATURE' : 
                     sensorId.includes('o2') ? 'LIFE_SUPPORT' : 'GENERIC';
    const latest = mockService.generateMockTelemetry(sensorId, category);
    return [latest];
  }

  try {
    return await api.getTelemetryHistory(sensorId, filters);
  } catch (error) {
    console.warn(`Telemetry history not found for sensor ${sensorId}, using mock data`);
    const category = sensorId.includes('power') ? 'POWER' : 
                     sensorId.includes('temp') ? 'TEMPERATURE' : 
                     sensorId.includes('o2') ? 'LIFE_SUPPORT' : 'GENERIC';
    const latest = mockService.generateMockTelemetry(sensorId, category);
    return [latest];
  }
}

// ========== ALERTS ==========

export async function getAlerts(filters?: api.AlertFilters): Promise<ApiAlert[]> {
  await ensureBackendStatus();
  return withFallback(
    () => api.getAlerts(filters),
    () => {
      let alerts = [...mockService.mockAlerts];
      
      // Apply filters if they exist
      if (filters?.onlyActive) {
        alerts = alerts.filter(a => a.is_active);
      }
      if (filters?.domeId) {
        alerts = alerts.filter(a => a.dome_id === filters.domeId);
      }
      if (filters?.level) {
        alerts = alerts.filter(a => a.level === filters.level);
      }
      
      return alerts;
    }
  );
}

export async function acknowledgeAlert(id: string, acknowledgedBy: string): Promise<ApiAlert> {
  await ensureBackendStatus();
  
  if (!useBackend) {
    // Update mock alert
    const alert = mockService.mockAlerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledged_by = acknowledgedBy;
      alert.acknowledged_at = new Date().toISOString();
      return alert;
    }
    throw new Error('Alert not found');
  }

  try {
    return await api.acknowledgeAlert(id, { acknowledgedBy });
  } catch (error) {
    console.warn(`Could not acknowledge alert ${id} in backend, updating locally`);
    const alert = mockService.mockAlerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledged_by = acknowledgedBy;
      alert.acknowledged_at = new Date().toISOString();
      return alert;
    }
    throw error;
  }
}

// ========== SENSORS ==========

export async function getSensors(): Promise<ApiSensor[]> {
  await ensureBackendStatus();
  return withFallback(
    () => api.getSensors(),
    () => {
      // Return sensors from all domes
      return mockService.mockDomes.flatMap(dome => 
        mockService.generateMockSensors(dome.id)
      );
    }
  );
}

export async function getSensor(id: string): Promise<ApiSensor> {
  await ensureBackendStatus();
  return withFallback(
    () => api.getSensor(id),
    () => {
      // Search in all mock sensors
      const allSensors = mockService.mockDomes.flatMap(dome => 
        mockService.generateMockSensors(dome.id)
      );
      const sensor = allSensors.find(s => s.id === id);
      if (!sensor) throw new Error(`Sensor ${id} not found`);
      return sensor;
    }
  );
}

// Re-export types and other functions that don't need fallback
export type { TelemetryFilters, AlertFilters, ResourceLogFilters } from './api';
export { 
  createDome, 
  updateDome, 
  deleteDome,
  inboundInventory,
  transferInventory,
  getResourceLogs,
  ingestTelemetry,
} from './api';

// Function to force backend usage (useful for testing)
export function forceBackendMode(enabled: boolean): void {
  useBackend = enabled;
}

// Function to get current backend state
export function isUsingBackend(): boolean {
  return useBackend;
}

