"use client";
import { MoreHorizontal, Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/currency-formatter";
import { formatDateShort } from "@/helpers/date-formatter";
import { useDebtModalsStore } from "@/stores/debt-modals.store";
import { Debt } from "@/generated/prisma/client";

export function DebtCard({ id, name, totalDebt, remaining, dueDate, priority, createdAt }: Debt) {
  const { switchHistoryModal, switchPayModal } = useDebtModalsStore();

  const progress = totalDebt > 0 ? (remaining / totalDebt) * 100 : 0;
  const paid = totalDebt - remaining;
  const isPriority = priority === "high";

  return (
    <div className="group relative bg-card rounded-xl p-5 shadow-soft border border-border/50 hover:shadow-card transition-all duration-300">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="font-semibold text-foreground text-lg truncate">{name}</h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{formatDateShort(createdAt)}</span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${isPriority ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"}`}>
            {priority === "high" ? "Prioridad alta" : priority === "medium" ? "Prioridad media" : "Prioridad baja"}
          </span>
        </div>
        <button className="p-2 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0" onClick={() => switchHistoryModal(id, name)}>
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${isPriority ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min((paid / totalDebt) * 100, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Pagado: {formatCurrency(paid)}</span>
          <span>de {formatCurrency(totalDebt)}</span>
        </div>
      </div>

      {/* Remaining amount */}
      <div className={`p-3 rounded-xl mb-4 ${isPriority ? "bg-destructive/10" : "bg-primary/10"}`}>
        <p className="text-xs text-muted-foreground mb-1">Pendiente</p>
        <p className={`text-2xl font-bold ${isPriority ? "text-destructive" : "text-primary"}`}>{formatCurrency(remaining)}</p>
      </div>

      {/* Quick action */}
      <Button size="sm" className="w-full rounded-md" onClick={() => switchPayModal(id, name)}>
        <Plus className="w-4 h-4 mr-1" />
        Pagar
      </Button>
    </div>
  );
}
