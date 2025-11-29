// src/dtos/alert.dto.ts
import { z } from 'zod';

export const alertLevelEnum = z.enum(['INFO', 'WARNING', 'CRITICAL']);

/**
 * Create new alert (manual or system-generated)
 */
export const createAlertSchema = z.object({
  code: z.string().min(1), // required in Insert
  level: alertLevelEnum,
  message: z.string().min(1),
  domeId: z.uuid().nullable().optional(),
  resourceId: z.uuid().nullable().optional(),
  sensorId: z.uuid().nullable().optional(),
});

export type CreateAlertDTO = z.infer<typeof createAlertSchema>;

/**
 * Filter for listing alerts
 */
export const alertFilterSchema = z.object({
  domeId: z.uuid().optional(),
  resourceId: z.uuid().optional(),
  level: alertLevelEnum.optional(),
  onlyActive: z.boolean().default(true),
  limit: z.number().int().positive().max(200).default(50),
});

export type AlertFilterDTO = z.infer<typeof alertFilterSchema>;

/**
 * Acknowledge/close alert
 */
export const acknowledgeAlertSchema = z.object({
  alertId: z.uuid(),
  acknowledgedBy: z.string().min(1).optional(),
});

export type AcknowledgeAlertDTO = z.infer<typeof acknowledgeAlertSchema>;
