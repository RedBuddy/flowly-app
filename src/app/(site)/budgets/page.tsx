import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getBudgets } from "@/actions/budgets/get-budgets";
import { BudgetHeader, BudgetSummary, BudgetGrid, BudgetControls } from "./_components";
import QueryProvider from "@/components/providers/tanstack-query.provider";

export default async function Budgets() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["budgets", "1", "all"],
    queryFn: () => getBudgets({ take: 8, page: 1, filter: "all" }),
  });

  // Obtener los datos del cache para los totales (opcional)
  const budgets = queryClient.getQueryData(["budgets", "1", "all"]) as any;

  if (!budgets.ok || !budgets.result?.data) {
    return <p className="text-red-500">Error al cargar los presupuestos</p>;
  }

  const totalAssigned = budgets.result.data.reduce((acc: number, b: any) => acc + b.totalAssigned, 0);
  const totalSpent = budgets.result.data.reduce((acc: number, b: any) => acc + b.spent, 0);
  const totalAvailable = totalAssigned - totalSpent;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen">
        {/* Header */}
        <BudgetHeader />
        <main className="container mx-auto max-w-6xl space-y-6 py-6">
          <BudgetSummary totalAssigned={totalAssigned} totalSpent={totalSpent} totalAvailable={totalAvailable} />
          <BudgetControls />
          {/* Budgets Grid */}
          <BudgetGrid />
        </main>
      </div>
    </HydrationBoundary>
  );
}
