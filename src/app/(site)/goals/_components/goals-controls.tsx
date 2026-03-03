"use client";
import { GoalsSummary } from "./goals-summary";
import { CreateGoalModal } from "./modal/create-goal-modal";
import { ContributeGoalModal } from "./modal/contribute-goal-modal";
import { GoalHistoryModal } from "./modal/goal-history-modal";

export const GoalsControls = () => {
  return (
    <>
      <GoalsSummary />
      <CreateGoalModal />
      <ContributeGoalModal />
      <GoalHistoryModal />
    </>
  );
};
