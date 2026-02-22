import * as z from "zod";

export const paginationSchema = z.object({
  take: z.number().optional().default(10),
  page: z.number().optional().default(1),
});

export const paginatedResponseSchema = <T>(dataSchema: z.ZodType<T>) => {
  return z.object({
    data: z.array(dataSchema),
    count: z.number(),
    totalPages: z.number(),
  });
}

export type PaginationType = z.infer<typeof paginationSchema>;
export type PaginatedResponseType<T> = z.infer<ReturnType<typeof paginatedResponseSchema<T>>>;

