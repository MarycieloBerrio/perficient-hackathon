import type { Database } from '../types/database.types';

export type InventoryRow = Database['public']['Tables']['inventory']['Row'];

export type InventoryInsert =
  Database['public']['Tables']['inventory']['Insert'];

export type InventoryUpdate =
  Database['public']['Tables']['inventory']['Update'];

export interface InventoryWithResource extends InventoryRow {
  resource?: {
    name: string;
    code?: string;
    unit?: string;
    category?: string;
  };
}
