import type { Database } from '../types/database.types';

export type ResourceLogRow =
  Database['public']['Tables']['resource_logs']['Row'];

export type ResourceLogInsert =
  Database['public']['Tables']['resource_logs']['Insert'];

export type ResourceLogUpdate =
  Database['public']['Tables']['resource_logs']['Update'];
