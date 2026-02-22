'use server';
import { Prisma } from '@/generated/prisma/browser';
import prisma from '@/lib/prisma';
import { IncomeFormData } from '@/schemas/prisma';
import { getUserId } from '../auth/get-user-id';
import { ActionResponse } from '@/types/action-response.type';

export async function CreateIncomeAction(data: IncomeFormData): Promise<ActionResponse<Prisma.IncomeGetPayload<{}>>> {
  const userId = await getUserId();

  if (!userId) {
    return { ok: false, error: "Usuario no autenticado" };
  }

  try {
    const income = await prisma.income.create({
      data: { ...data, userId }
    });

    return { ok: true, result: income };
  } catch (error) {
    return { ok: false, error: "Error al crear el ingreso" };
  }
}
