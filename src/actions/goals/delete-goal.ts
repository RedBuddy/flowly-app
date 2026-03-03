'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const deleteGoal = async (goalId: string): Promise<ActionResponse<null>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });

    return { ok: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { ok: false, error: "Error al eliminar la meta" };
  }
};
