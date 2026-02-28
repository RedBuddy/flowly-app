"use client";
import { useState } from "react";
import { GoalsSummary } from "./goals-summary";
import { RegisterGoalModal } from "./modal/register-goal-modal";

export const GoalsControls = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <GoalsSummary setModalState={setIsModalOpen} />

      <RegisterGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
