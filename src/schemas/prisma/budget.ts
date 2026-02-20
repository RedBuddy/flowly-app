import { z } from "zod";

import { moneySchema } from "./_shared";
import { BUDGET_TYPES } from "./enums";

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

export const budgetUpdateSchema = budgetCreateSchema.partial();

export type BudgetFormData = z.infer<typeof budgetCreateSchema>;
