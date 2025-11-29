// Tipos para las respuestas del backend API

export interface ApiDome {
  id: string;
  code: string;
  name: string;
  dome_type: string;
  status: string;
  alert_level: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResourceCategory {
  id: number;
  key: string;
  name: string;
  description: string | null;
}

export interface ApiResource {
  id: string;
  code: string;
  name: string;
  unit: string;
  is_vital: boolean;
  category_id: number;
  subcategory: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  resource_categories?: ApiResourceCategory;
}

export interface ApiInventory {
  id: number;
  dome_id: string;
  resource_id: string;
  quantity: number;
  reserved: number;
  min_threshold: number;
  max_threshold: number;
  updated_at: string;
  resources: ApiResource;
}

export interface ApiSensor {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  dome_id: string;
  is_critical: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface ApiTelemetryReading {
  id: number;
  sensor_id: string;
  value: number;
  created_at: string;
}

export interface ApiAlert {
  id: string;
  code: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  dome_id: string | null;
  resource_id: string | null;
  sensor_id: string | null;
  is_active: boolean;
  acknowledged: boolean;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
}

export interface ApiResourceLog {
  id: number;
  resource_id: string;
  dome_id: string;
  log_type: string;
  amount: number;
  mission_name: string | null;
  operator_id: string | null;
  transfer_group: string | null;
  metadata: Record<string, any> | null;
  notes: string | null;
  created_at: string;
}

// DTOs para requests
export interface CreateDomeDto {
  code: string;
  name: string;
  domeType: string;
  status: string;
  alertLevel: number;
}

export interface UpdateDomeDto {
  code?: string;
  name?: string;
  domeType?: string;
  status?: string;
  alertLevel?: number;
}

export interface InboundInventoryDto {
  domeId: string;
  missionName: string;
  operatorId: string;
  items: Array<{
    resourceId: string;
    amount: number;
  }>;
}

export interface TransferInventoryDto {
  fromDomeId: string;
  toDomeId: string;
  resourceId: string;
  amount: number;
  operatorId: string;
}

export interface AcknowledgeAlertDto {
  acknowledgedBy: string;
}

export interface IngestTelemetryDto {
  sensorId: string;
  value: number;
  createdAt?: string;
}

