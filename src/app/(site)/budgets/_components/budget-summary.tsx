import { formatCurrency } from "@/helpers/currency-formatter";

interface Props {
  totalAssigned: number;
  totalSpent: number;
  totalAvailable: number;
}

export const BudgetSummary = ({ totalAssigned, totalSpent, totalAvailable }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card rounded-2xl px-5 py-2 shadow-soft border border-border/50">
        <p className="text-sm text-muted-foreground mb-1">Total asignado</p>
        <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAssigned)}</p>
      </div>
      <div className="bg-card rounded-2xl px-5 py-2 shadow-soft border border-border/50">
        <p className="text-sm text-muted-foreground mb-1">Total gastado</p>
        <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
      </div>
      <div className="bg-card rounded-2xl px-5 py-2 shadow-soft border border-border/50">
        <p className="text-sm text-muted-foreground mb-1">Disponible</p>
        <p className="text-2xl font-bold text-primary">{formatCurrency(totalAvailable)}</p>
      </div>
    </div>
  );
};
