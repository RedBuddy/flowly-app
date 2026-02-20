import { z } from "zod";

import { dateSchema, moneySchema } from "./_shared";

export const goalCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Nombre muy largo"),
  target: moneySchema,
  deadline: dateSchema.nullable().optional(),
});

export const goalUpdateSchema = goalCreateSchema.partial();

export type GoalFormData = z.infer<typeof goalCreateSchema>;

