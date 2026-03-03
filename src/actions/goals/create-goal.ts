'use server';

import { Goal } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export interface CreateGoalInput {
  name: string;
  target: number;
  deadline?: Date;
}

export const createGoal = async (data: CreateGoalInput): Promise<ActionResponse<Goal>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        name: data.name,
        target: data.target,
        deadline: data.deadline,
      },
    });

    return { ok: true, result: goal };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { ok: false, error: "Error al crear la meta" };
  }
};
