"use client";
import { useBudgetModalsStore } from "@/stores/budget-modals.store";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const ModalAutoCloser = () => {
  const { switchAssignModal, switchHistoryModal, switchSpendModal } = useBudgetModalsStore();
  const path = usePathname();

  useEffect(() => {
    switchAssignModal();
    switchHistoryModal();
    switchSpendModal();
  }, [path]);

  return null;
};
