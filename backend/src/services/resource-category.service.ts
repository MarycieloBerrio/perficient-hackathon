// src/services/resource-category.service.ts
import { supabaseAdmin } from '../config/supabase';
import type { Database } from '../types/database.types';
import type {
  CreateResourceCategoryDTO,
  UpdateResourceCategoryDTO,
} from '../dtos';

type ResourceCategoryRow =
  Database['public']['Tables']['resource_categories']['Row'];
type ResourceCategoryInsert =
  Database['public']['Tables']['resource_categories']['Insert'];
type ResourceCategoryUpdate =
  Database['public']['Tables']['resource_categories']['Update'];

export class ResourceCategoryService {
  async getAllCategories(): Promise<ResourceCategoryRow[]> {
    const { data, error } = await supabaseAdmin
      .from('resource_categories')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async createCategory(
    input: CreateResourceCategoryDTO
  ): Promise<ResourceCategoryRow> {
    const payload: ResourceCategoryInsert = {
      key: input.key,
      name: input.name,
      description: input.description ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from('resource_categories')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async updateCategory(
    id: number,
    input: UpdateResourceCategoryDTO
  ): Promise<ResourceCategoryRow> {
    const payload: ResourceCategoryUpdate = {};

    if (input.key !== undefined) payload.key = input.key;
    if (input.name !== undefined) payload.name = input.name;
    if (input.description !== undefined)
      payload.description = input.description;

    const { data, error } = await supabaseAdmin
      .from('resource_categories')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCategory(id: number): Promise<void> {
    const { error } = await supabaseAdmin
      .from('resource_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
