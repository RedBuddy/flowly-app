"use client";
import { CustomLoading } from "@/components/shared/custom-loading";
import { GoalCard } from "./goal-card";
import { useGoals } from "@/hooks/useGoal";

export const GoalsGrid = () => {
  const { data, isLoading } = useGoals();
  const goals = data?.ok ? data.result ?? [] : [];

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <>
      {goals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay metas para mostrar</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} {...goal} />
          ))}
        </div>
      )}
    </>
  );
};
