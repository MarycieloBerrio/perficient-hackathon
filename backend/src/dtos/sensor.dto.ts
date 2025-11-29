// src/dtos/sensor.dto.ts
import { z } from 'zod';
import type { Json } from '../types/database.types';

export const sensorCategoryEnum = z.enum([
  'LIFE_SUPPORT',
  'POWER',
  'ENVIRONMENT',
  'STRUCTURE',
]);

export const createSensorSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  category: sensorCategoryEnum,
  unit: z.string().min(1),
  domeId: z.uuid().nullable().optional(),
  isCritical: z.boolean().default(false),
  metadata: z.custom<Json>().nullable().optional(),
});

export type CreateSensorDTO = z.infer<typeof createSensorSchema>;

export const updateSensorSchema = createSensorSchema.partial();

export type UpdateSensorDTO = z.infer<typeof updateSensorSchema>;
