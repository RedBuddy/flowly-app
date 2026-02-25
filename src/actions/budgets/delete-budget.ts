'use server';

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";

export const deleteBudget = async (budgetId: string): Promise<ActionResponse<null>> => {
  try {
    await prisma.budget.delete({
      where: { id: budgetId }
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Error al eliminar el presupuesto" };
  }
}
