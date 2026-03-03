"use client";
import { Target } from "lucide-react";
import { GoalCard } from "../../app/(site)/goals/_components/goal-card";
import { SectionHeader } from "../SectionHeader";
import { useLatestGoals } from "@/hooks/useGoal";
import { SkeletonCard } from "../skeletons/skeleton-card";
import { CreateGoalModal } from "@/app/(site)/goals/_components/modal/create-goal-modal";
import { ContributeGoalModal } from "@/app/(site)/goals/_components/modal/contribute-goal-modal";
import { GoalHistoryModal } from "@/app/(site)/goals/_components/modal/goal-history-modal";

export const GoalSlider = () => {
  const { data, isLoading } = useLatestGoals(3);

  const goalList = data?.ok ? data.result : [];

  return (
    <>
      <SectionHeader title="Metas de ahorro" subtitle="Tus proyectos financieros" icon={Target} action={{ label: "Ver todas", path: "/goals" }} />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-65">
          <SkeletonCard count={3} />
        </div>
      ) : !goalList || goalList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay metas para mostrar</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goalList.map((goal) => (
            <GoalCard key={goal.id} {...goal} />
          ))}
        </div>
      )}

      <CreateGoalModal />
      <ContributeGoalModal />
      <GoalHistoryModal />
    </>
  );
};
