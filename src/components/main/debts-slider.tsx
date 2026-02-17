import { CreditCard } from "lucide-react";
import { DebtCard } from "../DebtCard";
import { SectionHeader } from "../SectionHeader";

const mockDebts = [
  { id: 1, name: "Tarjeta BBVA", totalDebt: 45000, remaining: 28500, dueDate: "15 Feb", minimumPayment: 3200, priority: "high" as const },
  { id: 2, name: "Préstamo Auto", totalDebt: 180000, remaining: 120000, dueDate: "28 Feb", minimumPayment: 5500, priority: "medium" as const },
];

export const DebtSlider = () => {
  return (
    <>
      <SectionHeader title="Deudas" subtitle="Mantén el control de tus pagos" icon={CreditCard} action={{ label: "Ver todas", path: "/debts" }} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDebts.map((debt) => (
          <DebtCard key={debt.id} name={debt.name} totalDebt={debt.totalDebt} remaining={debt.remaining} dueDate={debt.dueDate} minimumPayment={debt.minimumPayment} priority={debt.priority} />
        ))}
      </div>
    </>
  );
};
