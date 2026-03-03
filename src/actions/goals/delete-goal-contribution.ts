'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const deleteGoalContribution = async (
  goalId: string,
  data: { contributionId: string; amount: number }
): Promise<ActionResponse<null>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    await prisma.$transaction([
      prisma.goalContribution.delete({
        where: { id: data.contributionId },
      }),
      prisma.goal.update({
        where: { id: goalId },
        data: {
          current: { decrement: data.amount },
        },
      }),
    ]);

    return { ok: true };
  } catch (error) {
    console.error("Error deleting goal contribution:", error);
    return { ok: false, error: "Error al eliminar la contribución" };
  }
};
