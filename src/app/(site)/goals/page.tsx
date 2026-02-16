"use client";
import { useState } from "react";
import { ArrowLeft, Plus, Target, X } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const allGoals = [
  { id: 1, name: "Vacaciones Europa", target: 80000, current: 32000, deadline: "Dic 2025" },
  { id: 2, name: "Fondo de emergencia", target: 150000, current: 95000, deadline: "Mar 2025" },
  { id: 3, name: "MacBook Pro", target: 45000, current: 18000, deadline: "Jun 2025" },
  { id: 4, name: "Curso de inglés", target: 25000, current: 25000, deadline: "Completado" },
  { id: 5, name: "Boda", target: 200000, current: 45000, deadline: "Dic 2026" },
];

const Goals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", deadline: "" });

  const totalTarget = allGoals.reduce((acc, g) => acc + g.target, 0);
  const totalSaved = allGoals.reduce((acc, g) => acc + g.current, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

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
              <div className="p-2 rounded-xl bg-goal/10">
                <Target className="w-6 h-6 text-goal" />
              </div>
              <span className="text-xl font-bold text-foreground font-display">Metas de ahorro</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Summary */}
        <div className="bg-card rounded-3xl p-6 shadow-card border border-border/50 mb-8 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-goal/10 animate-pulse-soft" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progreso total</p>
                <p className="text-4xl font-bold text-foreground mb-2">{formatCurrency(totalSaved)}</p>
                <p className="text-muted-foreground">de {formatCurrency(totalTarget)} en metas</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                    <circle cx="50" cy="50" r="40" stroke="url(#goalGradientLarge)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${overallProgress * 2.51} 251`} className="transition-all duration-700" />
                    <defs>
                      <linearGradient id="goalGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(270 70% 60%)" />
                        <stop offset="100%" stopColor="hsl(290 65% 55%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-goal">{Math.round(overallProgress)}%</span>
                  </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="rounded-xl gradient-goal text-goal-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva meta
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allGoals.map((goal) => (
            <ProjectCard key={goal.id} name={goal.name} target={goal.target} current={goal.current} deadline={goal.deadline} />
          ))}
        </div>
      </main>

      {/* New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-card rounded-3xl p-8 w-full max-w-md shadow-card animate-scale-in">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl gradient-goal">
                <Target className="w-8 h-8 text-goal-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Nueva meta</h2>
                <p className="text-muted-foreground">Define tu objetivo de ahorro</p>
              </div>
            </div>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre de la meta</label>
                <Input value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} placeholder="ej. Vacaciones, Carro nuevo..." className="rounded-xl py-5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Monto objetivo</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">$</span>
                  <Input type="text" inputMode="numeric" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} placeholder="0" className="pl-10 rounded-xl py-5 text-xl font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fecha límite (opcional)</label>
                <Input value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} placeholder="ej. Dic 2025" className="rounded-xl py-5" />
              </div>
              <Button type="button" size="lg" className="w-full py-6 rounded-2xl gradient-goal text-goal-foreground font-semibold" onClick={() => setIsModalOpen(false)}>
                <Plus className="w-5 h-5 mr-2" />
                Crear meta
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
