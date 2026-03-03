import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/currency-formatter";
import { useGetIncomeSummary } from "@/hooks/useIncome";
import { useIncomeModalsStore } from "@/stores/income-modals.store";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  onRegisterIncome: () => void;
}

export function HeroBalanceCard({ onRegisterIncome }: Props) {
  const { data, isLoading } = useGetIncomeSummary();
  const { switchHistoryModal } = useIncomeModalsStore();

  if (isLoading) {
    return (
      <div className="rounded-xl p-6 md:p-8 border border-border/50 bg-gradient-to-br from-primary/5 via-card to-card/80">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (!data?.ok || !data?.result) {
    return <div>Error loading incomes</div>;
  }

  const { currentMonth } = data.result;

  return (
    <div className="relative overflow-hidden rounded-xl p-6 md:p-8 border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card/80 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header con título y botones */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Este Mes</p>
          <h2 className="text-lg font-semibold text-foreground">Ingresos Registrados</h2>
        </div>
        <div className="flex gap-2.5">
          <Button onClick={() => switchHistoryModal(true)} size="sm" variant="outline" className="h-9 px-4 rounded-md font-medium text-sm gap-2 border-primary/50 hover:bg-primary/10">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Historial</span>
          </Button>
          <Button onClick={onRegisterIncome} size="sm" className="h-9 px-4 rounded-md font-medium text-sm gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Registrar</span>
          </Button>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 gap-6 md:gap-8">
        {/* Total */}
        <div className="group rounded-xl p-4 md:p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Total Ingresos</p>
          <p className="text-3xl md:text-4xl font-bold text-emerald-600 tracking-tight">{formatCurrency(currentMonth.total)}</p>
          <div className="mt-2 h-1 w-12 bg-gradient-to-r from-emerald-500 to-emerald-500/50 rounded-full" />
        </div>

        {/* Count */}
        <div className="group rounded-xl p-4 md:p-5 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">N° Registros</p>
          <p className="text-3xl md:text-4xl font-bold text-blue-600">{currentMonth.count}</p>
          <div className="mt-2 h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-500/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
