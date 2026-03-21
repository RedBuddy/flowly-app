"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response.type";
import { BudgetFormData } from "@/schemas/prisma";
import { getUserId } from "@/actions/auth/get-user-id";
import { Budget } from "@/generated/prisma/client";

export async function CreateBudget(data: BudgetFormData): Promise<ActionResponse<Budget>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    // Todo en una transacción: validación + creación
    const budget = await prisma.$transaction(async (tx) => {
      // Obtener el usuario y validar dinero disponible
      // const user = await tx.user.findUnique({
      //   where: { id: userId },
      //   select: { unassignedMoney: true },
      // });

      // if (!user) {
      //   throw new Error("Usuario no encontrado");
      // }

      // if (data.totalAssigned > user.unassignedMoney) {
      //   throw new Error(
      //     `No tienes suficiente dinero disponible. Tienes $${user.unassignedMoney}, necesitas $${data.totalAssigned}`
      //   );
      // }

      // Crear budget
      const newBudget = await tx.budget.create({
        data: { ...data, userId },
      });

      // Restar del unassignedMoney
      // await tx.user.update({
      //   where: { id: userId },
      //   data: {
      //     unassignedMoney: {
      //       decrement: data.totalAssigned,
      //     },
      //   },
      // });

      return newBudget;
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


