"use client";

import { Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateBudgetTransaction } from "@/hooks/useBudget";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

interface EditTransactionFormData {
  description: string;
  amount: number;
}

interface Transaction {
  id: string;
  type: "expense" | "assignment";
  amount: number;
  description?: string;
}

interface EditTransactionInlineProps {
  transaction: Transaction;
  budgetId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EditTransactionInline = ({ transaction, budgetId, onCancel, onSuccess }: EditTransactionInlineProps) => {
  const { mutateAsync, isPending } = useUpdateBudgetTransaction(budgetId);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<EditTransactionFormData>({
    defaultValues: {
      description: transaction?.description || "",
      amount: transaction?.amount || 0,
    },
  });

  useEffect(() => {
    if (transaction) {
      setValue("description", transaction.description || "");
      setValue("amount", transaction.amount || 0);
    }
  }, [transaction, setValue]);

  const onSubmit: SubmitHandler<EditTransactionFormData> = async (data) => {
    try {
      if (!transaction) {
        toast.error("No hay transacción seleccionada");
        return;
      }

      const amountDifference = data.amount - transaction.amount;

      const response = await mutateAsync({
        transactionId: transaction.id,
        type: transaction.type,
        amountDifference,
        newAmount: data.amount,
        description: data.description,
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      toast.success("Transacción actualizada");
      onSuccess?.();
    } catch (error) {
      console.error("Error al actualizar transacción:", error);
      setError("root", { message: "Error inesperado al actualizar la transacción" });
    }
  };

  const isExpense = transaction.type === "expense";

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border-2 border-primary/50">
      <div className={`p-2 rounded-md flex-shrink-0 ${isExpense ? "bg-destructive/10" : "bg-primary/10"}`}>
        <Edit className={`w-4 h-4 ${isExpense ? "text-destructive" : "text-primary"}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex items-center gap-2">
        {/* Description input */}
        <Input
          type="text"
          placeholder="Descripción"
          className="text-sm flex-1"
          {...register("description", {
            maxLength: { value: 100, message: "Máximo 100 caracteres" },
          })}
        />

        {/* Amount input */}
        <div className="relative min-w-fit">
          <span className={`absolute left-2 top-1/2 -translate-y-1/2 font-semibold text-sm ${isExpense ? "text-destructive" : "text-primary"}`}>{isExpense ? "-" : "+"}</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="pl-8 w-24 text-sm font-semibold text-right"
            {...register("amount", {
              valueAsNumber: true,
              required: "El monto es requerido",
              min: { value: 0, message: "El monto debe ser mayor a 0" },
            })}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 ml-auto">
          <Button type="submit" size="icon" disabled={isPending} className="flex-shrink-0 bg-accent/30 hover:bg-successfull/50 rounded-md">
            <Check className="w-4 h-4 text-successfull" />
          </Button>
          <Button type="button" size="icon" onClick={onCancel} disabled={isPending} className="flex-shrink-0 bg-accent/30 hover:bg-destructive/50 rounded-md">
            <X className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </form>

      {/* Error message */}
      {errors.root && <div className="absolute bottom-0 left-0 right-0 bg-destructive/10 text-destructive text-xs p-1 rounded-b-xl">{errors.root.message}</div>}
    </div>
  );
};
