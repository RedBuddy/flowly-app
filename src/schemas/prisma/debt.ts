import { z } from "zod";

import { dateSchema, idSchema, moneySchema } from "./_shared";
import { DEBT_PRIORITIES } from "./enums";

export const debtBaseSchema = z.object({
  id: idSchema,
  userId: idSchema,
  name: z.string().min(1),
  totalDebt: moneySchema,
  remaining: moneySchema.default(0),
  minimumPayment: moneySchema.nullable(),
  dueDate: dateSchema.nullable(),
  priority: z.enum([DEBT_PRIORITIES.HIGH, DEBT_PRIORITIES.MEDIUM, DEBT_PRIORITIES.LOW]),
  createdAt: dateSchema,
});

export const debtCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Nombre muy largo"),
  totalDebt: moneySchema,
  minimumPayment: moneySchema.optional(),
  dueDate: dateSchema.nullable().optional(),
  priority: z.enum([DEBT_PRIORITIES.HIGH, DEBT_PRIORITIES.MEDIUM, DEBT_PRIORITIES.LOW]),
});

export const debtUpdateSchema = debtCreateSchema.partial();

export type DebtFormData = z.infer<typeof debtCreateSchema>;

