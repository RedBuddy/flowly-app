import { z } from "zod";

import { dateSchema, idSchema, moneySchema } from "./_shared";

export const userBaseSchema = z.object({
  id: idSchema,
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  fullName: z.string().nullable(),
  totalMoney: moneySchema,
  unassignedMoney: moneySchema,
});

export const userCreateSchema = userBaseSchema.extend({
  image: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  totalMoney: moneySchema.optional(),
  unassignedMoney: moneySchema.optional(),
  emailVerified: z.boolean().optional(),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
});

export const userUpdateSchema = userCreateSchema.partial();
