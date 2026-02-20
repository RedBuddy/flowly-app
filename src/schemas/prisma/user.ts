import { z } from "zod";

import { dateSchema, idSchema, moneySchema } from "./_shared";

export const userCreateSchema = z.object({
  id: idSchema,
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  totalMoney: moneySchema.optional(),
  unassignedMoney: moneySchema.optional(),
  emailVerified: z.boolean().optional(),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
});

export const userUpdateSchema = userCreateSchema.partial();
