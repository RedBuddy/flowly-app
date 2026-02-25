"use client";
import { Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBudgetModalsStore } from "@/stores/budget-modals.store";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionFormData, transactionFormSchema, TRANSACTION_TYPES } from "@/schemas/prisma";
import { useCreateBudgetTransaction } from "@/hooks/useBudget";

export const BudgetSpendModal = () => {
  const { spend, switchSpendModal } = useBudgetModalsStore();
  const { mutateAsync, isPending } = useCreateBudgetTransaction(spend.budgetId!);

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
      type: TRANSACTION_TYPES.EXPENSE,
    },
    resolver: zodResolver(transactionFormSchema),
  });

  const onSubmit: SubmitHandler<TransactionFormData> = async (data) => {
    try {
      const response = await mutateAsync({
        ...data,
        budgetId: spend.budgetId!,
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      reset();
      switchSpendModal();
    } catch (error) {
      console.error("Error al registrar gasto:", error);
      setError("root", { message: "Error inesperado al registrar el gasto" });
    }
  };

  return (
    <Dialog open={spend.isOpen} onOpenChange={() => switchSpendModal()}>
      <DialogContent className="rounded-2xl">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("Errores de validación:", errors);
          })}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              Registrar gasto en {spend.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 rounded-xl bg-muted">
              <p className="text-xs text-muted-foreground">Disponible</p>
              <p className="text-lg font-bold text-foreground">$0.00</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spend-amount">Monto</Label>
              <Input id="spend-amount" type="number" {...register("amount", { valueAsNumber: true })} className="rounded-xl text-lg" />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="spend-desc">Descripción (opcional)</Label>
              <Input id="spend-desc" placeholder="Ej: Supermercado" {...register("description")} className="rounded-xl" />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl" onClick={() => switchSpendModal()}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-xl" disabled={isPending}>
              Registrar gasto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
