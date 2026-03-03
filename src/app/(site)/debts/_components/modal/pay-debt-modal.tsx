"use client";

import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebtModalsStore } from "@/stores/debt-modals.store";
import { useCreateDebtPayment } from "@/hooks/useDebt";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface PayDebtFormData {
  amount: number;
  description: string;
}

export const PayDebtModal = () => {
  const { pay, switchPayModal } = useDebtModalsStore();
  const { mutateAsync, isPending } = useCreateDebtPayment(pay.debtId || "");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<PayDebtFormData>({
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const currentAmount = watch("amount");

  const handleClose = () => {
    reset();
    switchPayModal();
  };

  const onSubmit: SubmitHandler<PayDebtFormData> = async (data) => {
    try {
      if (!pay.debtId) {
        toast.error("Debes seleccionar una deuda");
        return;
      }

      const response = await mutateAsync({
        debtId: pay.debtId,
        amount: data.amount,
        description: data.description || undefined,
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      toast.success("Pago registrado exitosamente");
      reset();
      switchPayModal();
    } catch (error) {
      console.error("Error al registrar pago:", error);
      setError("root", { message: "Error inesperado al registrar el pago" });
      toast.error("Error al registrar el pago");
    }
  };

  return (
    <Dialog open={pay.isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Pagar {pay.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Amount input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Monto a pagar</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-primary">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8 text-base font-semibold"
                {...register("amount", {
                  valueAsNumber: true,
                  required: "El monto es requerido",
                  min: { value: 0, message: "El monto debe ser mayor a 0" },
                })}
              />
            </div>
            {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
          </div>

          {/* Description input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Descripción (opcional)</label>
            <Input
              type="text"
              placeholder="Ej: Pago quincenal"
              {...register("description", {
                maxLength: { value: 100, message: "Máximo 100 caracteres" },
              })}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>

          {/* Total preview */}
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total a pagar:</span>
              <span className="text-lg font-bold text-accent">${typeof currentAmount === "number" ? currentAmount.toFixed(2) : "0.00"}</span>
            </div>
          </div>

          {/* Error message */}
          {errors.root && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{errors.root.message}</div>}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1 rounded-md" onClick={() => handleClose()} disabled={isPending}>
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-md" disabled={isPending}>
              {isPending ? "Pagando..." : "Pagar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
