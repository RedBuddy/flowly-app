import { create } from "zustand";

type ModalProps = {
  budgetId: string | null;
  name: string | null;
  isOpen: boolean;
}

type EditTransactionModalProps = {
  budgetId: string | null;
  transaction: {
    id: string;
    type: "expense" | "assignment";
    amount: number;
    description: string;
  } | null;
  isOpen: boolean;
}

type ModalState = {
  spend: ModalProps,
  assign: ModalProps,
  history: ModalProps,
  editTransaction: EditTransactionModalProps,

  switchSpendModal: (budgetId?: string, name?: string) => void;
  switchAssignModal: (budgetId?: string, name?: string) => void;
  switchHistoryModal: (budgetId?: string, name?: string) => void;
  switchEditTransactionModal: (budgetId?: string, transaction?: any) => void;
}

export const useBudgetModalsStore = create<ModalState>()((set) => ({

  spend: { budgetId: null, name: null, isOpen: false },
  assign: { budgetId: null, name: null, isOpen: false },
  history: { budgetId: null, name: null, isOpen: false },
  editTransaction: { budgetId: null, transaction: null, isOpen: false },

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

  switchEditTransactionModal: (budgetId?: string, transaction?: any) => {
    if (!budgetId || !transaction) {
      set({ editTransaction: { budgetId: null, transaction: null, isOpen: false } })
      return
    };
    set({ editTransaction: { budgetId, transaction, isOpen: true } })
  },

}));