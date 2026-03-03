import { create } from "zustand";

type AlertModalState = {
  isOpen: boolean;
  switchAlertsModal: (isOpen?: boolean) => void;
};

export const useAlertModalsStore = create<AlertModalState>((set) => ({
  isOpen: false,
  switchAlertsModal: (isOpen) => {
    set((state) => ({
      isOpen: isOpen ?? !state.isOpen,
    }));
  },
}));
