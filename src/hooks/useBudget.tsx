import { createBudgetTransaction } from "@/actions/budgets/create-budget-transaction";
import { CreateBudget } from "@/actions/budgets/create-budget";
import { deleteBudget } from "@/actions/budgets/delete-budget";
import { deleteBudgetTransaction } from "@/actions/budgets/delete-budget-transaction";
import { getBudgetTransactions } from "@/actions/budgets/get-budget-transactions";
import { getBudgets } from "@/actions/budgets/get-budgets";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { getLatestBudgets } from "@/actions/budgets/get-latest-budgets";

export const useBudgets = (take: number = 8) => {
  const [page] = useQueryState("page", { defaultValue: "1" });
  const [filter] = useQueryState("filter", { defaultValue: "all" });

  return useQuery({
    queryKey: ["budgets", { page, filter, take }],
    queryFn: () => getBudgets({ take, page: +page, filter: filter as any }),
    // staleTime: 1000 * 60 * 30, // Cada 30 minutos
  });
};

export const useLatestBudgets = (take: number = 4) => {
  return useQuery({
    queryKey: ["latestBudgets"],
    queryFn: () => getLatestBudgets(take),
    // placeholderData: keepPreviousData,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateBudget,
    onSuccess: (response) => {
      if (!response.ok) return;

      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["latestBudgets"],
      });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: (response) => {
      if (!response.ok) return;
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["latestBudgets"],
      });
    },
  });
};

export const useCreateBudgetTransaction = (budgetId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudgetTransaction,
    onSuccess: (response) => {
      if (!response.ok) return;

      // Actualizar cache con la data que devolvió el servidor
      queryClient.setQueryData(["budgetTransactions", budgetId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: [response.result, ...old.result],
        };
      });

      // Invalidar la query de presupuestos para actualizar los totales:
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["latestBudgets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["balanceSummary"],
      });
    },
  });
};

export const useBudgetTransactions = (budgetId: string) => {
  return useQuery({
    queryKey: ["budgetTransactions", budgetId],
    queryFn: () => getBudgetTransactions(budgetId),
    enabled: !!budgetId, // Solo ejecuta si budgetId es válido
  });
};

export const useDeleteBudgetTransaction = (budgetId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { transactionId: string; type: string; amount: number }) => deleteBudgetTransaction(budgetId, data),
    onSuccess: (response, variables) => {
      if (!response.ok) return;

      // Elimina la transacción del cache
      queryClient.setQueryData(["budgetTransactions", budgetId], (old: any) => {
        if (!old?.result) return old;
        return {
          ...old,
          result: old.result.filter((t: any) => t.id !== variables.transactionId),
        };
      });

      // Invalidar la query de presupuestos para actualizar los totales
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["latestBudgets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["balanceSummary"],
      });
    },
  });
};
