import { create } from "zustand";

type ModalProps = {
  budgetId: string | null;
  name: string | null;
  isOpen: boolean;
}

type ModalState = {
  spend: ModalProps,
  assign: ModalProps,
  history: ModalProps,

  switchSpendModal: (budgetId?: string, name?: string) => void;
  switchAssignModal: (budgetId?: string, name?: string) => void;
  switchHistoryModal: (budgetId?: string, name?: string) => void;
}

export const useBudgetModalsStore = create<ModalState>()((set) => ({

  spend: { budgetId: null, name: null, isOpen: false },
  assign: { budgetId: null, name: null, isOpen: false },
  history: { budgetId: null, name: null, isOpen: false },

  switchSpendModal: (budgetId?: string, name?: string) => {
    if (!budgetId || !name) {
      set({ spend: { budgetId: null, name: null, isOpen: false } })
      return
    };
    set({ spend: { budgetId, name, isOpen: true } })
  },

  switchAssignModal: (budgetId?: string, name?: string) => {
    if (!budgetId || !name) {
      set({ assign: { budgetId: null, name: null, isOpen: false } })
      return
    };
    set({ assign: { budgetId, name, isOpen: true } })
  },

  switchHistoryModal: (budgetId?: string, name?: string) => {
    if (!budgetId || !name) {
      set({ history: { budgetId: null, name: null, isOpen: false } })
      return
    };
    set({ history: { budgetId, name, isOpen: true } })
  },

}));