"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "../auth/get-user-id";
import { ActionResponse } from "@/types/action-response.type";
import { Debt } from "@/generated/prisma/client";

export interface CreateDebtInput {
  name: string;
  totalDebt: number;
  minimumPayment: number;
  dueDate?: Date;
  priority: "high" | "medium" | "low";
}

export const createDebt = async (data: CreateDebtInput): Promise<ActionResponse<Debt>> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const debt = await prisma.debt.create({
      data: {
        userId,
        name: data.name,
        totalDebt: data.totalDebt,
        remaining: data.totalDebt,
        minimumPayment: data.minimumPayment,
        dueDate: data.dueDate,
        priority: data.priority,
      },
    });

    return { ok: true, result: debt };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al crear la deuda" };
  }
};
