import z from "zod";

export const balanceSummarySchema = z.object({
  totalMoney: z.number(),
  unassignedMoney: z.number(),
  assignedMoney: z.number(),
});

export type BalanceSummaryForm = z.infer<typeof balanceSummarySchema>;