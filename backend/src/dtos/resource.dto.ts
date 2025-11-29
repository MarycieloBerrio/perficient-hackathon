// src/dtos/resource.dto.ts
import { z } from 'zod';
import type { Json } from '../types/database.types';

export const createResourceSchema = z.object({
  code: z.string().min(1), // 'WATER', 'OXYGEN', ...
  name: z.string().min(1),
  categoryId: z.number().int(), // maps to category_id (number!)
  unit: z.string().min(1), // 'kg', 'L', ...
  isVital: z.boolean().default(false), // maps to is_vital
  subcategory: z.string().nullable().optional(),
  metadata: z.custom<Json>().nullable().optional(),
});

export type CreateResourceDTO = z.infer<typeof createResourceSchema>;

export const updateResourceSchema = createResourceSchema.partial();

export type UpdateResourceDTO = z.infer<typeof updateResourceSchema>;
