"use client";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { formatCurrency } from "@/helpers/currency-formatter";
import { useGetBalanceSummary } from "@/hooks/useSummary";
import { cn } from "@/lib/utils";
import { Wallet, TrendingDown, PiggyBank } from "lucide-react";

export const BudgetSummary = () => {
  const { data, isLoading } = useGetBalanceSummary();

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4 ">
        <SkeletonCard count={3} />
      </div>
    );

  if (!data?.ok || !data.result) return null;

  const { assignedMoney, totalMoney, spentMoney } = data.result;

  const spentPercent = totalMoney > 0 ? (spentMoney / totalMoney) * 100 : 0;
  const availablePercent = 100 - spentPercent;

  const status =
    spentPercent >= 90
      ? { label: "Excedido", color: "text-destructive bg-destructive/10" }
      : spentPercent >= 70
      ? { label: "Cuidado", color: "text-amber-500 bg-amber-500/10" }
      : { label: "Saludable", color: "text-emerald-500 bg-emerald-500/10" };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4 ">
      {/* Total asignado */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 hover:shadow-card transition-all duration-300">
        <div className="h-1 bg-blue-500" />
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 flex-shrink-0">
            <Wallet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Total asignado</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(assignedMoney)}</p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
              <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Total gastado */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 hover:shadow-card transition-all duration-300">
        <div className="h-1 bg-orange-500" />
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 flex-shrink-0">
            <TrendingDown className="w-4 h-4 text-orange-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Total gastado</p>
            <p className="text-xl font-bold text-orange-500">{formatCurrency(spentMoney)}</p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
              <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${Math.min(spentPercent, 100)}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{spentPercent.toFixed(1)}% del presupuesto</p>
          </div>
        </div>
      </div>

      {/* Disponible */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 hover:shadow-card transition-all duration-300">
        <div className="h-1 bg-emerald-500" />
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 flex-shrink-0">
            <PiggyBank className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Disponible</p>
              <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", status.color)}>{status.label}</span>
            </div>
            <p className="text-xl font-bold text-emerald-500">{formatCurrency(assignedMoney - spentMoney)}</p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.min(availablePercent, 100)}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{availablePercent.toFixed(1)}% restante</p>
          </div>
        </div>
      </div>
    </div>
  );
};
