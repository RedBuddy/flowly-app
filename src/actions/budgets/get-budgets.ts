"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "@/actions/auth/get-user-id";
import { Prisma } from "@/generated/prisma/client";

export async function getBudgets(): Promise<ActionResponse<Prisma.BudgetGetPayload<{}>[]>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const budget = await prisma.budget.findMany({
      where: {
        userId,
      },
    });

    return { ok: true, data: budget };
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al obtener los presupuestos",
    };
  }
}


