import { Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/currency-formatter";
import { useGetBalanceSummary } from "@/hooks/useSummary";
import { SkeletonCard } from "./skeletons/skeleton-card";

interface Props {
  onRegisterIncome: () => void;
}

export function HeroBalanceCard({ onRegisterIncome }: Props) {
  const { data, isLoading } = useGetBalanceSummary();

  if (isLoading) {
    return (
      <div className="h-80 relative overflow-hidden rounded-2xl p-5 md:p-6 border border-border/50 bg-gradient-to-br from-card via-card to-card/80 shadow-soft hover:shadow-card transition-all duration-300">
        <SkeletonCard />
      </div>
    );
  }

  if (!data?.ok || !data?.result) {
    return <div>Error loading balance</div>;
  }

  const { totalMoney, unassignedMoney, assignedMoney } = data.result;
  const distributionPercent = totalMoney > 0 ? (assignedMoney / totalMoney) * 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 border border-border/50 bg-gradient-to-br from-card via-card to-card/80 shadow-soft hover:shadow-card transition-all duration-300">
      {/* Gradient accent background */}
      {/* <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -z-10" /> */}

      <div className="relative z-10">
        {/* Balance amount */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Tu balance disponible</p>
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{formatCurrency(unassignedMoney)}</h1>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold whitespace-nowrap">
              <ArrowUpRight className="w-3 h-3" />
              +12% mes
            </div>
          </div>
        </div>

        {/* Distribution visualization */}
        <div className="mb-4 p-3 rounded-xl bg-muted/30 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">{distributionPercent.toFixed(0)}% asignado</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500" style={{ width: `${Math.min(distributionPercent, 100)}%` }} />
          </div>
        </div>

        {/* Money breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Unassigned */}
          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Sin asignar</p>
            <p className="text-lg font-bold text-blue-500">{formatCurrency(unassignedMoney)}</p>
          </div>

          {/* Assigned */}
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Asignado</p>
            <p className="text-lg font-bold text-emerald-500">{formatCurrency(assignedMoney)}</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button onClick={onRegisterIncome} size="sm" className="w-full font-semibold text-sm px-6 py-2 rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" />
          Registrar ingreso
        </Button>
      </div>
    </div>
  );
}
