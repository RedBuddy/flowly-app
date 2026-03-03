"use client";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBudgetModalsStore } from "@/stores/budget-modals.store";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRANSACTION_TYPES, transactionFormSchema, TransactionFormData } from "@/schemas/prisma";
import { useCreateBudgetTransaction } from "@/hooks/useBudget";

export const BudgetAssignModal = () => {
  const { assign, switchAssignModal } = useBudgetModalsStore();
  const { mutateAsync, isPending } = useCreateBudgetTransaction(assign.budgetId!);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    defaultValues: {
      amount: 0,
      description: null,
      type: TRANSACTION_TYPES.ASSIGNMENT,
    },
    resolver: zodResolver(transactionFormSchema),
  });

  const onSubmit: SubmitHandler<TransactionFormData> = async (data) => {
    try {
      const response = await mutateAsync({
        ...data,
        budgetId: assign.budgetId!,
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      reset();
      switchAssignModal();
    } catch (error) {
      console.error("Error al registrar asignación:", error);
      setError("root", { message: "Error inesperado al registrar la asignación" });
    }
  };

  const handleClose = () => {
    reset();
    switchAssignModal();
  };

  return (
    <Dialog open={assign.isOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <DialogHeader>
            <DialogTitle className="flex gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Asignar a {assign.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* <div className="p-3 rounded-xl bg-primary/5">
              <p className="text-xs text-muted-foreground">Asignado actualmente</p>
              <p className="text-lg font-bold text-primary">$0.00</p>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="assign-amount">Monto a asignar</Label>
              <Input id="assign-amount" type="number" {...register("amount", { valueAsNumber: true })} className="rounded-xl text-lg" />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-desc">Descripción (opcional)</Label>
              <Input id="assign-desc" placeholder="Ej: Supermercado" {...register("description")} className="rounded-xl" />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            {/* <div className="p-3 rounded-xl bg-muted">
              <p className="text-xs text-muted-foreground">Nuevo total asignado</p>
              <p className="text-lg font-bold text-foreground">$0.00</p>
            </div> */}
          </div>

          <DialogFooter className="flex w-full">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-md flex-1" onClick={() => switchAssignModal()}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-md flex-1" disabled={isPending}>
              Asignar
            </Button>
          </DialogFooter>

          {/* Error general */}
          {errors.root && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <p className="text-destructive text-sm font-medium">{errors.root.message}</p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
