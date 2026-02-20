import { z } from "zod";

import { idSchema, moneySchema } from "./_shared";

export const goalContributionCreateSchema = z.object({
  goalId: idSchema,
  amount: moneySchema,
  description: z.string().max(500, "Descripción muy larga").nullable().optional(),
});

export const goalContributionUpdateSchema = goalContributionCreateSchema.partial();

export type GoalContributionFormData = z.infer<typeof goalContributionCreateSchema>;

