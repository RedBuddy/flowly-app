"use client";
import { useState } from "react";
import { BudgetFilters } from "./index";
import { RegisterBudgetModal } from "./modal/index";
import { BudgetAssignModal, BudgetSpendModal, BudgetTransactionHistory } from "./modal";

export const BudgetControls = () => {
  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <>
      <BudgetFilters setModalState={setCreateOpen} />

      <RegisterBudgetModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} />

      <BudgetSpendModal />
      <BudgetAssignModal />
      <BudgetTransactionHistory />
    </>
  );
};
