'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const getGoals = async (): Promise<ActionResponse<any[]>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { ok: true, result: goals };
  } catch (error) {
    console.error("Error getting goals:", error);
    return { ok: false, error: "Error al obtener las metas" };
  }
};
