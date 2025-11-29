// src/services/telemetry.service.ts
import { supabaseAdmin } from '../config/supabase';
import type { Database } from '../types/database.types';
import type { IngestTelemetryDTO, TelemetryQueryDTO } from '../dtos';

type TelemetryRow = Database['public']['Tables']['telemetry_readings']['Row'];
type TelemetryInsert =
  Database['public']['Tables']['telemetry_readings']['Insert'];

export class TelemetryService {
  async getHistory(input: TelemetryQueryDTO): Promise<TelemetryRow[]> {
    const { sensorId, from, to, limit } = input;

    let query = supabaseAdmin
      .from('telemetry_readings')
      .select('*')
      .eq('sensor_id', sensorId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (from) {
      query = query.gte('created_at', from);
    }

    if (to) {
      query = query.lte('created_at', to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async getLatestBySensor(sensorId: string): Promise<TelemetryRow | null> {
    const { data, error } = await supabaseAdmin
      .from('telemetry_readings')
      .select('*')
      .eq('sensor_id', sensorId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async ingestReading(input: IngestTelemetryDTO): Promise<TelemetryRow> {
    const payload: TelemetryInsert = {
      sensor_id: input.sensorId,
      value: input.value,
      created_at: input.createdAt ?? undefined,
    };

    const { data, error } = await supabaseAdmin
      .from('telemetry_readings')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
}
