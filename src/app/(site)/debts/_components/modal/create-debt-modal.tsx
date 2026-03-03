"use client";

import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebtModalsStore } from "@/stores/debt-modals.store";
import { useCreateDebt } from "@/hooks/useDebt";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const createDebtSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  totalDebt: z.number().min(0.01, "El monto debe ser mayor a 0"),
  minimumPayment: z.number().min(0, "El pago debe ser no negativo"),
  dueDate: z.string().optional(),
  priority: z.enum(["high", "medium", "low"], { message: "Selecciona una prioridad" }),
});

type CreateDebtFormData = z.infer<typeof createDebtSchema>;

export const CreateDebtModal = () => {
  const { createDebt, switchCreateDebtModal } = useDebtModalsStore();
  const { mutateAsync, isPending } = useCreateDebt();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<CreateDebtFormData>({
    defaultValues: {
      name: "",
      totalDebt: 0,
      minimumPayment: 0,
      priority: "medium",
    },
    resolver: zodResolver(createDebtSchema),
  });

  const onSubmit: SubmitHandler<CreateDebtFormData> = async (data) => {
    try {
      const response = await mutateAsync({
        name: data.name,
        totalDebt: data.totalDebt,
        minimumPayment: data.minimumPayment,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        priority: data.priority,
      });

      if (!response.ok) {
        setError("root", { message: response.error });
        return;
      }

      toast.success("Deuda creada exitosamente");
      reset();
      switchCreateDebtModal();
    } catch (error) {
      console.error("Error al crear deuda:", error);
      setError("root", { message: "Error inesperado al crear la deuda" });
    }
  };

  const handleClose = () => {
    reset();
    switchCreateDebtModal();
  };

  return (
    <Dialog open={createDebt.isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="rounded-2xl max-w-md">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Nueva deuda
            </DialogTitle>
          </DialogHeader>

          {/* Name */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Nombre de la deuda</Label>
            <Input placeholder="Ej: Tarjeta BBVA" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          {/* Total Debt */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Monto total</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-primary">$</span>
              <Input type="number" step="0.01" min="0" placeholder="50000" className="pl-8" {...register("totalDebt", { valueAsNumber: true })} />
            </div>
            {errors.totalDebt && <p className="text-xs text-destructive mt-1">{errors.totalDebt.message}</p>}
          </div>

          {/* Minimum Payment */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Pago mínimo</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-primary">$</span>
              <Input type="number" step="0.01" min="0" placeholder="1000" className="pl-8" {...register("minimumPayment", { valueAsNumber: true })} />
            </div>
            {errors.minimumPayment && <p className="text-xs text-destructive mt-1">{errors.minimumPayment.message}</p>}
          </div>

          {/* Due Date */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Fecha de vencimiento (opcional)</Label>
            <Input type="date" {...register("dueDate")} />
          </div>

          {/* Priority */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Prioridad</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register("priority")}>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            {errors.priority && <p className="text-xs text-destructive mt-1">{errors.priority.message}</p>}
          </div>

          {/* Root error */}
          {errors.root && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{errors.root.message}</div>}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1 rounded-md" onClick={() => handleClose()} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-md" disabled={isPending}>
              {isPending ? "Creando..." : "Crear deuda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
