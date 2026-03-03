"use client";

import { Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateGoalContribution } from "@/hooks/useGoal";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

interface EditGoalContributionFormData {
  description: string;
  amount: number;
}

interface Contribution {
  id: string;
  amount: number;
  description?: string;
}

interface EditGoalContributionInlineProps {
  contribution: Contribution;
  goalId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EditGoalContributionInline = ({ contribution, goalId, onCancel, onSuccess }: EditGoalContributionInlineProps) => {
  const { mutateAsync, isPending } = useUpdateGoalContribution(goalId);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<EditGoalContributionFormData>({
    defaultValues: {
      description: contribution?.description || "",
      amount: contribution?.amount || 0,
    },
  });

  useEffect(() => {
    if (contribution) {
      setValue("description", contribution.description || "");
      setValue("amount", contribution.amount || 0);
    }
  }, [contribution, setValue]);

  const onSubmit: SubmitHandler<EditGoalContributionFormData> = async (data) => {
    try {
      if (!contribution) {
        toast.error("No hay contribución seleccionada");
        return;
      }

      const amountDifference = data.amount - contribution.amount;

      const response = await mutateAsync({
        contributionId: contribution.id,
        amountDifference,
        newAmount: data.amount,
        description: data.description,
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      toast.success("Contribución actualizada");
      onSuccess?.();
    } catch (error) {
      console.error("Error al actualizar contribución:", error);
      setError("root", { message: "Error inesperado al actualizar la contribución" });
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border-2 border-primary/50">
      <div className="p-2 rounded-lg flex-shrink-0 bg-primary/10">
        <Edit className="w-4 h-4 text-primary" />
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
          <span className="absolute left-2 top-1/2 -translate-y-1/2 font-semibold text-sm text-primary">+</span>
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
          <Button type="submit" size="icon" disabled={isPending} className="bg-primary/50 hover:bg-green-500 flex-shrink-0">
            <Check className="w-4 h-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={onCancel} disabled={isPending} className="flex-shrink-0 hover:bg-red-500">
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </form>

      {/* Error message */}
      {errors.root && <div className="absolute bottom-0 left-0 right-0 bg-destructive/10 text-destructive text-xs p-1 rounded-b-xl">{errors.root.message}</div>}
    </div>
  );
};
