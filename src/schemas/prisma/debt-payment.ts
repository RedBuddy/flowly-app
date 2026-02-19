import { z } from "zod";

import { dateSchema, idSchema, moneySchema } from "./_shared";

export const debtPaymentBaseSchema = z.object({
  id: idSchema,
  debtId: idSchema,
  userId: idSchema,
  amount: moneySchema,
  description: z.string().nullable(),
  date: dateSchema,
  createdAt: dateSchema,
});

export const debtPaymentCreateSchema = z.object({
  debtId: idSchema,
  amount: moneySchema,
  description: z.string().max(500, "Descripción muy larga").nullable().optional(),
});

export const debtPaymentUpdateSchema = debtPaymentCreateSchema.partial();

export type DebtPaymentFormData = z.infer<typeof debtPaymentCreateSchema>;

