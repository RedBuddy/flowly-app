"use client";
import { MoreHorizontal, Plus, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/currency-formatter";
import { useBudgetModalsStore } from "@/stores/budget-modals.store";
import { BUDGET_TYPES } from "@/schemas/prisma";

interface BudgetCardProps {
  id: string;
  name: string;
  type: (typeof BUDGET_TYPES)[keyof typeof BUDGET_TYPES];
  spent: number;
  total: number;
  available: number;
}

export function BudgetCard({ id, name, type, spent, total, available }: BudgetCardProps) {
  const { switchSpendModal, switchAssignModal, switchHistoryModal } = useBudgetModalsStore();

  const progress = total > 0 ? (spent / total) * 100 : 0;
  const isLow = available < total * 0.2;

  return (
    <div className="group relative bg-card rounded-2xl p-5 shadow-soft border border-border/50 hover:shadow-card transition-all duration-300 animate-scale-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg">{name}</h3>
          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1", type === BUDGET_TYPES.RECURRENT ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground")}>
            {type === BUDGET_TYPES.RECURRENT ? "Recurrente" : "Proyecto"}
          </span>
        </div>
        <button className="p-2 rounded-xl hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => switchHistoryModal(id, name)}>
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-500", isLow ? "bg-destructive" : "bg-primary")} style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Gastado: {formatCurrency(spent)}</span>
          <span>de {formatCurrency(total)}</span>
        </div>
      </div>

      {/* Available amount */}
      <div className={cn("p-3 rounded-xl mb-4", isLow ? "bg-destructive/10" : "bg-primary/10")}>
        <p className="text-xs text-muted-foreground mb-1">Disponible</p>
        <p className={cn("text-2xl font-bold", isLow ? "text-destructive" : "text-primary")}>{formatCurrency(available)}</p>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => switchSpendModal(id, name)}>
          <Receipt className="w-4 h-4 mr-1" />
          Gastar
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 rounded-xl" onClick={() => switchAssignModal(id, name)}>
          <Plus className="w-4 h-4 mr-1" />
          Asignar
        </Button>
      </div>
    </div>
  );
}
