import { z } from "zod";

import { dateSchema, idSchema, moneySchema } from "./_shared";

export const goalContributionBaseSchema = z.object({
  id: idSchema,
  goalId: idSchema,
  userId: idSchema,
  amount: moneySchema,
  description: z.string().nullable(),
  date: dateSchema,
  createdAt: dateSchema,
});

export const goalContributionCreateSchema = z.object({
  goalId: idSchema,
  amount: moneySchema,
  description: z.string().max(500, "Descripción muy larga").nullable().optional(),
});

export const goalContributionUpdateSchema = goalContributionCreateSchema.partial();

export type GoalContributionFormData = z.infer<typeof goalContributionCreateSchema>;

