import { z } from "zod";

import { dateSchema, idSchema } from "./_shared";

export const verificationBaseSchema = z.object({
  id: idSchema,
  identifier: z.string().min(1),
  value: z.string().min(1),
  expiresAt: dateSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const verificationCreateSchema = verificationBaseSchema.extend({
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
});

export const verificationUpdateSchema = verificationCreateSchema.partial();
