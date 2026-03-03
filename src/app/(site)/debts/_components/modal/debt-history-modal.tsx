"use client";

import { Receipt, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/helpers/currency-formatter";
import { formatDateTime } from "@/helpers/date-formatter";
import { useDebtModalsStore } from "@/stores/debt-modals.store";
import { useDebtPayments, useDeleteDebt, useDeleteDebtPayment } from "@/hooks/useDebt";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertDialogModal } from "@/components/modal/alert-dialog-modal";
import { EditDebtPaymentInline } from "./edit-debt-payment-modal";
import { useState } from "react";

export type DebtPayment = {
  id: string;
  debtId: string | null;
  amount: number;
  description: string | null;
  date: string | Date;
};

export const DebtHistoryModal = () => {
  const { history, switchHistoryModal, switchPayModal } = useDebtModalsStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data } = useDebtPayments(history.debtId!);
  const { mutateAsync, isPending } = useDeleteDebt();
  const { mutateAsync: deletePayment, isPending: isDeletingPayment } = useDeleteDebtPayment(history.debtId!);

  if (!data?.ok) return null;
  const payments = data.result ?? [];

  const sorted = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const onDeleteDebt = async () => {
    try {
      await mutateAsync(history.debtId!);
      switchHistoryModal();
      toast.success("Deuda eliminada");
    } catch (error) {
      toast.error("Error al eliminar la deuda");
    }
  };

  const onDeletePayment = async (payment: any) => {
    try {
      await deletePayment({
        paymentId: payment.id,
        amount: payment.amount,
      });
      toast.success("Pago eliminado");
    } catch (error) {
      toast.error("Error al eliminar el pago");
    }
  };

  return (
    <Dialog open={history.isOpen} onOpenChange={() => switchHistoryModal()}>
      <DialogContent className="rounded-2xl max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Historial de {history.debtName}
          </DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="p-3 rounded-xl bg-primary/5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total pagado:</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(totalPaid)}</span>
          </div>
        </div>

        {/* Payments List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {sorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No hay pagos registrados</p>
          ) : (
            sorted.map((payment) => (
              <div key={payment.id}>
                {editingId === payment.id ? (
                  <EditDebtPaymentInline payment={payment} debtId={history.debtId!} onCancel={() => setEditingId(null)} onSuccess={() => setEditingId(null)} />
                ) : (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md border border-border/50 hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                      {payment.description && <p className="text-xs text-muted-foreground">{payment.description}</p>}
                      <p className="text-xs text-muted-foreground">{formatDateTime(payment.date)}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-md" onClick={() => setEditingId(payment.id)} disabled={isDeletingPayment}>
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <AlertDialogModal
                        title="Eliminar pago"
                        description="¿Estás seguro de que deseas eliminar este pago?"
                        onConfirm={() => onDeletePayment(payment)}
                        trigger={
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-md">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" onClick={() => switchPayModal(history.debtId!, history.debtName!)} className="flex-1 rounded-md" disabled={isPending}>
            Agregar pago
          </Button>

          <AlertDialogModal
            trigger={
              <Button className="flex-1 rounded-md" variant="destructive">
                Eliminar
              </Button>
            }
            title="¿Eliminar deuda?"
            description="Esta acción no se puede deshacer."
            onConfirm={() => onDeleteDebt()}
            isLoading={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
