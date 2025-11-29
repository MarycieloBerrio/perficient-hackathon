// src/services/colony-summary.service.ts
import { supabaseAdmin } from '../config/supabase';

export interface ColonySummary {
  totalDomes: number;
  domesByStatus: Record<string, number>;
  totalResourcesByCode: Record<string, number>;
}

export class ColonySummaryService {
  async getSummary(): Promise<ColonySummary> {
    // 1) domes count and by status
    const { data: domes, error: domesErr } = await supabaseAdmin
      .from('domes')
      .select('status', { count: 'exact', head: false });

    if (domesErr) throw domesErr;

    const domesByStatus: Record<string, number> = {};
    for (const d of domes ?? []) {
      const key = (d as any).status as string;
      domesByStatus[key] = (domesByStatus[key] ?? 0) + 1;
    }

    const totalDomes = domes?.length ?? 0;

    // 2) aggregate inventory by resource code
    const { data: invAgg, error: invErr } = await supabaseAdmin
      .from('inventory')
      .select('quantity, resources!inner(code)')
      .gt('quantity', 0);

    if (invErr) throw invErr;

    const totalResourcesByCode: Record<string, number> = {};
    for (const row of invAgg ?? []) {
      const r = row as any;
      const code = r.resources.code as string;
      const qty = Number(r.quantity ?? 0);
      totalResourcesByCode[code] = (totalResourcesByCode[code] ?? 0) + qty;
    }

    return {
      totalDomes,
      domesByStatus,
      totalResourcesByCode,
    };
  }
}
