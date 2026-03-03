"use client";

import { Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateIncome } from "@/hooks/useIncome";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

interface EditIncomeFormData {
  description: string;
  amount: number;
}

interface Income {
  id: string;
  amount: number;
  description: string | null;
  date: string | Date;
}

interface EditIncomeInlineProps {
  income: Income;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EditIncomeInline = ({ income, onCancel, onSuccess }: EditIncomeInlineProps) => {
  const { mutateAsync, isPending } = useUpdateIncome();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<EditIncomeFormData>({
    defaultValues: {
      description: income?.description || "",
      amount: income?.amount || 0,
    },
  });

  useEffect(() => {
    if (income) {
      setValue("description", income.description || "");
      setValue("amount", income.amount || 0);
    }
  }, [income, setValue]);

  const onSubmit: SubmitHandler<EditIncomeFormData> = async (data) => {
    try {
      if (!income) {
        toast.error("No hay ingreso seleccionado");
        return;
      }

      const response = await mutateAsync({
        incomeId: income.id,
        data: {
          amount: data.amount,
          description: data.description,
          date: typeof income.date === "string" ? income.date : income.date.toISOString(),
        },
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      toast.success("Ingreso actualizado");
      onSuccess?.();
    } catch (error) {
      console.error("Error al actualizar ingreso:", error);
      setError("root", { message: "Error inesperado al actualizar el ingreso" });
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border-2 border-emerald-500/50">
      <div className="p-2 rounded-md flex-shrink-0 bg-emerald-500/10">
        <Edit className="w-4 h-4 text-emerald-600" />
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
          <span className="absolute left-2 top-1/2 -translate-y-1/2 font-semibold text-sm text-emerald-600">+</span>
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
          <Button type="submit" size="icon" disabled={isPending} className="flex-shrink-0 bg-accent/30 hover:bg-emerald-500/50 rounded-md">
            <Check className="w-4 h-4 text-emerald-600" />
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
