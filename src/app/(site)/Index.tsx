"use client";
import { Bell, CreditCard, PiggyBank, Target, Wallet } from "lucide-react";
import { AlertCard } from "@/components/AlertCard";
import { BudgetCard } from "@/components/BudgetCard";
import { ProjectCard } from "@/components/ProjectCard";
import { DebtCard } from "@/components/DebtCard";
import { SectionHeader } from "@/components/SectionHeader";
import { redirect } from "next/navigation";

// Mock data
const mockBudgets = [
  { id: 1, name: "Alimentación", type: "recurrent" as const, spent: 4500, total: 6000, available: 1500 },
  { id: 2, name: "Transporte", type: "recurrent" as const, spent: 1800, total: 2500, available: 700 },
  { id: 3, name: "Entretenimiento", type: "recurrent" as const, spent: 800, total: 2000, available: 1200 },
  { id: 4, name: "Renovación cocina", type: "project" as const, spent: 15000, total: 25000, available: 10000 },
];

const mockProjects = [
  { id: 1, name: "Vacaciones Europa", target: 80000, current: 32000, deadline: "Dic 2025" },
  { id: 2, name: "Fondo de emergencia", target: 150000, current: 95000, deadline: "Mar 2025" },
];

const mockDebts = [
  { id: 1, name: "Tarjeta BBVA", totalDebt: 45000, remaining: 28500, dueDate: "15 Feb", minimumPayment: 3200, priority: "high" as const },
  { id: 2, name: "Préstamo Auto", totalDebt: 180000, remaining: 120000, dueDate: "28 Feb", minimumPayment: 5500, priority: "medium" as const },
];

const mockAlerts = [
  { type: "debt" as const, title: "Pago próximo", message: "Tarjeta BBVA vence en 10 días", actionLabel: "Ver" },
  { type: "budget" as const, title: "Presupuesto bajo", message: "Alimentación al 75% del límite", actionLabel: "Revisar" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Balance Card */}

        {/* Alerts */}
        {mockAlerts.length > 0 && (
          <section className="mb-8">
            <SectionHeader title="Alertas" subtitle="Requieren tu atención" icon={Bell} iconClassName="bg-warning/10 text-warning" />
            <div className="space-y-3">
              {mockAlerts.map((alert, index) => (
                <AlertCard key={index} type={alert.type} title={alert.title} message={alert.message} actionLabel={alert.actionLabel} />
              ))}
            </div>
          </section>
        )}

        {/* Budgets */}
        <section className="mb-8">
          <SectionHeader title="Presupuestos" subtitle="Controla tus gastos" icon={PiggyBank} iconClassName="bg-primary/10 text-primary" action={{ label: "Ver todos", onClick: () => redirect("/budgets") }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockBudgets.map((budget) => (
              <BudgetCard key={budget.id} name={budget.name} type={budget.type} spent={budget.spent} total={budget.total} available={budget.available} />
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-8">
          <SectionHeader title="Metas de ahorro" subtitle="Tus proyectos financieros" icon={Target} iconClassName="bg-goal/10 text-goal" action={{ label: "Nueva meta", onClick: () => redirect("/goals") }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} name={project.name} target={project.target} current={project.current} deadline={project.deadline} />
            ))}
          </div>
        </section>

        {/* Debts */}
        <section className="mb-8">
          <SectionHeader title="Deudas" subtitle="Mantén el control de tus pagos" icon={CreditCard} iconClassName="bg-debt/10 text-debt" action={{ label: "Ver todas", onClick: () => redirect("/debts") }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDebts.map((debt) => (
              <DebtCard key={debt.id} name={debt.name} totalDebt={debt.totalDebt} remaining={debt.remaining} dueDate={debt.dueDate} minimumPayment={debt.minimumPayment} priority={debt.priority} />
            ))}
          </div>
        </section>
      </main>

      {/* Register Income Modal */}
    </div>
  );
};

export default Index;
