import { create } from "zustand";

type ModalProps = {
  goalId: string | null;
  name: string | null;
  isOpen: boolean;
};

type GoalHistoryModalProps = {
  goalId: string | null;
  goalName: string | null;
  isOpen: boolean;
};

type EditContributionModalProps = {
  goalId: string | null;
  contribution: {
    id: string;
    amount: number;
    description: string;
  } | null;
  isOpen: boolean;
};

type ModalState = {
  createGoal: ModalProps;
  history: GoalHistoryModalProps;
  editContribution: EditContributionModalProps;
  contribute: ModalProps;

  switchCreateGoalModal: (isOpen?: boolean) => void;
  switchHistoryModal: (goalId?: string, goalName?: string) => void;
  switchEditContributionModal: (goalId?: string, contribution?: any) => void;
  switchContributeModal: (goalId?: string, name?: string) => void;
};

export const useGoalModalsStore = create<ModalState>()((set) => ({
  createGoal: { goalId: null, name: null, isOpen: false },
  history: { goalId: null, goalName: null, isOpen: false },
  editContribution: { goalId: null, contribution: null, isOpen: false },
  contribute: { goalId: null, name: null, isOpen: false },

  switchCreateGoalModal: (isOpen = false) => {
    set({ createGoal: { goalId: null, name: null, isOpen } });
  },

  switchHistoryModal: (goalId?: string, goalName?: string) => {
    if (!goalId || !goalName) {
      set({ history: { goalId: null, goalName: null, isOpen: false } });
      return;
    }
    set({ history: { goalId, goalName, isOpen: true } });
  },

  switchEditContributionModal: (goalId?: string, contribution?: any) => {
    if (!goalId || !contribution) {
      set({ editContribution: { goalId: null, contribution: null, isOpen: false } });
      return;
    }
    set({ editContribution: { goalId, contribution, isOpen: true } });
  },

  switchContributeModal: (goalId?: string, name?: string) => {
    if (!goalId || !name) {
      set({ contribute: { goalId: null, name: null, isOpen: false } });
      return;
    }
    set({ contribute: { goalId, name, isOpen: true } });
  },
}));
