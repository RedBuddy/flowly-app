"use server";

import { Budget } from "@/generated/prisma/client";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";
import prisma from "@/lib/prisma";

export const getLatestBudgets = async (take: number): Promise<ActionResponse<Budget[]>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const budgets = await prisma.budget.findMany({
      where: { userId },
      take,
      orderBy: { createdAt: "desc" },
    });

    return { ok: true, result: budgets };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al obtener los presupuestos" };
  }
};
