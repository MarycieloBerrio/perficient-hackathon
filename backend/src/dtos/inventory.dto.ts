// src/dtos/inventory.dto.ts
import { z } from 'zod';

export const upsertInventorySchema = z.object({
  domeId: z.uuid(),
  resourceId: z.uuid(),
  quantity: z.number().nonnegative().default(0),
  reserved: z.number().nonnegative().default(0),
  minThreshold: z.number().nullable().optional(),
  maxThreshold: z.number().nullable().optional(),
});

export type UpsertInventoryDTO = z.infer<typeof upsertInventorySchema>;

/**
 * Inbound supply: incoming resources to a dome
 */
export const inventoryInboundItemSchema = z.object({
  resourceId: z.uuid(),
  amount: z.number().positive(),
});

export const inventoryInboundSchema = z.object({
  domeId: z.uuid(),
  missionName: z.string().min(1).optional(), // maps to mission_name in resource_logs
  operatorId: z.uuid().optional(),
  items: z.array(inventoryInboundItemSchema).min(1),
});

export type InventoryInboundDTO = z.infer<typeof inventoryInboundSchema>;

/**
 * Transfer between domes
 */
export const inventoryTransferSchema = z.object({
  fromDomeId: z.uuid(),
  toDomeId: z.uuid(),
  resourceId: z.uuid(),
  amount: z.number().positive(),
  operatorId: z.uuid().optional(),
});

export type InventoryTransferInput = z.infer<typeof inventoryTransferSchema>;
