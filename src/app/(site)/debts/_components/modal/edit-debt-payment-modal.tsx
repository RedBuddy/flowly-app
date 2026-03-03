"use client";

import { Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateDebtPayment } from "@/hooks/useDebt";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

interface EditDebtPaymentFormData {
  description: string;
  amount: number;
}

interface Payment {
  id: string;
  amount: number;
  description?: string | null;
}

interface EditDebtPaymentInlineProps {
  payment: Payment;
  debtId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EditDebtPaymentInline = ({ payment, debtId, onCancel, onSuccess }: EditDebtPaymentInlineProps) => {
  const { mutateAsync, isPending } = useUpdateDebtPayment(debtId);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditDebtPaymentFormData>({
    defaultValues: {
      amount: payment.amount,
      description: payment.description || "",
    },
  });

  const currentAmount = watch("amount");

  useEffect(() => {
    setValue("amount", payment.amount);
    setValue("description", payment.description || "");
  }, [payment, setValue]);

  const onSubmit: SubmitHandler<EditDebtPaymentFormData> = async (data) => {
    try {
      const response = await mutateAsync({
        paymentId: payment.id,
        amount: data.amount,
        description: data.description,
        oldAmount: payment.amount,
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      toast.success("Pago actualizado");
      onSuccess?.();
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar el pago");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-3 bg-muted/50 rounded-md border border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Monto</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">$</span>
            <Input type="number" step="0.01" min="0" className="pl-6 text-xs" {...register("amount", { valueAsNumber: true, min: { value: 0, message: "Monto debe ser > 0" } })} />
          </div>
          {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Descripción</label>
          <Input type="text" className="text-xs" placeholder="Descripción" {...register("description", { maxLength: 50 })} />
        </div>
      </div>

      {errors.root && <p className="text-xs text-destructive">{errors.root.message}</p>}

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1 rounded-md h-8 bg-green-600 hover:bg-green-700 text-white" disabled={isPending}>
          <Check className="w-3 h-3 mr-1" />
          {isPending ? "..." : "Guardar"}
        </Button>
        <Button type="button" size="sm" variant="ghost" className="flex-1 rounded-md h-8" onClick={onCancel} disabled={isPending}>
          <X className="w-3 h-3 mr-1" />
          Cancelar
        </Button>
      </div>
    </form>
  );
};
