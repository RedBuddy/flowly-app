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
          totalMoney: { decrement: data.amount }
        }
      })] : [])
    ]);

    return { ok: true, result: transaction };

  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create budget transaction" };
  }

}

