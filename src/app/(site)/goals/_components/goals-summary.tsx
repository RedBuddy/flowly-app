"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/currency-formatter";
import { useGoals } from "@/hooks/useGoal";
import { useGoalModalsStore } from "@/stores/goal-modals.store";

export const GoalsSummary = () => {
  const { data } = useGoals();
  const { switchCreateGoalModal } = useGoalModalsStore();
  const goals = data?.ok ? data.result ?? [] : [];

  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.current, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 mb-8 overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 animate-pulse" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Progreso total</p>
            <p className="text-4xl font-bold text-foreground mb-2">{formatCurrency(totalSaved)}</p>
            <p className="text-muted-foreground">de {formatCurrency(totalTarget)} en metas</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <circle cx="50" cy="50" r="40" stroke="url(#goalGradientLarge)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${overallProgress * 2.51} 251`} className="transition-all duration-700" />
                <defs>
                  <linearGradient id="goalGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(270 70% 60%)" />
                    <stop offset="100%" stopColor="hsl(290 65% 55%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{Math.round(overallProgress)}%</span>
              </div>
            </div>
            <Button onClick={() => switchCreateGoalModal(true)} className="rounded-md bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nueva meta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
