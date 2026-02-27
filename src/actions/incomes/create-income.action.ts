'use server';
import { Prisma } from '@/generated/prisma/browser';
import prisma from '@/lib/prisma';
import { IncomeFormData } from '@/schemas/prisma';
import { getUserId } from '../auth/get-user-id';
import { ActionResponse } from '@/types/action-response.type';
import { Income } from '@/generated/prisma/client';

export async function CreateIncomeAction(data: IncomeFormData): Promise<ActionResponse<Income>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const [income] = await prisma.$transaction([
      prisma.income.create({
        data: { ...data, userId }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          unassignedMoney: { increment: data.amount }
        }
      })
    ])

    return { ok: true, result: income };
  } catch (error) {
    return { ok: false, error: "Error al crear el ingreso" };
  }
}
