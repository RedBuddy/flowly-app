"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/currency-formatter";
import { useDebts } from "@/hooks/useDebt";
import { useDebtModalsStore } from "@/stores/debt-modals.store";

export const DebtsSummary = () => {
  const { data } = useDebts();
  const { switchCreateDebtModal } = useDebtModalsStore();
  const debts = data?.ok ? data.result ?? [] : [];

  const totalDebt = debts.reduce((acc, d) => acc + d.totalDebt, 0);
  const totalRemaining = debts.reduce((acc, d) => acc + d.remaining, 0);
  const totalPaid = totalDebt - totalRemaining;
  const overallProgress = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 mb-8 overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 animate-pulse" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Deuda total</p>
            <p className="text-4xl font-bold text-foreground mb-2">{formatCurrency(totalRemaining)}</p>
            <p className="text-muted-foreground">de {formatCurrency(totalDebt)} en deudas</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <circle cx="50" cy="50" r="40" stroke="url(#debtGradientLarge)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${overallProgress * 2.51} 251`} className="transition-all duration-700" />
                <defs>
                  <linearGradient id="debtGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(0 84% 60%)" />
                    <stop offset="100%" stopColor="hsl(0 84% 50%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{Math.round(overallProgress)}%</span>
              </div>
            </div>
            <Button onClick={() => switchCreateDebtModal(true)} className="rounded-md bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nueva deuda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
