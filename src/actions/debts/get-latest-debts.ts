"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../auth/get-user-id";
import { ActionResponse } from "@/types/action-response.type";
import { Debt } from "@/generated/prisma/client";

export const getLatestDebts = async (take: number): Promise<ActionResponse<Debt[]>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const debts = await prisma.debt.findMany({
      where: { userId },
      take,
      orderBy: { createdAt: "desc" },
    });

    return { ok: true, result: debts };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al obtener las deudas" };
  }
};
