import { AlertCircle, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Priority = "high" | "medium" | "low";

interface DebtCardProps {
  name: string;
  totalDebt: number;
  remaining: number;
  dueDate: string;
  minimumPayment: number;
  priority: Priority;
  onPay?: () => void;
}

const priorityStyles: Record<Priority, { accent: string; bg: string; text: string }> = {
  high: { accent: "bg-debt", bg: "bg-debt/10", text: "text-debt" },
  medium: { accent: "bg-warning", bg: "bg-warning/10", text: "text-warning" },
  low: { accent: "bg-primary", bg: "bg-primary/10", text: "text-primary" },
};

export function DebtCard({
  name,
  totalDebt,
  remaining,
  dueDate,
  minimumPayment,
  priority,
  onPay,
}: DebtCardProps) {
  const progress = totalDebt > 0 ? ((totalDebt - remaining) / totalDebt) * 100 : 0;
  const styles = priorityStyles[priority];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isUrgent = priority === "high";

  return (
    <div className={cn(
      "relative bg-card rounded-2xl p-5 shadow-soft border overflow-hidden hover:shadow-card transition-all duration-300 animate-scale-in",
      isUrgent ? "border-debt/30" : "border-border/50"
    )}>
      {/* Priority accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", styles.accent)} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-3 rounded-xl", styles.bg)}>
            <CreditCard className={cn("w-6 h-6", styles.text)} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className={cn(
                "text-sm font-medium",
                isUrgent ? "text-debt" : "text-muted-foreground"
              )}>
                Vence: {dueDate}
              </span>
            </div>
          </div>
        </div>
        {isUrgent && (
          <div className="p-2 rounded-xl bg-debt/10">
            <AlertCircle className="w-5 h-5 text-debt" />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-muted-foreground">Progreso de pago</span>
          <span className="font-medium text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", styles.accent)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Amount info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={cn("p-3 rounded-xl", styles.bg)}>
          <p className="text-xs text-muted-foreground mb-1">Por pagar</p>
          <p className={cn("text-xl font-bold", styles.text)}>
            {formatCurrency(remaining)}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Pago mínimo</p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(minimumPayment)}
          </p>
        </div>
      </div>

      <Button
        onClick={onPay}
        className={cn(
          "w-full rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
          isUrgent
            ? "bg-debt hover:bg-debt/90 text-debt-foreground"
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        )}
      >
        Abonar ahora
      </Button>
    </div>
  );
}