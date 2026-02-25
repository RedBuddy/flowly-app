"use client";
import { Receipt, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/helpers/currency-formatter";
import { formatDateTime } from "@/helpers/date-formatter";
import { useBudgetModalsStore } from "@/stores/budget-modals.store";
import { useBudgetTransactions } from "@/hooks/useBudget";

export type Transaction = {
  id: string;
  budgetId: string | null;
  type: "expense" | "assignment";
  amount: number;
  description: string;
  date: string; // ISO string
};

export const BudgetTransactionHistory = () => {
  const { history, switchHistoryModal } = useBudgetModalsStore();
  const { data } = useBudgetTransactions(history.budgetId!);

  if (!data?.ok) return null;
  const transactions = data.result ?? [];

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalAssignments = transactions.filter((t) => t.type === "assignment").reduce((s, t) => s + t.amount, 0);

  return (
    <Dialog open={history.isOpen} onOpenChange={() => switchHistoryModal()}>
      <DialogContent className="rounded-2xl max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Historial de {history.name}
          </DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="p-3 rounded-xl bg-destructive/10">
            <p className="text-xs text-muted-foreground">Total gastado</p>
            <p className="text-lg font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/5">
            <p className="text-xs text-muted-foreground">Total asignado</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalAssignments)}</p>
          </div>
        </div>

        {/* Transaction list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {sorted.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Sin movimientos aún</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Usa los botones "Gastar" o "Asignar" para registrar movimientos</p>
            </div>
          ) : (
            sorted.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className={`p-2 rounded-lg ${tx.type === "expense" ? "bg-destructive/10" : "bg-primary/10"}`}>
                  {tx.type === "expense" ? <ArrowUpRight className="w-4 h-4 text-destructive" /> : <ArrowDownLeft className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tx.description || (tx.type === "expense" ? "Gasto" : "Asignación")}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(tx.date)}</p>
                </div>
                <p className={`text-sm font-semibold whitespace-nowrap ${tx.type === "expense" ? "text-destructive" : "text-primary"}`}>
                  {tx.type === "expense" ? "-" : "+"}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
