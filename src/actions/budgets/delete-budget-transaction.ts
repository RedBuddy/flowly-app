'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const deleteBudgetTransaction = async (budgetId: string, data: { transactionId: string, type: string, amount: number }): Promise<ActionResponse<null>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    await prisma.$transaction([
      prisma.budgetTransaction.delete({
        where: { id: data.transactionId },
      }),
      prisma.budget.update({
        where: { id: budgetId },
        data: {
          [data.type === "assignment" ? "totalAssigned" : "spent"]: { decrement: data.amount }
        }
      }),
      // ...(data.type === "assignment" ? [prisma.user.update({
      //   where: { id: userId },
      //   data: {
      //     unassignedMoney: { increment: data.amount }
      //   }
      // })] : [])
    ]);

    return { ok: true };
  } catch (error) {
    console.error("Error deleting budget transaction:", error);
    return { ok: false, error: "Error al eliminar la transacción" };
  }
}