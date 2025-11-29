import { z } from 'zod';

export const createResourceCategorySchema = z.object({
  key: z.string().min(1), // maps to key
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

export type CreateResourceCategoryDTO = z.infer<
  typeof createResourceCategorySchema
>;

export const updateResourceCategorySchema =
  createResourceCategorySchema.partial();

export type UpdateResourceCategoryDTO = z.infer<
  typeof updateResourceCategorySchema
>;
