'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";
import { Alert } from "@/generated/prisma/client";

export const markAlertAsReadAction = async (alertId: string): Promise<ActionResponse<Alert>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
    });

    if (!alert || alert.userId !== userId) {
      return { ok: false, error: "Alerta no encontrada" };
    }

    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: { isRead: true },
    });

    return { ok: true, result: updatedAlert };
  } catch (error) {
    console.error("Error marking alert as read:", error);
    return { ok: false, error: "Error al marcar la alerta como leída" };
  }
};
