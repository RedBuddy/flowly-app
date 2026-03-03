'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const deleteIncomeAction = async (incomeId: string): Promise<ActionResponse<null>> => {
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

    await prisma.income.delete({
      where: { id: incomeId },
    });

    return { ok: true, result: null };
  } catch (error) {
    console.error("Error deleting income:", error);
    return { ok: false, error: "Error al eliminar el ingreso" };
  }
};
