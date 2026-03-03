"use client";
import { DebtCard } from "./debt-card";
import { useDebts } from "@/hooks/useDebt";

export const DebtsGrid = () => {
  const { data } = useDebts();
  const debts = data?.ok ? data.result ?? [] : [];

  if (debts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay deudas registradas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {debts.map((debt) => (
        <DebtCard key={debt.id} {...debt} />
      ))}
    </div>
  );
};
