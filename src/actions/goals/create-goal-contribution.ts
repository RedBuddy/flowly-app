'use server';

import { GoalContribution } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export interface CreateGoalContributionInput {
  goalId: string;
  amount: number;
  description?: string;
}

export const createGoalContribution = async (
  data: CreateGoalContributionInput
): Promise<ActionResponse<GoalContribution>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const [contribution] = await prisma.$transaction([
      prisma.goalContribution.create({
        data: {
          userId,
          goalId: data.goalId,
          amount: data.amount,
          description: data.description,
        },
      }),
      prisma.goal.update({
        where: { id: data.goalId },
        data: {
          current: { increment: data.amount },
        },
      }),
    ]);

    return { ok: true, result: contribution };
  } catch (error) {
    console.error("Error creating goal contribution:", error);
    return { ok: false, error: "Error al agregar contribución a la meta" };
  }
};
