import { z } from 'zod';

export const createDomeSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  domeType: z.string().min(1), // maps to dome_type
  status: z.string().min(1).default('OPERATIONAL'),
  alertLevel: z.number().int().nonnegative().default(0),
});

export type CreateDomeDTO = z.infer<typeof createDomeSchema>;

export const updateDomeSchema = createDomeSchema.partial();

export type UpdateDomeDTO = z.infer<typeof updateDomeSchema>;
