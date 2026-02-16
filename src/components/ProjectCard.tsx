import { Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  name: string;
  target: number;
  current: number;
  deadline?: string;
  onContribute?: () => void;
}

export function ProjectCard({
  name,
  target,
  current,
  deadline,
  onContribute,
}: ProjectCardProps) {
  const progress = target > 0 ? (current / target) * 100 : 0;
  const remaining = target - current;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative bg-card rounded-2xl p-5 shadow-soft border border-border/50 overflow-hidden hover:shadow-card transition-all duration-300 animate-scale-in">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-goal" />

      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-goal/10">
          <Target className="w-6 h-6 text-goal" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{name}</h3>
          {deadline && (
            <p className="text-sm text-muted-foreground">Meta: {deadline}</p>
          )}
        </div>
      </div>

      {/* Circular progress indicator */}
      <div className="flex items-center gap-6 mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#goalGradient)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.51} 251`}
              className="transition-all duration-700"
            />
            <defs>
              <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(270 70% 60%)" />
                <stop offset="100%" stopColor="hsl(290 65% 55%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-goal">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-goal" />
            <span className="text-sm font-medium text-goal">En progreso</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(current)}</p>
          <p className="text-sm text-muted-foreground">
            de {formatCurrency(target)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 mb-4">
        <span className="text-sm text-muted-foreground">Te falta</span>
        <span className="font-semibold text-foreground">{formatCurrency(remaining)}</span>
      </div>

      <Button
        onClick={onContribute}
        className="w-full rounded-xl gradient-goal text-goal-foreground hover:opacity-90 transition-opacity"
      >
        Abonar a meta
      </Button>
    </div>
  );
}