'use server';

import { BudgetTransaction } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const updateBudgetTransaction = async (
  budgetId: string,
  data: {
    transactionId: string;
    type: string;
    amountDifference: number;
    newAmount: number;
    description: string;
  }
): Promise<ActionResponse<BudgetTransaction>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    // Actualizar la transacción y el presupuesto
    const [updatedTransaction] = await prisma.$transaction([
      prisma.budgetTransaction.update({
        where: { id: data.transactionId },
        data: {
          amount: data.newAmount,
          description: data.description,
        },
      }),
      prisma.budget.update({
        where: { id: budgetId },
        data: {
          [data.type === "assignment" ? "totalAssigned" : "spent"]: {
            increment: data.amountDifference
          }
        }
      }),
    ]);

    return { ok: true, result: updatedTransaction };
  } catch (error) {
    console.error("Error updating budget transaction:", error);
    return { ok: false, error: "Error al actualizar la transacción" };
  }
};
