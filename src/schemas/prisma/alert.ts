import { z } from "zod";

import { dateSchema, idSchema } from "./_shared";

export const alertCreateSchema = z.object({
  id: idSchema.optional(),
  userId: idSchema,
  type: z.enum(["debt", "budget", "goal"]),
  title: z.string().min(1),
  message: z.string().min(1),
  isRead: z.boolean().optional(),
  createdAt: dateSchema.optional(),
});

export const alertUpdateSchema = alertCreateSchema.partial();

export type AlertFormData = z.infer<typeof alertCreateSchema>;
