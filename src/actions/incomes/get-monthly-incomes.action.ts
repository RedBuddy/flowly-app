'use server';
import prisma from '@/lib/prisma';
import { getUserId } from '../auth/get-user-id';
import { ActionResponse } from '@/types/action-response.type';
import { Income } from '@/generated/prisma/client';

export async function GetMonthlyIncomesAction(
  year?: number,
  month?: number
): Promise<ActionResponse<Income[]>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const today = new Date();
    const targetYear = year || today.getFullYear();
    const targetMonth = month !== undefined ? month : today.getMonth();

    // Obtener primer día del mes
    const startDate = new Date(targetYear, targetMonth, 1);
    // Obtener último día del mes
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const incomes = await prisma.income.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    return { ok: true, result: incomes };
  } catch (error) {
    return { ok: false, error: "Error al obtener ingresos mensuales" };
  }
}
