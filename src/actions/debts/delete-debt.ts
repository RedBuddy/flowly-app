"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../auth/get-user-id";
import { ActionResponse } from "@/types/action-response.type";

export const deleteDebt = async (debtId: string): Promise<ActionResponse<null>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    await prisma.debt.delete({
      where: { id: debtId, userId },
    });

    return { ok: true, result: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al eliminar la deuda" };
  }
};
