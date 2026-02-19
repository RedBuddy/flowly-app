import { z } from "zod";

import { dateSchema, idSchema, moneySchema } from "./_shared";
import { TRANSACTION_TYPES } from "./enums";

export const budgetTransactionBaseSchema = z.object({
  id: idSchema,
  budgetId: idSchema,
  userId: idSchema,
  amount: moneySchema,
  description: z.string().nullable(),
  type: z.enum([TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.ASSIGNMENT]),
  date: dateSchema,
  createdAt: dateSchema,
});

export const budgetTransactionCreateSchema = z.object({
  budgetId: idSchema,
  amount: moneySchema,
  description: z.string().max(500, "Descripción muy larga").nullable().optional(),
  type: z.enum([TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.ASSIGNMENT]),
});

export const budgetTransactionUpdateSchema = budgetTransactionCreateSchema.partial();

export type BudgetTransactionFormData = z.infer<typeof budgetTransactionCreateSchema>;

