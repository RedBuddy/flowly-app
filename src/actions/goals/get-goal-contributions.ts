'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const getGoalContributions = async (goalId: string): Promise<ActionResponse<any[]>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const contributions = await prisma.goalContribution.findMany({
      where: { goalId },
      orderBy: { date: "desc" },
    });

    return { ok: true, result: contributions };
  } catch (error) {
    console.error("Error getting goal contributions:", error);
    return { ok: false, error: "Error al obtener las contribuciones" };
  }
};
