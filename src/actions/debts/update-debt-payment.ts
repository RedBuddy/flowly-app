"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../auth/get-user-id";
import { ActionResponse } from "@/types/action-response.type";
import { DebtPayment } from "@/generated/prisma/client";

interface UpdateDebtPaymentInput {
  paymentId: string;
  amount: number;
  description: string;
  oldAmount: number;
}

export const updateDebtPayment = async (debtId: string, data: UpdateDebtPaymentInput): Promise<ActionResponse<DebtPayment>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const amountDifference = data.amount - data.oldAmount;

    // Update payment and adjust debt remaining in transaction
    const payment = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.debtPayment.update({
        where: { id: data.paymentId },
        data: {
          amount: data.amount,
          description: data.description,
        },
      });

      // Update debt remaining based on difference
      if (amountDifference !== 0) {
        await tx.debt.update({
          where: { id: debtId },
          data: {
            remaining: {
              decrement: amountDifference,
            },
          },
        });
      }

      return updatedPayment;
    });

    return { ok: true, result: payment };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al actualizar el pago" };
  }
};
