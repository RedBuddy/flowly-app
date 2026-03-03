"use server";

import { Goal } from "@/generated/prisma/client";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";
import prisma from "@/lib/prisma";

export const getLatestGoals = async (take: number): Promise<ActionResponse<Goal[]>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      take,
      orderBy: { createdAt: "desc" },
    });

    return { ok: true, result: goals };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al obtener las metas" };
  }
};
