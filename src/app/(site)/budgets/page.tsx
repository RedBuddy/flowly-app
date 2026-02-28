import { CustomHeader } from "@/components/shared/custom-header";
import { BudgetSummary, BudgetGrid, BudgetControls } from "./_components";
import { PiggyBank } from "lucide-react";

export default function Budgets() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <CustomHeader title="Presupuestos" icon={<PiggyBank className="w-6 h-6 text-primary" />} />
      <main className="container mx-auto max-w-6xl space-y-6 py-6">
        <BudgetSummary />
        <BudgetControls />
        {/* Budgets Grid */}
        <BudgetGrid />
      </main>
    </div>
  );
}
