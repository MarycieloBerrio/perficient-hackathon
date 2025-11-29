// src/services/sensor.service.ts
import { supabaseAdmin } from '../config/supabase';
import type { Database } from '../types/database.types';
import type { CreateSensorDTO, UpdateSensorDTO } from '../dtos';

type SensorRow = Database['public']['Tables']['sensors']['Row'];
type SensorInsert = Database['public']['Tables']['sensors']['Insert'];
type SensorUpdate = Database['public']['Tables']['sensors']['Update'];

export class SensorService {
  async getAllSensors(): Promise<SensorRow[]> {
    const { data, error } = await supabaseAdmin
      .from('sensors')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getSensorsByDome(domeId: string): Promise<SensorRow[]> {
    const { data, error } = await supabaseAdmin
      .from('sensors')
      .select('*')
      .eq('dome_id', domeId)
      .order('code', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async createSensor(input: CreateSensorDTO): Promise<SensorRow> {
    const payload: SensorInsert = {
      code: input.code,
      name: input.name,
      category: input.category,
      unit: input.unit,
      dome_id: input.domeId ?? null,
      is_critical: input.isCritical ?? false,
      metadata: input.metadata ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from('sensors')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async updateSensor(id: string, input: UpdateSensorDTO): Promise<SensorRow> {
    const payload: SensorUpdate = {};

    if (input.code !== undefined) payload.code = input.code;
    if (input.name !== undefined) payload.name = input.name;
    if (input.category !== undefined) payload.category = input.category;
    if (input.unit !== undefined) payload.unit = input.unit;
    if (input.domeId !== undefined) payload.dome_id = input.domeId;
    if (input.isCritical !== undefined) payload.is_critical = input.isCritical;
    if (input.metadata !== undefined) payload.metadata = input.metadata;

    const { data, error } = await supabaseAdmin
      .from('sensors')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSensor(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from('sensors').delete().eq('id', id);
    if (error) throw error;
  }
}
