import { getBudgets } from "@/actions/budgets/get-budgets";
import { BudgetHeader, BudgetSummary, BudgetGrid, BudgetControls } from "./_components";
import { CustomPagination } from "@/components/shared/custom-pagination";

export default async function Budgets() {
  const budgets = await getBudgets({ take: 8, page: 1 });

  if (!budgets.ok || !budgets.result?.data) {
    return <p className="text-red-500">Error al cargar los presupuestos</p>;
  }

  const totalAssigned = budgets.result.data.reduce((acc, b) => acc + b.totalAssigned, 0);
  const totalSpent = budgets.result.data.reduce((acc, b) => acc + b.spent, 0);
  const totalAvailable = totalAssigned - totalSpent;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <BudgetHeader />
      <main className="container mx-auto max-w-6xl space-y-6 py-6">
        <BudgetSummary totalAssigned={totalAssigned} totalSpent={totalSpent} totalAvailable={totalAvailable} />
        <BudgetControls />
        {/* Budgets Grid */}
        <BudgetGrid {...budgets.result} />
      </main>
    </div>
  );
}
