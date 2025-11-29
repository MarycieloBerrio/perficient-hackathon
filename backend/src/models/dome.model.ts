import type { Database } from '../types/database.types';

// Raw table types from Supabase
export type DomeRow = Database['public']['Tables']['domes']['Row'];
export type DomeInsert = Database['public']['Tables']['domes']['Insert'];
export type DomeUpdate = Database['public']['Tables']['domes']['Update'];
