// src/dtos/resource-log.dto.ts
import { z } from 'zod';

export const resourceLogTypeEnum = z.enum([
  'IMPORT_EARTH',
  'EXTRACTION',
  'PRODUCTION',
  'CONSUMPTION',
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'LOSS',
  'ADJUSTMENT',
]);

export const resourceLogFilterSchema = z.object({
  domeId: z.uuid().optional(),
  resourceId: z.uuid().optional(),
  logType: resourceLogTypeEnum.optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
  limit: z.number().int().positive().max(500).default(100),
});

export type ResourceLogFilterDTO = z.infer<typeof resourceLogFilterSchema>;
