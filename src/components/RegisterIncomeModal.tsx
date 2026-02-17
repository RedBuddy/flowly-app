import { useState } from "react";
import { Plus, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RegisterIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, description: string) => void;
}

export function RegisterIncomeModal({ isOpen, onClose, onSubmit }: RegisterIncomeModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    if (numAmount > 0) {
      onSubmit(numAmount, description);
      setAmount("");
      setDescription("");
      onClose();
    }
  };

  const formatInput = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card text-card-foreground rounded-xl p-8 w-full max-w-md shadow-lg">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-accent transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium mb-2">Monto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium text-muted-foreground">$</span>
              <Input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(formatInput(e.target.value))} placeholder="0" className="pl-10 pr-4 py-6 text-3xl font-bold rounded-2xl" />
            </div>
          </div>

          {/* Description input */}
          <div>
            <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
            <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="ej. Pago de freelance, salario..." className="py-4 rounded-xl" />
          </div>

          {/* Quick amounts */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Montos rápidos</p>
            <div className="flex gap-2 flex-wrap">
              {[1000, 5000, 10000, 20000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(formatInput(quickAmount.toString()))}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    amount === formatInput(quickAmount.toString()) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  ${quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <Button type="submit" size="lg" className="w-full py-6 rounded-2xl font-semibold text-lg" disabled={!amount || parseFloat(amount.replace(/,/g, "")) <= 0}>
            <Plus className="w-5 h-5 mr-2" />
            Agregar ingreso
          </Button>
        </form>
      </div>
    </div>
  );
}
