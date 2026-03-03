"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../auth/get-user-id";
import { ActionResponse } from "@/types/action-response.type";
import { DebtPayment } from "@/generated/prisma/client";

export interface CreateDebtPaymentInput {
  debtId: string;
  amount: number;
  description?: string;
}

export const createDebtPayment = async (data: CreateDebtPaymentInput): Promise<ActionResponse<DebtPayment>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    // Create payment and update debt remaining in transaction
    const payment = await prisma.$transaction(async (tx) => {
      const newPayment = await tx.debtPayment.create({
        data: {
          debtId: data.debtId,
          userId,
          amount: data.amount,
          description: data.description || null,
        },
      });

      // Update debt remaining
      await tx.debt.update({
        where: { id: data.debtId },
        data: {
          remaining: {
            decrement: data.amount,
          },
        },
      });

      return newPayment;
    });

    return { ok: true, result: payment };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al registrar el pago" };
  }
};
