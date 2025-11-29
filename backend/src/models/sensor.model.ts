import type { Database } from '../types/database.types';

export type SensorRow = Database['public']['Tables']['sensors']['Row'];

export type SensorInsert = Database['public']['Tables']['sensors']['Insert'];

export type SensorUpdate = Database['public']['Tables']['sensors']['Update'];
