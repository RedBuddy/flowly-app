import { BudgetHeader, BudgetSummary, BudgetGrid, BudgetControls } from "./_components";

export default function Budgets() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <BudgetHeader />
      <main className="container mx-auto max-w-6xl space-y-6 py-6">
        <BudgetSummary />
        <BudgetControls />
        {/* Budgets Grid */}
        <BudgetGrid />
      </main>
    </div>
  );
}
