import { create } from 'zustand';

interface IncomeModalsState {
  history: {
    isOpen: boolean;
  };
  switchHistoryModal: (isOpen: boolean) => void;
}

export const useIncomeModalsStore = create<IncomeModalsState>((set) => ({
  history: {
    isOpen: false,
  },
  switchHistoryModal: (isOpen: boolean) =>
    set(() => ({
      history: {
        isOpen,
      },
    })),
}));
