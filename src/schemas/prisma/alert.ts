import { z } from "zod";

import { dateSchema, idSchema } from "./_shared";

export const alertBaseSchema = z.object({
  id: idSchema,
  userId: idSchema,
  type: z.enum(["debt", "budget", "goal"]),
  title: z.string().min(1),
  message: z.string().min(1),
  isRead: z.boolean(),
  createdAt: dateSchema,
});

export const alertCreateSchema = alertBaseSchema.extend({
  id: idSchema.optional(),
  isRead: z.boolean().optional(),
  createdAt: dateSchema.optional(),
});

export const alertUpdateSchema = alertCreateSchema.partial();
