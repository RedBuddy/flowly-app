"use client";
import { useState } from "react";
import { BudgetFilters } from "./index";
import { RegisterBudgetModal } from "@/components/modal";

export const BudgetControls = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Filters */}
      <BudgetFilters setModalState={setModalOpen} />

      <RegisterBudgetModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
