"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../auth/get-user-id";
import { ActionResponse } from "@/types/action-response.type";
import { DebtPayment } from "@/generated/prisma/client";

export const getDebtPayments = async (debtId: string): Promise<ActionResponse<DebtPayment[]>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const payments = await prisma.debtPayment.findMany({
      where: { debtId, userId },
      orderBy: { date: "desc" },
    });

    return { ok: true, result: payments };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al obtener los pagos" };
  }
};
