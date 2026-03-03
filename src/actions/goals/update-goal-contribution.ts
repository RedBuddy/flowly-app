'use server';

import { GoalContribution } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const updateGoalContribution = async (
  goalId: string,
  data: {
    contributionId: string;
    amountDifference: number;
    newAmount: number;
    description: string;
  }
): Promise<ActionResponse<GoalContribution>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const [updatedContribution] = await prisma.$transaction([
      prisma.goalContribution.update({
        where: { id: data.contributionId },
        data: {
          amount: data.newAmount,
          description: data.description,
        },
      }),
      prisma.goal.update({
        where: { id: goalId },
        data: {
          current: { increment: data.amountDifference },
        },
      }),
    ]);

    return { ok: true, result: updatedContribution };
  } catch (error) {
    console.error("Error updating goal contribution:", error);
    return { ok: false, error: "Error al actualizar la contribución" };
  }
};
