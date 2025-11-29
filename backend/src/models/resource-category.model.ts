import type { Database } from '../types/database.types';

export type ResourceCategoryRow =
  Database['public']['Tables']['resource_categories']['Row'];

export type ResourceCategoryInsert =
  Database['public']['Tables']['resource_categories']['Insert'];

export type ResourceCategoryUpdate =
  Database['public']['Tables']['resource_categories']['Update'];
