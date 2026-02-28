import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Target, X } from "lucide-react";

interface RegisterGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterGoalModal = ({ isOpen, onClose }: RegisterGoalModalProps) => {
  const [newGoal, setNewGoal] = useState({ name: "", target: "", deadline: "" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in" onClick={() => onClose()} />
      <div className="relative bg-card rounded-2xl p-8 w-full max-w-md shadow-card animate-scale-in">
        <button onClick={() => onClose()} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-primary/10">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Nueva meta</h2>
            <p className="text-muted-foreground">Define tu objetivo de ahorro</p>
          </div>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nombre de la meta</label>
            <Input value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} placeholder="ej. Vacaciones, Carro nuevo..." className="rounded-xl py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Monto objetivo</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">$</span>
              <Input type="text" inputMode="numeric" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} placeholder="0" className="pl-10 rounded-xl py-2 text-xl font-semibold" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fecha límite (opcional)</label>
            <Input value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} placeholder="ej. Dic 2025" className="rounded-xl py-2" />
          </div>
          <Button type="button" className="w-full rounded-xl bg-primary text-primary-foreground font-semibold" onClick={() => onClose()}>
            <Plus className="w-5 h-5 mr-2" />
            Crear meta
          </Button>
        </form>
      </div>
    </div>
  );
};
