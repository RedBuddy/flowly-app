"use client";

import { Receipt, Trash2, Edit, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/helpers/currency-formatter";
import { formatDateTime } from "@/helpers/date-formatter";
import { useGoalModalsStore } from "@/stores/goal-modals.store";
import { useGoalContributions, useDeleteGoal, useDeleteGoalContribution } from "@/hooks/useGoal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertDialogModal } from "@/components/modal/alert-dialog-modal";
import { EditGoalContributionInline } from "./edit-goal-contribution-modal";
import { useState } from "react";

export type GoalContribution = {
  id: string;
  goalId: string | null;
  amount: number;
  description: string;
  date: string;
};

export const GoalHistoryModal = () => {
  const { history, switchHistoryModal } = useGoalModalsStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data } = useGoalContributions(history.goalId!);
  const { mutateAsync, isPending } = useDeleteGoal();
  const { mutateAsync: deleteContribution, isPending: isDeletingContribution } = useDeleteGoalContribution(history.goalId!);

  if (!data?.ok) return null;
  const contributions = data.result ?? [];

  const sorted = [...contributions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);

  const onDeleteGoal = async () => {
    try {
      await mutateAsync(history.goalId!);
      switchHistoryModal();
      toast.success("Meta eliminada");
    } catch (error) {
      toast.error("Error al eliminar la meta");
    }
  };

  const onDeleteContribution = async (contribution: any) => {
    try {
      await deleteContribution({
        contributionId: contribution.id,
        amount: contribution.amount,
      });
      toast.success("Contribución eliminada");
    } catch (error) {
      toast.error("Error al eliminar la contribución");
    }
  };

  return (
    <>
      <Dialog open={history.isOpen} onOpenChange={() => switchHistoryModal()}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Historial de {history.goalName}
            </DialogTitle>
          </DialogHeader>

          {/* Summary */}
          <div className="p-3 rounded-xl bg-primary/5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-muted-foreground">Total contribuido</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(totalContributed)}</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min((totalContributed / (data as any).goalTarget || 1) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Contribution list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {sorted.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Sin contribuciones aún</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Comienza a contribuir a esta meta</p>
              </div>
            ) : (
              sorted.map((contrib) =>
                editingId === contrib.id ? (
                  <EditGoalContributionInline
                    key={contrib.id}
                    contribution={{
                      id: contrib.id,
                      amount: contrib.amount,
                      description: contrib.description || "",
                    }}
                    goalId={history.goalId || ""}
                    onCancel={() => setEditingId(null)}
                    onSuccess={() => setEditingId(null)}
                  />
                ) : (
                  <div key={contrib.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{contrib.description || "Contribución"}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(contrib.date)}</p>
                    </div>
                    <p className="text-sm font-semibold whitespace-nowrap text-primary">+{formatCurrency(contrib.amount)}</p>
                    <Button size="icon" className="bg-accent ml-2 opacity-50 hover:bg-primary/50 hover:opacity-100 transition-all" onClick={() => setEditingId(contrib.id)} disabled={isDeletingContribution}>
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button size="icon" className="bg-accent opacity-50 hover:bg-destructive/50 hover:opacity-100 transition-all" onClick={() => onDeleteContribution(contrib)} disabled={isDeletingContribution}>
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                )
              )
            )}
          </div>

          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={() => switchHistoryModal()} className="flex-1" disabled={isPending}>
              Cerrar
            </Button>

            <AlertDialogModal
              trigger={
                <Button className="flex-1" variant="destructive">
                  Eliminar
                </Button>
              }
              title="¿Eliminar meta?"
              description="Esta acción no se puede deshacer."
              onConfirm={() => onDeleteGoal()}
              isLoading={isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
