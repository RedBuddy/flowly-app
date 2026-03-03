'use server';

import { Income } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const updateIncomeAction = async (
  incomeId: string,
  data: {
    amount: number;
    description: string;
    date?: string;
  }
): Promise<ActionResponse<Income>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const income = await prisma.income.findUnique({
      where: { id: incomeId },
    });

    if (!income || income.userId !== userId) {
      return { ok: false, error: "Income no encontrado" };
    }

    const updatedIncome = await prisma.income.update({
      where: { id: incomeId },
      data: {
        amount: data.amount,
        description: data.description,
        ...(data.date && { date: new Date(data.date) })
      },
    });

    return { ok: true, result: updatedIncome };
  } catch (error) {
    console.error("Error updating income:", error);
    return { ok: false, error: "Error al actualizar el ingreso" };
  }
};
