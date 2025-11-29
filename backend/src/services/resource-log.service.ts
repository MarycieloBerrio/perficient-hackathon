// src/services/resource-log.service.ts
import { supabaseAdmin } from '../config/supabase';
import type { Database } from '../types/database.types';
import type { ResourceLogFilterDTO } from '../dtos';

type ResourceLogRow = Database['public']['Tables']['resource_logs']['Row'];

export class ResourceLogService {
  async listLogs(filter: ResourceLogFilterDTO): Promise<ResourceLogRow[]> {
    let query = supabaseAdmin
      .from('resource_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(filter.limit);

    if (filter.domeId) {
      query = query.eq('dome_id', filter.domeId);
    }

    if (filter.resourceId) {
      query = query.eq('resource_id', filter.resourceId);
    }

    if (filter.logType) {
      query = query.eq('log_type', filter.logType);
    }

    if (filter.from) {
      query = query.gte('created_at', filter.from);
    }

    if (filter.to) {
      query = query.lte('created_at', filter.to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }
}
