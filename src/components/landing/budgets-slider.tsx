"use client";
import { PiggyBank } from "lucide-react";
import { BudgetCard } from "../../app/(site)/budgets/_components/budget-card";
import { SectionHeader } from "../SectionHeader";
import { useLatestBudgets } from "@/hooks/useBudget";
import { SkeletonCard } from "../skeletons/skeleton-card";
import { BudgetSpendModal, BudgetAssignModal, BudgetTransactionHistory } from "@/app/(site)/budgets/_components/modal";

export const BudgetSlider = () => {
  const { data, isLoading } = useLatestBudgets(4);

  const budgetList = data?.ok ? data.result : [];

  return (
    <>
      <SectionHeader title="Presupuestos" subtitle="Controla tus gastos" icon={PiggyBank} action={{ label: "Ver todos", path: "/budgets" }} />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-65">
          <SkeletonCard count={4} />
        </div>
      ) : !budgetList || budgetList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay presupuestos para mostrar</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {budgetList.map((budget) => (
            <BudgetCard key={budget.id} userId={budget.userId} id={budget.id} name={budget.name} type={budget.type} spent={budget.spent} totalAssigned={budget.totalAssigned} createdAt={budget.createdAt} />
          ))}
        </div>
      )}

      <BudgetSpendModal />
      <BudgetAssignModal />
      <BudgetTransactionHistory />
    </>
  );
};
