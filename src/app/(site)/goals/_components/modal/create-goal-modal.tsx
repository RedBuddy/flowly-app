"use client";

import { X, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoalModalsStore } from "@/stores/goal-modals.store";
import { useCreateGoal } from "@/hooks/useGoal";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateGoalFormData {
  name: string;
  target: number;
  deadline?: string;
}

export const CreateGoalModal = () => {
  const { createGoal, switchCreateGoalModal } = useGoalModalsStore();
  const { mutateAsync, isPending } = useCreateGoal();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateGoalFormData>({
    defaultValues: {
      name: "",
      target: 0,
      deadline: "",
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      switchCreateGoalModal(false);
      reset();
    }
  };

  const onSubmit: SubmitHandler<CreateGoalFormData> = async (data) => {
    try {
      const response = await mutateAsync({
        name: data.name,
        target: data.target,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      toast.success("Meta creada");
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear meta:", error);
      setError("root", { message: "Error inesperado al crear la meta" });
    }
  };

  return (
    <Dialog open={createGoal.isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Crear nueva meta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Nombre de la meta</label>
            <Input
              type="text"
              placeholder="Ej: Viaje a playa"
              {...register("name", {
                required: "El nombre es requerido",
                maxLength: { value: 100, message: "Máximo 100 caracteres" },
              })}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          {/* Target input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Monto objetivo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-primary">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8 text-base font-semibold"
                {...register("target", {
                  valueAsNumber: true,
                  required: "El monto es requerido",
                  min: { value: 0, message: "El monto debe ser mayor a 0" },
                })}
              />
            </div>
            {errors.target && <p className="text-xs text-destructive mt-1">{errors.target.message}</p>}
          </div>

          {/* Deadline input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Fecha límite (opcional)</label>
            <Input type="date" {...register("deadline", {})} />
          </div>

          {/* Error message */}
          {errors.root && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{errors.root.message}</div>}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 rounded-md" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-md" disabled={isPending}>
              {isPending ? "Creando..." : "Crear meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
