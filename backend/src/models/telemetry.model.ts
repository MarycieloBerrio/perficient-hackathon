import type { Database } from '../types/database.types';

export type TelemetryReadingRow =
  Database['public']['Tables']['telemetry_readings']['Row'];

export type TelemetryReadingInsert =
  Database['public']['Tables']['telemetry_readings']['Insert'];

export type TelemetryReadingUpdate =
  Database['public']['Tables']['telemetry_readings']['Update'];

export interface TelemetrySeriesPoint {
  timestamp: string;
  value: number;
}
