// src/services/dome.service.ts
import { supabaseAdmin } from '../config/supabase';
import type { Database } from '../types/database.types';
import type { CreateDomeDTO, UpdateDomeDTO } from '../dtos';

type DomeRow = Database['public']['Tables']['domes']['Row'];
type DomeInsert = Database['public']['Tables']['domes']['Insert'];
type DomeUpdate = Database['public']['Tables']['domes']['Update'];

export class DomeService {
  async getAllDomes(): Promise<DomeRow[]> {
    const { data, error } = await supabaseAdmin
      .from('domes')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getDomeById(id: string): Promise<DomeRow | null> {
    const { data, error } = await supabaseAdmin
      .from('domes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createDome(input: CreateDomeDTO): Promise<DomeRow> {
    const payload: DomeInsert = {
      code: input.code,
      name: input.name,
      dome_type: input.domeType,
      status: input.status ?? 'OPERATIONAL',
      alert_level: input.alertLevel ?? 0,
      // created_at / updated_at are handled by DB defaults
    };

    const { data, error } = await supabaseAdmin
      .from('domes')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async updateDome(id: string, input: UpdateDomeDTO): Promise<DomeRow> {
    const payload: DomeUpdate = {};

    if (input.code !== undefined) payload.code = input.code;
    if (input.name !== undefined) payload.name = input.name;
    if (input.domeType !== undefined) payload.dome_type = input.domeType;
    if (input.status !== undefined) payload.status = input.status;
    if (input.alertLevel !== undefined) payload.alert_level = input.alertLevel;

    const { data, error } = await supabaseAdmin
      .from('domes')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDome(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from('domes').delete().eq('id', id);
    if (error) throw error;
  }
}
