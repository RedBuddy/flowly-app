import { Plus, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroBalanceCardProps {
  totalMoney: number;
  unassignedMoney: number;
  assignedMoney: number;
  onRegisterIncome: () => void;
}

export function HeroBalanceCard({ totalMoney, unassignedMoney, assignedMoney, onRegisterIncome }: HeroBalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-card">
      {/* relative overflow-hidden rounded-sm gradient-hero p-8 shadow-hero animate-fade-in bg-amber-300 text-red-500 */}
      {/* Decorative shapes */}
      {/* <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 animate-float" />
      <div className="absolute top-1/2 -left-8 w-24 h-24 rounded-full bg-white/10 animate-pulse-soft" />
      <div className="absolute -bottom-6 right-1/4 w-32 h-32 rounded-full bg-white/5" /> */}

      {/* Shimmer effect */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">Tu balance total</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/60">+12% este mes</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground tracking-tight mb-8">{formatCurrency(totalMoney)}</h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-1">Sin asignar</p>
            <p className="text-2xl font-bold text-primary-foreground">{formatCurrency(unassignedMoney)}</p>
            <p className="text-xs text-white/60 mt-1">Disponible para distribuir</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-1">Asignado</p>
            <p className="text-2xl font-bold text-primary-foreground">{formatCurrency(assignedMoney)}</p>
            <p className="text-xs text-white/60 mt-1">En presupuestos y metas</p>
          </div>
        </div>

        <Button onClick={onRegisterIncome} size="lg" className="w-full md:w-auto bg-white text-primary hover:bg-white/90 font-semibold text-base px-8 py-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="w-5 h-5 mr-2" />
          Registrar ingreso
        </Button>
      </div>
    </div>
  );
}
