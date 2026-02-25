'use server';

import { BudgetTransaction } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";

export const getBudgetTransactions = async (id: string): Promise<ActionResponse<BudgetTransaction[]>> => {

  try {
    const transactions = await prisma.budgetTransaction.findMany({
      where: { budgetId: id },
      orderBy: { createdAt: "desc" },
    });
    return { ok: true, result: transactions };

  } catch (error) {
    console.error("Error al obtener transacciones del presupuesto:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Error al obtener las transacciones del presupuesto" };
  }

};