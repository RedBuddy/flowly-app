import { createGoal, CreateGoalInput } from "@/actions/goals/create-goal";
import { deleteGoal } from "@/actions/goals/delete-goal";
import { deleteGoalContribution } from "@/actions/goals/delete-goal-contribution";
import { updateGoalContribution } from "@/actions/goals/update-goal-contribution";
import { getGoals } from "@/actions/goals/get-goals";
import { getLatestGoals } from "@/actions/goals/get-latest-goals";
import { getGoalContributions } from "@/actions/goals/get-goal-contributions";
import { createGoalContribution, CreateGoalContributionInput } from "@/actions/goals/create-goal-contribution";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGoals = () => {
  return useQuery({
    queryKey: ["goals"],
    queryFn: () => getGoals(),
  });
};

export const useLatestGoals = (take: number = 3) => {
  return useQuery({
    queryKey: ["latestGoals"],
    queryFn: () => getLatestGoals(take),
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoal,
    onSuccess: (response) => {
      if (!response.ok) return;

      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: (response) => {
      if (!response.ok) return;
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
    },
  });
};

export const useGoalContributions = (goalId: string) => {
  return useQuery({
    queryKey: ["goalContributions", goalId],
    queryFn: () => getGoalContributions(goalId),
    enabled: !!goalId,
  });
};

export const useCreateGoalContribution = (goalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalContributionInput) => createGoalContribution(data),
    onSuccess: (response) => {
      if (!response.ok) return;

      queryClient.setQueryData(["goalContributions", goalId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: [response.result, ...old.result],
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
    },
  });
};

export const useDeleteGoalContribution = (goalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { contributionId: string; amount: number }) => deleteGoalContribution(goalId, data),
    onSuccess: (response, variables) => {
      if (!response.ok) return;

      queryClient.setQueryData(["goalContributions", goalId], (old: any) => {
        if (!old?.result) return old;
        return {
          ...old,
          result: old.result.filter((c: any) => c.id !== variables.contributionId),
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
    },
  });
};

export const useUpdateGoalContribution = (goalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { contributionId: string; amountDifference: number; newAmount: number; description: string }) => updateGoalContribution(goalId, data),
    onSuccess: (response, variables) => {
      if (!response.ok) return;

      queryClient.setQueryData(["goalContributions", goalId], (old: any) => {
        if (!old?.result) return old;
        return {
          ...old,
          result: old.result.map((c: any) => (c.id === variables.contributionId ? { ...c, description: variables.description, amount: variables.newAmount } : c)),
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
    },
  });
};
