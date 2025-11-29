import type { Database } from '../types/database.types';

export type AlertRow = Database['public']['Tables']['alerts']['Row'];

export type AlertInsert = Database['public']['Tables']['alerts']['Insert'];

export type AlertUpdate = Database['public']['Tables']['alerts']['Update'];
