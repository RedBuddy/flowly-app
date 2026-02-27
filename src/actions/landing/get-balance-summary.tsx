"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";
import { BalanceSummaryForm } from "@/schemas/landing";

export const getBalanceSummary = async (): Promise<ActionResponse<BalanceSummaryForm>> => {
  try {
    const userId = await getUserId();
    if (!userId) return { ok: false, error: "No autenticado" };

    // Opción 1: Usa aggregations de Prisma (más eficiente directo en BD)
    const [budgetStats, userBalance] = await prisma.$transaction([
      prisma.budget.aggregate({
        where: { userId },
        _sum: {
          totalAssigned: true,
          spent: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          totalMoney: true,
          unassignedMoney: true,
        },
      }),
    ]);

    return {
      ok: true,
      result: {
        totalMoney: userBalance?.totalMoney ?? 0,
        unassignedMoney: userBalance?.unassignedMoney ?? 0,
        assignedMoney: budgetStats._sum.totalAssigned ?? 0,
        spentMoney: budgetStats._sum.spent ?? 0,
      },
    };
  } catch (error) {
    console.error("Error getting balance summary:", error);
    return { ok: false, error: "Error al obtener resumen" };
  }
};
