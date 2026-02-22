"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { BudgetFormData } from "@/schemas/prisma";
import { getUserId } from "@/actions/auth/get-user-id";
import { Budget } from "@/generated/prisma/client";

export async function CreateBudgetAction(data: BudgetFormData): Promise<ActionResponse<Budget>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const budget = await prisma.budget.create({
      data: { ...data, userId },
    });


    return { ok: true, result: budget };
  } catch (error) {
    console.error("Error al crear presupuesto:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al crear el presupuesto",
    };
  }
}


