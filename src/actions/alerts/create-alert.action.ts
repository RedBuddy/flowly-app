'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { Alert } from "@/generated/prisma/client";

export const createAlertAction = async (
  userId: string,
  data: {
    type: "debt" | "budget" | "goal";
    title: string;
    message: string;
  }
): Promise<ActionResponse<Alert>> => {
  try {
    const alert = await prisma.alert.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
      },
    });

    return { ok: true, result: alert };
  } catch (error) {
    console.error("Error creating alert:", error);
    return { ok: false, error: "Error al crear la alerta" };
  }
};
