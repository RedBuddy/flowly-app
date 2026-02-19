import { z } from "zod";

import { dateSchema, idSchema, moneySchema } from "./_shared";
import { BUDGET_TYPES } from "./enums";

export const budgetBaseSchema = z.object({
  id: idSchema,
  userId: idSchema,
  name: z.string().min(1),
  type: z.enum([BUDGET_TYPES.RECURRENT, BUDGET_TYPES.PROJECT]),
  totalAssigned: moneySchema,
  spent: moneySchema.default(0),
  createdAt: dateSchema,
});

export const budgetCreateSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del presupuesto es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  type: z.enum([BUDGET_TYPES.RECURRENT, BUDGET_TYPES.PROJECT], {
    message: "Selecciona un tipo válido",
  }),
  totalAssigned: moneySchema,
});

export type BudgetBase = z.infer<typeof budgetBaseSchema>;

export const budgetUpdateSchema = budgetCreateSchema.partial();

export type BudgetFormData = z.infer<typeof budgetCreateSchema>;
