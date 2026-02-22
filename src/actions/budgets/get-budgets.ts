"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "@/actions/auth/get-user-id";
import { Budget } from "@/generated/prisma/client";
import { PaginatedResponseType, paginationSchema, PaginationType } from "@/schemas/pagination";
import { unstable_cache } from "next/cache";
import * as z from "zod";

const getBudgetsSchema = z.object({
  filter: z.enum(["all", "recurrent", "project"]).optional(),
});

const getBudgetsInputSchema = z.intersection(paginationSchema, getBudgetsSchema);

export type GetBudgetsInput = z.infer<typeof getBudgetsInputSchema>;

const getCachedBudgets = unstable_cache(
  async (userId: string, take: number, page: number, filter?: string) => {
    console.log(`📊 Query budgets - Page: ${page}, Time: ${new Date().toLocaleTimeString()}`);

    const [budget, total] = await Promise.all([
      prisma.budget.findMany({
        where: { userId, type: filter === "all" ? undefined : filter as any },
        skip: (page - 1) * take,
        take,
      }),
      prisma.budget.count({
        where: { userId, type: filter === "all" ? undefined : filter as any },
      }),
    ]);

    const totalPages = Math.ceil(total / take);
    return { data: budget, count: budget.length, totalPages };
  },
  ["budgets", "page", "filter"],
  { revalidate: 60, tags: ["budgets"] }
);

export async function getBudgets({ take, page, filter }: GetBudgetsInput): Promise<ActionResponse<PaginatedResponseType<Budget>>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const result = await getCachedBudgets(userId, take, page, filter);
    return { ok: true, result };
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al obtener los presupuestos",
    };
  }
}


