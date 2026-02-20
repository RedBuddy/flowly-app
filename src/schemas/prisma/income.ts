import { z } from "zod";

import { moneySchema } from "./_shared";

export const incomeCreateSchema = z.object({
  amount: moneySchema,
  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .nullable()
    .optional(),
});

export const incomeUpdateSchema = incomeCreateSchema.partial();

export type IncomeFormData = z.infer<typeof incomeCreateSchema>;