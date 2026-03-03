"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../auth/get-user-id";
import { ActionResponse } from "@/types/action-response.type";

interface DeleteDebtPaymentInput {
  paymentId: string;
  amount: number;
}

export const deleteDebtPayment = async (debtId: string, data: DeleteDebtPaymentInput): Promise<ActionResponse<null>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    // Delete payment and restore debt remaining in transaction
    await prisma.$transaction(async (tx) => {
      await tx.debtPayment.delete({
        where: { id: data.paymentId },
      });

      // Restore debt remaining
      await tx.debt.update({
        where: { id: debtId },
        data: {
          remaining: {
            increment: data.amount,
          },
        },
      });
    });

    return { ok: true, result: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al eliminar el pago" };
  }
};
