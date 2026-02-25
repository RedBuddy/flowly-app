"use client";

import { Plus, X, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { budgetCreateSchema, BudgetFormData, BUDGET_TYPES, BUDGET_TYPE_LABELS } from "@/schemas/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBudget } from "@/hooks/useBudget";

interface RegisterBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterBudgetModal({ isOpen, onClose }: RegisterBudgetModalProps) {
  const { mutateAsync, isPending } = useCreateBudget();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    defaultValues: {
      name: "",
      type: BUDGET_TYPES.RECURRENT,
      totalAssigned: 0,
    },
    resolver: zodResolver(budgetCreateSchema),
  });

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<BudgetFormData> = async (data) => {
    try {
      const response = await mutateAsync(data);

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      onClose();
      reset();
    } catch (error) {
      console.error("Error al registrar presupuesto:", error);
      setError("root", { message: "Error inesperado al registrar el presupuesto" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card text-card-foreground rounded-xl p-8 w-full max-w-md shadow-lg">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-accent transition-colors cursor-pointer">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-accent">
            <PiggyBank className="w-8 h-8 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Crear presupuesto</h2>
            <p className="text-muted-foreground">Asigna dinero a categorías</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <Input {...register("name")} type="text" placeholder="ej. Comida, Transporte, Entretenimiento..." className="py-4 rounded-xl" />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          {/* Type select */}
          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <select {...register("type")} className="w-full px-4 py-2 rounded-xl bg-secondary text-secondary-foreground border border-secondary-foreground/20 cursor-pointer">
              <option value={BUDGET_TYPES.RECURRENT}>{BUDGET_TYPE_LABELS[BUDGET_TYPES.RECURRENT]}</option>
              <option value={BUDGET_TYPES.PROJECT}>{BUDGET_TYPE_LABELS[BUDGET_TYPES.PROJECT]}</option>
            </select>
            {errors.type && <p className="text-destructive text-sm">{errors.type.message}</p>}
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium mb-2">Monto a asignar</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium text-muted-foreground">$</span>
              <Input {...register("totalAssigned", { valueAsNumber: true })} type="number" inputMode="decimal" placeholder="0" className="pl-10 pr-4 py-6 text-3xl font-bold rounded-2xl" step="0.01" />
            </div>
            {errors.totalAssigned && <p className="text-destructive text-sm">{errors.totalAssigned.message}</p>}
          </div>

          {/* Submit button */}
          <Button type="submit" size="lg" className="w-full py-6 rounded-2xl font-semibold text-lg" disabled={isPending}>
            <Plus className="w-5 h-5 mr-2" />
            Crear presupuesto
          </Button>
        </form>
      </div>
    </div>
  );
}
