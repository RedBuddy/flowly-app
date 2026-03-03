import { create } from "zustand";

type ModalProps = {
  debtId: string | null;
  name: string | null;
  isOpen: boolean;
};

type DebtHistoryModalProps = {
  debtId: string | null;
  debtName: string | null;
  isOpen: boolean;
};

type EditPaymentModalProps = {
  debtId: string | null;
  payment: {
    id: string;
    amount: number;
    description: string;
  } | null;
  isOpen: boolean;
};

type ModalState = {
  createDebt: ModalProps;
  history: DebtHistoryModalProps;
  editPayment: EditPaymentModalProps;
  pay: ModalProps;

  switchCreateDebtModal: (isOpen?: boolean) => void;
  switchHistoryModal: (debtId?: string, debtName?: string) => void;
  switchEditPaymentModal: (debtId?: string, payment?: any) => void;
  switchPayModal: (debtId?: string, name?: string) => void;
};

export const useDebtModalsStore = create<ModalState>()((set) => ({
  createDebt: { debtId: null, name: null, isOpen: false },
  history: { debtId: null, debtName: null, isOpen: false },
  editPayment: { debtId: null, payment: null, isOpen: false },
  pay: { debtId: null, name: null, isOpen: false },

  switchCreateDebtModal: (isOpen = false) => {
    set({ createDebt: { debtId: null, name: null, isOpen } });
  },

  switchHistoryModal: (debtId?: string, debtName?: string) => {
    if (!debtId || !debtName) {
      set({ history: { debtId: null, debtName: null, isOpen: false } });
      return;
    }
    set({ history: { debtId, debtName, isOpen: true } });
  },

  switchEditPaymentModal: (debtId?: string, payment?: any) => {
    if (!debtId || !payment) {
      set({ editPayment: { debtId: null, payment: null, isOpen: false } });
      return;
    }
    set({ editPayment: { debtId, payment, isOpen: true } });
  },

  switchPayModal: (debtId?: string, name?: string) => {
    if (!debtId || !name) {
      set({ pay: { debtId: null, name: null, isOpen: false } });
      return;
    }
    set({ pay: { debtId, name, isOpen: true } });
  },
}));
