// src/services/inventory.service.ts
import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase';
import type { Database } from '../types/database.types';
import type {
  UpsertInventoryDTO,
  InventoryInboundDTO,
  InventoryTransferInput,
} from '../dtos';

type InventoryRow = Database['public']['Tables']['inventory']['Row'];
type InventoryInsert = Database['public']['Tables']['inventory']['Insert'];
type InventoryUpdate = Database['public']['Tables']['inventory']['Update'];

type ResourceLogInsert =
  Database['public']['Tables']['resource_logs']['Insert'];

export class InventoryService {
  async getInventoryByDome(domeId: string): Promise<InventoryRow[]> {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select(
        'id, dome_id, resource_id, quantity, reserved, min_threshold, max_threshold, updated_at, resources(*)'
      )
      .eq('dome_id', domeId)
      .order('id', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async upsertInventory(input: UpsertInventoryDTO): Promise<InventoryRow> {
    const payload: InventoryInsert = {
      dome_id: input.domeId,
      resource_id: input.resourceId,
      quantity: input.quantity ?? 0,
      reserved: input.reserved ?? 0,
      min_threshold: input.minThreshold ?? null,
      max_threshold: input.maxThreshold ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from('inventory')
      .upsert(payload, {
        onConflict: 'dome_id,resource_id',
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Inbound supply: increases inventory for a dome and creates IMPORT_EARTH logs
   */
  async receiveInbound(input: InventoryInboundDTO) {
    const { domeId, missionName, operatorId, items } = input;

    const logs: ResourceLogInsert[] = [];

    for (const item of items) {
      // Read existing inventory
      const { data: existing, error: selErr } = await supabaseAdmin
        .from('inventory')
        .select('id, quantity, reserved')
        .eq('dome_id', domeId)
        .eq('resource_id', item.resourceId)
        .maybeSingle();

      if (selErr) throw selErr;

      if (!existing) {
        const newInv: InventoryInsert = {
          dome_id: domeId,
          resource_id: item.resourceId,
          quantity: item.amount,
          reserved: 0,
        };
        const { error: insErr } = await supabaseAdmin
          .from('inventory')
          .insert(newInv);
        if (insErr) throw insErr;
      } else {
        const upd: InventoryUpdate = {
          quantity: existing.quantity + item.amount,
        };
        const { error: updErr } = await supabaseAdmin
          .from('inventory')
          .update(upd)
          .eq('id', existing.id);
        if (updErr) throw updErr;
      }

      logs.push({
        resource_id: item.resourceId,
        dome_id: domeId,
        log_type: 'IMPORT_EARTH',
        amount: item.amount,
        mission_name: missionName ?? null,
        operator_id: operatorId ?? null,
        metadata: null,
        notes: 'Inbound supply',
      });
    }

    if (logs.length > 0) {
      const { error: logErr } = await supabaseAdmin
        .from('resource_logs')
        .insert(logs);
      if (logErr) throw logErr;
    }

    const inventory = await this.getInventoryByDome(domeId);

    return {
      domeId,
      missionName: missionName ?? null,
      items,
      inventory,
    };
  }

  /**
   * Transfer resources between domes, with TRANSFER_OUT / TRANSFER_IN logs
   */
  async transferResources(input: InventoryTransferInput) {
    const { fromDomeId, toDomeId, resourceId, amount, operatorId } = input;

    if (fromDomeId === toDomeId) {
      throw new Error('Source and target dome must be different');
    }

    // 1) Source inventory
    const { data: src, error: srcErr } = await supabaseAdmin
      .from('inventory')
      .select('id, quantity')
      .eq('dome_id', fromDomeId)
      .eq('resource_id', resourceId)
      .single();

    if (srcErr) throw srcErr;
    if (!src) throw new Error('Source inventory not found');

    if (src.quantity < amount) {
      throw new Error('Insufficient quantity in source dome');
    }

    // 2) Update source
    const srcUpdate: InventoryUpdate = {
      quantity: src.quantity - amount,
    };

    const { error: updSrcErr } = await supabaseAdmin
      .from('inventory')
      .update(srcUpdate)
      .eq('id', src.id);

    if (updSrcErr) throw updSrcErr;

    // 3) Target inventory (upsert-like)
    const { data: tgt, error: tgtSelErr } = await supabaseAdmin
      .from('inventory')
      .select('id, quantity')
      .eq('dome_id', toDomeId)
      .eq('resource_id', resourceId)
      .maybeSingle();

    if (tgtSelErr) throw tgtSelErr;

    if (!tgt) {
      const tgtInsert: InventoryInsert = {
        dome_id: toDomeId,
        resource_id: resourceId,
        quantity: amount,
        reserved: 0,
      };
      const { error: insErr } = await supabaseAdmin
        .from('inventory')
        .insert(tgtInsert);
      if (insErr) throw insErr;
    } else {
      const tgtUpdate: InventoryUpdate = {
        quantity: tgt.quantity + amount,
      };
      const { error: updErr } = await supabaseAdmin
        .from('inventory')
        .update(tgtUpdate)
        .eq('id', tgt.id);
      if (updErr) throw updErr;
    }

    // 4) Logs
    const transferGroup = crypto.randomUUID();
    const logs: ResourceLogInsert[] = [
      {
        resource_id: resourceId,
        dome_id: fromDomeId,
        log_type: 'TRANSFER_OUT',
        amount: -amount,
        transfer_group: transferGroup,
        operator_id: operatorId ?? null,
        mission_name: null,
        metadata: null,
        notes: 'Transfer between domes',
      },
      {
        resource_id: resourceId,
        dome_id: toDomeId,
        log_type: 'TRANSFER_IN',
        amount,
        transfer_group: transferGroup,
        operator_id: operatorId ?? null,
        mission_name: null,
        metadata: null,
        notes: 'Transfer between domes',
      },
    ];

    const { error: logErr } = await supabaseAdmin
      .from('resource_logs')
      .insert(logs);

    if (logErr) throw logErr;

    const [sourceInventory, targetInventory] = await Promise.all([
      this.getInventoryByDome(fromDomeId),
      this.getInventoryByDome(toDomeId),
    ]);

    return {
      transferGroup,
      fromDomeId,
      toDomeId,
      resourceId,
      amount,
      sourceInventory,
      targetInventory,
    };
  }
}
