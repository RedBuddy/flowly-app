"use client";
import { useDebtModalsStore } from "@/stores/debt-modals.store";
import { DebtsSummary } from "./debts-summary";
import { CreateDebtModal } from "./modal/create-debt-modal";
import { PayDebtModal } from "./modal/pay-debt-modal";
import { DebtHistoryModal } from "./modal/debt-history-modal";

export const DebtsControls = () => {
  return (
    <>
      <DebtsSummary />
      <CreateDebtModal />
      <PayDebtModal />
      <DebtHistoryModal />
    </>
  );
};
