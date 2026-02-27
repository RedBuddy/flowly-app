import { CreateIncomeAction } from "@/actions/incomes/create-income.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateIncomeAction,
    onSuccess: (res) => {
      if (!res.ok) return;

      queryClient.invalidateQueries({ queryKey: ["balanceSummary"] });
    },
  });
};
