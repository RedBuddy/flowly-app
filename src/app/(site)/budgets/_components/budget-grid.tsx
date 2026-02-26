"use client";

import { BudgetCard } from "@/app/(site)/budgets/_components/budget-card";
import { CustomLoading } from "@/components/shared/custom-loading";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { useBudgets } from "@/hooks/useBudget";

export const BudgetGrid = () => {
  const { data, isLoading } = useBudgets();

  const budgetList = data?.ok ? data.result?.data : [];

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <>
      {!budgetList || budgetList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay presupuestos para mostrar</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-4">
          {budgetList.map((budget) => (
            <BudgetCard key={budget.id} userId={budget.userId} id={budget.id} name={budget.name} type={budget.type} spent={budget.spent} totalAssigned={budget.totalAssigned} createdAt={budget.createdAt} />
          ))}
        </div>
      )}

      <CustomPagination totalPages={data?.ok ? data.result?.totalPages || 1 : 1} />
    </>
  );
};
