import { getBudgets } from "@/actions/budgets/get-budgets";
import { BudgetHeader, BudgetSummary, BudgetGrid, BudgetControls } from "./_components";

export default async function Budgets() {
  const budgets = await getBudgets();

  if (!budgets.ok || !budgets.data) {
    return <p className="text-red-500">Error al cargar los presupuestos</p>;
  }

  const totalAssigned = budgets.data.reduce((acc, b) => acc + b.totalAssigned, 0);
  const totalSpent = budgets.data.reduce((acc, b) => acc + b.spent, 0);
  const totalAvailable = totalAssigned - totalSpent;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <BudgetHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <BudgetSummary totalAssigned={totalAssigned} totalSpent={totalSpent} totalAvailable={totalAvailable} />
        <BudgetControls />
        {/* Budgets Grid */}
        <BudgetGrid budgets={budgets.data} />
      </main>
    </div>
  );
}
