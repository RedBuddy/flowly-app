'use server';

import { BudgetTransaction } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { BudgetTransactionFormData } from "@/schemas/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const createBudgetTransaction = async (data: BudgetTransactionFormData): Promise<ActionResponse<BudgetTransaction>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    // Verificación

    if (data.type === "assignment") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { unassignedMoney: true }
      })

      if (!user) throw new Error("Usuario no encontrado");

      if (user.unassignedMoney < data.amount) throw new Error(
        `No tienes suficiente dinero disponible. Tienes $${user.unassignedMoney}, necesitas $${data.amount}`
      );
    } else {
      const budget = await prisma.budget.findUnique({
        where: { id: data.budgetId },
        select: { totalAssigned: true, spent: true }
      })

      if (!budget) throw new Error("Presupuesto no encontrado");

      const disponible = (budget.totalAssigned - budget.spent);

      if (disponible < data.amount) throw new Error(
        `Tu presupuesto solo tiene $${disponible}, no puedes gastar $${data.amount}`
      );
    }


    const [transaction] = await prisma.$transaction([
      prisma.budgetTransaction.create({
        data: {
          userId,
          ...data
        }
      }),
      prisma.budget.update({
        where: { id: data.budgetId },
        data: {
          [data.type === "assignment" ? "totalAssigned" : "spent"]: { increment: data.amount }
        }
      }),
      ...(data.type === "assignment" ? [prisma.user.update({
        where: { id: userId },
        data: {
          unassignedMoney: { decrement: data.amount }
        }
      })] : [])
    ]);

    return { ok: true, result: transaction };

  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create budget transaction" };
  }
}

