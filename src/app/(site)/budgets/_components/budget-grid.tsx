"use client";

import { getBudgets } from "@/actions/budgets/get-budgets";
import { BudgetCard } from "@/components/BudgetCard";
import { Budget } from "@/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

export const BudgetGrid = ({ budgets }: { budgets: Budget[] }) => {
  const [filter] = useQueryState("filter", { defaultValue: "all" });

  const { data } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(),
    initialData: { ok: true, data: budgets },
    staleTime: 1000 * 60 * 1, // 1 minuto
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const budgetList = data?.ok ? data.data : budgets;

  const filteredBudgets = budgetList!.filter((b) => {
    if (filter === "all") return true;
    return b.type === filter;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredBudgets.map((budget) => (
        <BudgetCard key={budget.id} name={budget.name} type={budget.type as "recurrent" | "project"} spent={budget.spent} total={budget.totalAssigned} available={budget.totalAssigned - budget.spent} />
      ))}
    </div>
  );
};
