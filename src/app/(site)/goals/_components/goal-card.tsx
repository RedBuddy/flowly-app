"use client";
import { MoreHorizontal, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/currency-formatter";
import { formatDateShort } from "@/helpers/date-formatter";
import { useGoalModalsStore } from "@/stores/goal-modals.store";
import { Goal } from "@/generated/prisma/client";

export function GoalCard({ id, name, target, current, deadline }: Goal) {
  const { switchHistoryModal, switchContributeModal } = useGoalModalsStore();
  const progress = target > 0 ? (current / target) * 100 : 0;
  const remaining = target - current;

  return (
    <div className="group relative bg-card rounded-xl p-5 shadow-soft border border-border/50 hover:shadow-card transition-all duration-300">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="font-semibold text-foreground text-lg truncate">{name}</h3>
            {deadline && <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{formatDateShort(deadline)}</span>}
          </div>
        </div>
        <button className="p-2 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0" onClick={() => switchHistoryModal(id, name)}>
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500 bg-primary" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Ahorrado: {formatCurrency(current)}</span>
          <span>de {formatCurrency(target)}</span>
        </div>
      </div>

      {/* Remaining amount */}
      <div className="p-3 rounded-xl mb-4 bg-primary/10">
        <p className="text-xs text-muted-foreground mb-1">Te falta</p>
        <p className="text-2xl font-bold text-primary">{formatCurrency(remaining)}</p>
      </div>

      {/* Quick action */}
      <Button size="sm" className="w-full rounded-md" onClick={() => switchContributeModal(id, name)}>
        <Plus className="w-4 h-4 mr-1" />
        Abonar a meta
      </Button>
    </div>
  );
}
