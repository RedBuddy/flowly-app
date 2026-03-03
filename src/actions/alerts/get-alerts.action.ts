'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";
import { Alert } from "@/generated/prisma/client";

export const getAlertsAction = async (): Promise<ActionResponse<Alert[]>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { ok: true, result: alerts };
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return { ok: false, error: "Error al obtener las alertas" };
  }
};
