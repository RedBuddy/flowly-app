"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { BUDGET_TYPES, BUDGET_TYPE_LABELS } from "@/schemas/prisma";

interface Props {
  setModalState: (isOpen: boolean) => void;
}

export const BudgetFilters = ({ setModalState }: Props) => {
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "all" });

  const filterOptions = [
    { value: "all", label: "Todos" },
    { value: BUDGET_TYPES.RECURRENT, label: BUDGET_TYPE_LABELS[BUDGET_TYPES.RECURRENT] },
    { value: BUDGET_TYPES.OCCASIONAL, label: BUDGET_TYPE_LABELS[BUDGET_TYPES.OCCASIONAL] },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mx-4">
      <div className="flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as typeof filter)}
            className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <Button className="rounded-md" onClick={() => setModalState(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Nuevo presupuesto
      </Button>
    </div>
  );
};
