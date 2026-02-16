"use client";

import { useState } from "react";
import { ArrowLeft, Plus, PiggyBank, Filter } from "lucide-react";
import { BudgetCard } from "@/components/BudgetCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const allBudgets = [
  { id: 1, name: "Alimentación", type: "recurrent" as const, spent: 4500, total: 6000, available: 1500 },
  { id: 2, name: "Transporte", type: "recurrent" as const, spent: 1800, total: 2500, available: 700 },
  { id: 3, name: "Entretenimiento", type: "recurrent" as const, spent: 800, total: 2000, available: 1200 },
  { id: 4, name: "Renovación cocina", type: "project" as const, spent: 15000, total: 25000, available: 10000 },
  { id: 5, name: "Servicios", type: "recurrent" as const, spent: 2800, total: 3500, available: 700 },
  { id: 6, name: "Salud", type: "recurrent" as const, spent: 1200, total: 4000, available: 2800 },
  { id: 7, name: "Ropa", type: "recurrent" as const, spent: 500, total: 1500, available: 1000 },
  { id: 8, name: "Educación", type: "project" as const, spent: 8000, total: 12000, available: 4000 },
];

const Budgets = () => {
  const [filter, setFilter] = useState<"all" | "recurrent" | "project">("all");

  const filteredBudgets = allBudgets.filter((b) => {
    if (filter === "all") return true;
    return b.type === filter;
  });

  const totalAssigned = allBudgets.reduce((acc, b) => acc + b.total, 0);
  const totalSpent = allBudgets.reduce((acc, b) => acc + b.spent, 0);
  const totalAvailable = allBudgets.reduce((acc, b) => acc + b.available, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <PiggyBank className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground font-display">Presupuestos</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total asignado</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAssigned)}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total gastado</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Disponible</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalAvailable)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {[
              { value: "all", label: "Todos" },
              { value: "recurrent", label: "Recurrentes" },
              { value: "project", label: "Proyectos" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as typeof filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo presupuesto
          </Button>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBudgets.map((budget) => (
            <BudgetCard key={budget.id} name={budget.name} type={budget.type} spent={budget.spent} total={budget.total} available={budget.available} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Budgets;
