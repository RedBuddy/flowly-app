"use client";

import { ArrowLeft, CreditCard, TrendingDown } from "lucide-react";
import { DebtCard } from "@/components/DebtCard";
import Link from "next/link";
import { CustomHeader } from "@/components/shared/custom-header";

const allDebts = [
  { id: 1, name: "Tarjeta BBVA", totalDebt: 45000, remaining: 28500, dueDate: "15 Feb", minimumPayment: 3200, priority: "high" as const },
  { id: 2, name: "Préstamo Auto", totalDebt: 180000, remaining: 120000, dueDate: "28 Feb", minimumPayment: 5500, priority: "medium" as const },
  { id: 3, name: "Tarjeta Banorte", totalDebt: 22000, remaining: 8500, dueDate: "10 Mar", minimumPayment: 1200, priority: "low" as const },
  { id: 4, name: "Crédito Hipotecario", totalDebt: 1500000, remaining: 1350000, dueDate: "5 Mar", minimumPayment: 12500, priority: "medium" as const },
  { id: 5, name: "Préstamo personal", totalDebt: 35000, remaining: 15000, dueDate: "20 Feb", minimumPayment: 2800, priority: "high" as const },
];

const Debts = () => {
  const totalDebt = allDebts.reduce((acc, d) => acc + d.remaining, 0);
  const totalPaid = allDebts.reduce((acc, d) => acc + (d.totalDebt - d.remaining), 0);
  const monthlyPayments = allDebts.reduce((acc, d) => acc + d.minimumPayment, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const highPriority = allDebts.filter((d) => d.priority === "high");
  const otherDebts = allDebts.filter((d) => d.priority !== "high");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <CustomHeader title="Deudas" icon={<CreditCard className="w-6 h-6 text-primary" />} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-primary" />
              <p className="text-sm text-muted-foreground">Deuda total</p>
            </div>
            <p className="text-3xl font-bold text-primary">{formatCurrency(totalDebt)}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Total pagado</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Pagos mensuales</p>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(monthlyPayments)}</p>
            <p className="text-xs text-muted-foreground mt-1">Mínimos combinados</p>
          </div>
        </div>

        {/* High Priority */}
        {highPriority.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Prioridad alta</h2>
                <p className="text-sm text-muted-foreground">Vencen pronto, paga primero</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highPriority.map((debt) => (
                <DebtCard key={debt.id} name={debt.name} totalDebt={debt.totalDebt} remaining={debt.remaining} dueDate={debt.dueDate} minimumPayment={debt.minimumPayment} priority={debt.priority} />
              ))}
            </div>
          </section>
        )}

        {/* Other Debts */}
        {otherDebts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-muted">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Otras deudas</h2>
                <p className="text-sm text-muted-foreground">Mantén tus pagos al día</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherDebts.map((debt) => (
                <DebtCard key={debt.id} name={debt.name} totalDebt={debt.totalDebt} remaining={debt.remaining} dueDate={debt.dueDate} minimumPayment={debt.minimumPayment} priority={debt.priority} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Debts;
