import { PiggyBank } from "lucide-react";
import { BudgetCard } from "../BudgetCard";
import { SectionHeader } from "../SectionHeader";
import { redirect } from "next/navigation";

const mockBudgets = [
  { id: 1, name: "Alimentación", type: "recurrent" as const, spent: 4500, total: 6000, available: 1500 },
  { id: 2, name: "Transporte", type: "recurrent" as const, spent: 1800, total: 2500, available: 700 },
  { id: 3, name: "Entretenimiento", type: "recurrent" as const, spent: 800, total: 2000, available: 1200 },
  { id: 4, name: "Renovación cocina", type: "project" as const, spent: 15000, total: 25000, available: 10000 },
];

export const BudgetSlider = () => {
  return (
    <>
      <SectionHeader title="Presupuestos" subtitle="Controla tus gastos" icon={PiggyBank} action={{ label: "Ver todos", path: "/budgets" }} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockBudgets.map((budget) => (
          <BudgetCard key={budget.id} name={budget.name} type={budget.type} spent={budget.spent} total={budget.total} available={budget.available} />
        ))}
      </div>
    </>
  );
};
