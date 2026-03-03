'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const deleteAlertAction = async (alertId: string): Promise<ActionResponse<null>> => {
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

    await prisma.alert.delete({
      where: { id: alertId },
    });

    return { ok: true, result: null };
  } catch (error) {
    console.error("Error deleting alert:", error);
    return { ok: false, error: "Error al eliminar la alerta" };
  }
};
