"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIncomeModalsStore } from "@/stores/income-modals.store";
import { useGetMonthlyIncomes, useDeleteIncome } from "@/hooks/useIncome";
import { formatCurrency } from "@/helpers/currency-formatter";
import { formatDateShort } from "@/helpers/date-formatter";
import { Skeleton } from "@/components/ui/skeleton";
import { Income } from "@/generated/prisma/client";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { EditIncomeInline } from "./edit-income-modal";
import { AlertDialogModal } from "@/components/modal/alert-dialog-modal";
import { toast } from "sonner";

export function IncomeHistoryModal() {
  const { history, switchHistoryModal } = useIncomeModalsStore();
  const { data, isLoading } = useGetMonthlyIncomes();
  const { mutateAsync: deleteIncome, isPending: isDeletingIncome } = useDeleteIncome();
  const [editingId, setEditingId] = useState<string | null>(null);

  const incomes: Income[] = data?.ok ? data?.result || [] : [];
  const totalIncomes = incomes.reduce((sum: number, income: Income) => sum + income.amount, 0);

  const onDeleteIncome = async (income: Income) => {
    try {
      await deleteIncome(income.id);
      toast.success("Ingreso eliminado");
    } catch (error) {
      toast.error("Error al eliminar el ingreso");
    }
  };

  return (
    <Dialog open={history.isOpen} onOpenChange={switchHistoryModal}>
      <DialogContent className="rounded-2xl max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Historial de Ingresos</DialogTitle>
        </DialogHeader>

        {/* Income List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : incomes.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">No hay ingresos registrados</div>
          ) : (
            incomes.map((income: Income) =>
              editingId === income.id ? (
                <EditIncomeInline key={income.id} income={income} onCancel={() => setEditingId(null)} onSuccess={() => setEditingId(null)} />
              ) : (
                <div key={income.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{income.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDateShort(new Date(income.date))}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(income.amount)}</p>
                  <Button size="icon" className="bg-accent ml-2 opacity-50 hover:bg-emerald-500/50 hover:opacity-100 transition-all rounded-md" onClick={() => setEditingId(income.id)} disabled={isDeletingIncome}>
                    <Edit className="w-4 h-4 text-emerald-600" />
                  </Button>
                  <Button size="icon" className="bg-accent opacity-50 hover:bg-destructive/50 hover:opacity-100 transition-all rounded-md" onClick={() => onDeleteIncome(income)} disabled={isDeletingIncome}>
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              )
            )
          )}
        </div>

        {/* Summary */}
        <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground uppercase">Total ingresos</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalIncomes)}</p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button onClick={() => switchHistoryModal(false)} size="sm" variant="outline" className="w-full font-semibold text-sm rounded-md">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
