import { z } from "zod";

import { dateSchema, idSchema } from "./_shared";

export const sessionCreateSchema = z.object({
  id: idSchema,
  expiresAt: dateSchema,
  token: z.string().min(1),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  userId: idSchema,
});

export const sessionUpdateSchema = sessionCreateSchema.partial();
