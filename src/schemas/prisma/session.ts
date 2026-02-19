import { z } from "zod";

import { dateSchema, idSchema } from "./_shared";

export const sessionBaseSchema = z.object({
  id: idSchema,
  expiresAt: dateSchema,
  token: z.string().min(1),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: idSchema,
});

export const sessionCreateSchema = sessionBaseSchema.extend({
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

export const sessionUpdateSchema = sessionCreateSchema.partial();
