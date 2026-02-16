import { AlertTriangle, Calendar, ChevronRight, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "debt" | "budget" | "warning";

interface AlertCardProps {
  type: AlertType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const alertStyles: Record<AlertType, { bg: string; icon: string; iconBg: string }> = {
  debt: {
    bg: "bg-debt/5 border-debt/20",
    icon: "text-debt",
    iconBg: "bg-debt/10",
  },
  budget: {
    bg: "bg-warning/5 border-warning/20",
    icon: "text-warning",
    iconBg: "bg-warning/10",
  },
  warning: {
    bg: "bg-muted border-border",
    icon: "text-muted-foreground",
    iconBg: "bg-muted",
  },
};

const alertIcons: Record<AlertType, React.ElementType> = {
  debt: Calendar,
  budget: TrendingDown,
  warning: AlertTriangle,
};

export function AlertCard({ type, title, message, actionLabel, onAction }: AlertCardProps) {
  const styles = alertStyles[type];
  const Icon = alertIcons[type];

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-soft cursor-pointer animate-slide-up",
        styles.bg
      )}
      onClick={onAction}
    >
      <div className={cn("p-3 rounded-xl", styles.iconBg)}>
        <Icon className={cn("w-5 h-5", styles.icon)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{message}</p>
      </div>

      {actionLabel && (
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline whitespace-nowrap">
          {actionLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}