// Cliente HTTP para comunicarse con el backend Mars Colony Control API
import { API_BASE_URL } from '../config/constants';
import type {
  ApiDome,
  ApiResource,
  ApiResourceCategory,
  ApiInventory,
  ApiSensor,
  ApiTelemetryReading,
  ApiAlert,
  ApiResourceLog,
  CreateDomeDto,
  UpdateDomeDto,
  InboundInventoryDto,
  TransferInventoryDto,
  AcknowledgeAlertDto,
  IngestTelemetryDto,
} from '../types/backend';

// Utility para manejar errores de fetch
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP Error ${response.status}`,
    }));
    throw new Error(error.message || `HTTP Error ${response.status}`);
  }
  return response.json();
}

// ========== DOMES ==========

export async function getDomes(): Promise<ApiDome[]> {
  const response = await fetch(`${API_BASE_URL}/domes`);
  return handleResponse<ApiDome[]>(response);
}

export async function getDome(id: string): Promise<ApiDome> {
  const response = await fetch(`${API_BASE_URL}/domes/${id}`);
  return handleResponse<ApiDome>(response);
}

export async function createDome(data: CreateDomeDto): Promise<ApiDome> {
  const response = await fetch(`${API_BASE_URL}/domes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiDome>(response);
}

export async function updateDome(id: string, data: UpdateDomeDto): Promise<ApiDome> {
  const response = await fetch(`${API_BASE_URL}/domes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiDome>(response);
}

export async function deleteDome(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/domes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete dome: ${response.status}`);
  }
}

export async function getDomeInventory(domeId: string): Promise<ApiInventory[]> {
  const response = await fetch(`${API_BASE_URL}/domes/${domeId}/inventory`);
  return handleResponse<ApiInventory[]>(response);
}

export async function getDomeSensors(domeId: string): Promise<ApiSensor[]> {
  const response = await fetch(`${API_BASE_URL}/domes/${domeId}/sensors`);
  return handleResponse<ApiSensor[]>(response);
}

// ========== RESOURCE CATEGORIES ==========

export async function getResourceCategories(): Promise<ApiResourceCategory[]> {
  const response = await fetch(`${API_BASE_URL}/resource-categories`);
  return handleResponse<ApiResourceCategory[]>(response);
}

// ========== RESOURCES ==========

export async function getResources(): Promise<ApiResource[]> {
  const response = await fetch(`${API_BASE_URL}/resources`);
  return handleResponse<ApiResource[]>(response);
}

export async function getResource(id: string): Promise<ApiResource> {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`);
  return handleResponse<ApiResource>(response);
}

// ========== INVENTORY OPERATIONS ==========

export async function inboundInventory(data: InboundInventoryDto): Promise<ApiInventory[]> {
  const response = await fetch(`${API_BASE_URL}/inventory/inbound`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiInventory[]>(response);
}

export async function transferInventory(data: TransferInventoryDto): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/inventory/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<any>(response);
}

// ========== RESOURCE LOGS ==========

export interface ResourceLogFilters {
  domeId?: string;
  resourceId?: string;
  logType?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export async function getResourceLogs(filters?: ResourceLogFilters): Promise<ApiResourceLog[]> {
  const params = new URLSearchParams();
  if (filters?.domeId) params.append('domeId', filters.domeId);
  if (filters?.resourceId) params.append('resourceId', filters.resourceId);
  if (filters?.logType) params.append('logType', filters.logType);
  if (filters?.from) params.append('from', filters.from);
  if (filters?.to) params.append('to', filters.to);
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const url = `${API_BASE_URL}/resource-logs${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  return handleResponse<ApiResourceLog[]>(response);
}

// ========== TELEMETRY ==========

export interface TelemetryFilters {
  from?: string;
  to?: string;
  limit?: number;
}

export async function getTelemetryHistory(
  sensorId: string,
  filters?: TelemetryFilters
): Promise<ApiTelemetryReading[]> {
  const params = new URLSearchParams();
  if (filters?.from) params.append('from', filters.from);
  if (filters?.to) params.append('to', filters.to);
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const url = `${API_BASE_URL}/telemetry/history/${sensorId}${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  return handleResponse<ApiTelemetryReading[]>(response);
}

export async function getLatestTelemetry(sensorId: string): Promise<ApiTelemetryReading> {
  const response = await fetch(`${API_BASE_URL}/telemetry/latest/${sensorId}`);
  return handleResponse<ApiTelemetryReading>(response);
}

export async function ingestTelemetry(data: IngestTelemetryDto): Promise<ApiTelemetryReading> {
  const response = await fetch(`${API_BASE_URL}/telemetry/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiTelemetryReading>(response);
}

// ========== ALERTS ==========

export interface AlertFilters {
  domeId?: string;
  resourceId?: string;
  level?: string;
  onlyActive?: boolean;
  limit?: number;
}

export async function getAlerts(filters?: AlertFilters): Promise<ApiAlert[]> {
  const params = new URLSearchParams();
  if (filters?.domeId) params.append('domeId', filters.domeId);
  if (filters?.resourceId) params.append('resourceId', filters.resourceId);
  if (filters?.level) params.append('level', filters.level);
  if (filters?.onlyActive !== undefined) params.append('onlyActive', filters.onlyActive.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const url = `${API_BASE_URL}/alerts${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  return handleResponse<ApiAlert[]>(response);
}

export async function acknowledgeAlert(id: string, data: AcknowledgeAlertDto): Promise<ApiAlert> {
  const response = await fetch(`${API_BASE_URL}/alerts/${id}/ack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiAlert>(response);
}

// ========== SENSORS ==========

export async function getSensors(): Promise<ApiSensor[]> {
  const response = await fetch(`${API_BASE_URL}/sensors`);
  return handleResponse<ApiSensor[]>(response);
}

export async function getSensor(id: string): Promise<ApiSensor> {
  const response = await fetch(`${API_BASE_URL}/sensors/${id}`);
  return handleResponse<ApiSensor>(response);
}

