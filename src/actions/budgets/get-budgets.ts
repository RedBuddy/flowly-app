"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "@/actions/auth/get-user-id";
import { Budget } from "@/generated/prisma/client";
import { PaginatedResponseType, paginationSchema, PaginationType } from "@/schemas/pagination";
import * as z from "zod";

const getBudgetsSchema = z.object({
  filter: z.enum(["all", "recurrent", "project"]).optional(),
});

const getBudgetsInputSchema = z.intersection(paginationSchema, getBudgetsSchema);

export type GetBudgetsInput = z.infer<typeof getBudgetsInputSchema>;

export async function getBudgets({ take, page, filter }: GetBudgetsInput): Promise<ActionResponse<PaginatedResponseType<Budget>>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    console.log(`📊 Query budgets - Page: ${page}, Time: ${new Date().toLocaleTimeString()}`);

    const [data, total] = await Promise.all([
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
    const result = { data, count: data.length, totalPages };

    return { ok: true, result };
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al obtener los presupuestos",
    };
  }
}


