'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { getUserId } from "../auth/get-user-id";

export const markAllAlertsAsReadAction = async (): Promise<ActionResponse<null>> => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    await prisma.alert.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { ok: true, result: null };
  } catch (error) {
    console.error("Error marking all alerts as read:", error);
    return { ok: false, error: "Error al marcar las alertas como leídas" };
  }
};
