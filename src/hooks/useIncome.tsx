import { CreateIncomeAction } from "@/actions/incomes/create-income.action";
import { GetMonthlyIncomesAction } from "@/actions/incomes/get-monthly-incomes.action";
import { GetIncomeSummaryAction } from "@/actions/incomes/get-income-summary.action";
import { deleteIncomeAction } from "@/actions/incomes/delete-income.action";
import { updateIncomeAction } from "@/actions/incomes/update-income.action";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateIncomeAction,
    onSuccess: (res) => {
      if (!res.ok) return;

      queryClient.invalidateQueries({ queryKey: ["monthlyIncomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomeSummary"] });
    },
  });
};

export const useGetMonthlyIncomes = (year?: number, month?: number) => {
  return useQuery({
    queryKey: ["monthlyIncomes", year, month],
    queryFn: () => GetMonthlyIncomesAction(year, month),
  });
};

export const useGetIncomeSummary = () => {
  return useQuery({
    queryKey: ["incomeSummary"],
    queryFn: () => GetIncomeSummaryAction(),
  });
};

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncomeAction,
    onSuccess: (res) => {
      if (!res.ok) return;

      queryClient.invalidateQueries({ queryKey: ["monthlyIncomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomeSummary"] });
    },
  });
};

export const useUpdateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ incomeId, data }: { incomeId: string; data: { amount: number; description: string; date?: string } }) => updateIncomeAction(incomeId, data),
    onSuccess: (res) => {
      if (!res.ok) return;

      queryClient.invalidateQueries({ queryKey: ["monthlyIncomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomeSummary"] });
    },
  });
};
