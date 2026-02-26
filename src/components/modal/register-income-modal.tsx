"use client";

import { useTransition } from "react";
import { Plus, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { incomeCreateSchema, IncomeFormData } from "@/schemas/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateIncomeAction } from "@/actions/incomes/create-income.action";
import { useRouter } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/client";

interface RegisterIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterIncomeModal({ isOpen, onClose }: RegisterIncomeModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<IncomeFormData>({
    defaultValues: { amount: 0, description: "" },
    resolver: zodResolver(incomeCreateSchema),
  });

  const currentAmount = watch("amount");

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<IncomeFormData> = (data) => {
    startTransition(async () => {
      try {
        const response = await CreateIncomeAction(data);

        if (!response.ok) {
          setError("root", { message: response.error });
          return;
        }

        router.push("/"); // Redireccionar a la página principal o actualizar el estado global para reflejar el nuevo ingreso
        onClose(); // Cerrar el modal después de un registro exitoso
        reset(); // Resetear los valores del formulario
      } catch (error) {
        console.error("Error al registrar ingreso:", error);
        setError("root", { message: "Error inesperado al registrar el ingreso" });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card text-card-foreground rounded-xl p-8 w-full max-w-md shadow-lg">
        {/* Close button */}
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
          <X className="w-5 h-5 text-muted-foreground" />
        </Button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-accent">
            <Wallet className="w-8 h-8 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Registrar ingreso</h2>
            <p className="text-muted-foreground">Añade dinero a tu cartera</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium mb-2">Monto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium text-muted-foreground">$</span>
              <Input {...register("amount", { valueAsNumber: true })} type="number" inputMode="decimal" placeholder="0" className="pl-10 pr-4 py-4 text-3xl font-bold rounded-xl" step="0.01" />
            </div>
            {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
          </div>

          {/* Description input */}
          <div>
            <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
            <Input {...register("description")} type="text" placeholder="ej. Pago de freelance, salario..." className="py-4 rounded-xl" />
            {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
          </div>

          {/* Quick amounts */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Montos rápidos</p>
            <div className="flex gap-2 flex-wrap">
              {[1000, 5000, 10000, 20000].map((quickAmount) => {
                const isSelected = currentAmount === quickAmount;
                return (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setValue("amount", quickAmount)}
                    className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer", isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}
                  >
                    ${quickAmount.toLocaleString()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full rounded-xl" disabled={isPending}>
            <Plus className="w-5 h-5 mr-2" />
            Agregar ingreso
          </Button>
        </form>
      </div>
    </div>
  );
}
