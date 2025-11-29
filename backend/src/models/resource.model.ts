import type { Database } from '../types/database.types';

export type ResourceRow = Database['public']['Tables']['resources']['Row'];

export type ResourceInsert =
  Database['public']['Tables']['resources']['Insert'];

export type ResourceUpdate =
  Database['public']['Tables']['resources']['Update'];
