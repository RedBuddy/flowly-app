import { CreateIncomeAction } from "@/actions/incomes/create-income.action";
import { GetMonthlyIncomesAction } from "@/actions/incomes/get-monthly-incomes.action";
import { GetIncomeSummaryAction } from "@/actions/incomes/get-income-summary.action";
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
