'use server';
import prisma from '@/lib/prisma';
import { getUserId } from '../auth/get-user-id';
import { ActionResponse } from '@/types/action-response.type';

export interface IncomeSummary {
  currentMonth: {
    total: number;
    count: number;
    year: number;
    month: number;
  };
  previousMonth: {
    total: number;
    count: number;
    year: number;
    month: number;
  };
  percentageChange: number;
}

export async function GetIncomeSummaryAction(): Promise<ActionResponse<IncomeSummary>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { ok: false, error: "Usuario no autenticado" };
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Rango mes actual
    const currentStart = new Date(currentYear, currentMonth, 1);
    const currentEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    // Rango mes anterior
    const previousStart = new Date(previousYear, previousMonth, 1);
    const previousEnd = new Date(previousYear, previousMonth + 1, 0, 23, 59, 59);

    // Obtener ingresos del mes actual
    const currentIncomes = await prisma.income.aggregate({
      where: {
        userId,
        date: { gte: currentStart, lte: currentEnd },
      },
      _sum: { amount: true },
      _count: true,
    });

    // Obtener ingresos del mes anterior
    const previousIncomes = await prisma.income.aggregate({
      where: {
        userId,
        date: { gte: previousStart, lte: previousEnd },
      },
      _sum: { amount: true },
      _count: true,
    });

    const currentTotal = currentIncomes._sum.amount || 0;
    const previousTotal = previousIncomes._sum.amount || 0;

    // Calcular porcentaje de cambio
    const percentageChange =
      previousTotal === 0
        ? currentTotal > 0
          ? 100
          : 0
        : ((currentTotal - previousTotal) / previousTotal) * 100;

    return {
      ok: true,
      result: {
        currentMonth: {
          total: currentTotal,
          count: currentIncomes._count,
          year: currentYear,
          month: currentMonth,
        },
        previousMonth: {
          total: previousTotal,
          count: previousIncomes._count,
          year: previousYear,
          month: previousMonth,
        },
        percentageChange,
      },
    };
  } catch (error) {
    return { ok: false, error: "Error al obtener resumen de ingresos" };
  }
}
