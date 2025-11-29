// src/services/alert.service.ts
import { supabaseAdmin } from '../config/supabase';
import type { Database } from '../types/database.types';
import type {
  CreateAlertDTO,
  AlertFilterDTO,
  AcknowledgeAlertDTO,
} from '../dtos';

type AlertRow = Database['public']['Tables']['alerts']['Row'];
type AlertInsert = Database['public']['Tables']['alerts']['Insert'];
type AlertUpdate = Database['public']['Tables']['alerts']['Update'];

export class AlertService {
  async listAlerts(filter: AlertFilterDTO): Promise<AlertRow[]> {
    let query = supabaseAdmin
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(filter.limit);

    if (filter.onlyActive) {
      query = query.eq('is_active', true);
    }

    if (filter.domeId) {
      query = query.eq('dome_id', filter.domeId);
    }

    if (filter.resourceId) {
      query = query.eq('resource_id', filter.resourceId);
    }

    if (filter.level) {
      query = query.eq('level', filter.level);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async createAlert(input: CreateAlertDTO): Promise<AlertRow> {
    const payload: AlertInsert = {
      code: input.code, // required, string (no null)
      level: input.level,
      message: input.message,
      is_active: true,
      acknowledged: false,
      // created_at has default
    };

    if (input.domeId !== undefined) {
      payload.dome_id = input.domeId;
    }
    if (input.resourceId !== undefined) {
      payload.resource_id = input.resourceId;
    }
    if (input.sensorId !== undefined) {
      payload.sensor_id = input.sensorId;
    }

    const { data, error } = await supabaseAdmin
      .from('alerts')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async acknowledgeAlert(input: AcknowledgeAlertDTO): Promise<AlertRow> {
    const { alertId, acknowledgedBy } = input;

    const payload: AlertUpdate = {
      is_active: false,
      acknowledged: true,
      acknowledged_at: new Date().toISOString(),
    };

    if (acknowledgedBy !== undefined) {
      payload.acknowledged_by = acknowledgedBy;
    }

    const { data, error } = await supabaseAdmin
      .from('alerts')
      .update(payload)
      .eq('id', alertId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
}
