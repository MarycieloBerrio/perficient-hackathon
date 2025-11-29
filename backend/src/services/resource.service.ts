// src/services/resource.service.ts
import { supabaseAdmin } from '../config/supabase';
import type { Database } from '../types/database.types';
import type { CreateResourceDTO, UpdateResourceDTO } from '../dtos';

type ResourceRow = Database['public']['Tables']['resources']['Row'];
type ResourceInsert = Database['public']['Tables']['resources']['Insert'];
type ResourceUpdate = Database['public']['Tables']['resources']['Update'];

export class ResourceService {
  async getAllResources(): Promise<ResourceRow[]> {
    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*, resource_categories(*)')
      .order('code', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getResourceById(id: string): Promise<ResourceRow | null> {
    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createResource(input: CreateResourceDTO): Promise<ResourceRow> {
    const payload: ResourceInsert = {
      code: input.code,
      name: input.name,
      category_id: input.categoryId,
      unit: input.unit,
      is_vital: input.isVital ?? false,
      subcategory: input.subcategory ?? null,
      metadata: input.metadata ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from('resources')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async updateResource(
    id: string,
    input: UpdateResourceDTO
  ): Promise<ResourceRow> {
    const payload: ResourceUpdate = {};

    if (input.code !== undefined) payload.code = input.code;
    if (input.name !== undefined) payload.name = input.name;
    if (input.categoryId !== undefined) payload.category_id = input.categoryId;
    if (input.unit !== undefined) payload.unit = input.unit;
    if (input.isVital !== undefined) payload.is_vital = input.isVital;
    if (input.subcategory !== undefined)
      payload.subcategory = input.subcategory;
    if (input.metadata !== undefined) payload.metadata = input.metadata;

    const { data, error } = await supabaseAdmin
      .from('resources')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async deleteResource(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('resources')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
