import { z } from "zod";

import { dateSchema, idSchema } from "./_shared";

export const accountCreateSchema = z.object({
  id: idSchema,
  accountId: z.string().min(1),
  providerId: z.string().min(1),
  userId: idSchema,
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  idToken: z.string().nullable().optional(),
  accessTokenExpiresAt: dateSchema.nullable().optional(),
  refreshTokenExpiresAt: dateSchema.nullable().optional(),
  scope: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
});

export const accountUpdateSchema = accountCreateSchema.partial();
