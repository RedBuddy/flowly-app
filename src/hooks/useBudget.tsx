import { createBudgetTransaction } from "@/actions/budgets/create-budget-transaction";
import { CreateBudgetAction } from "@/actions/budgets/create-budget.action";
import { deleteBudget } from "@/actions/budgets/delete-budget";
import { getBudgetTransactions } from "@/actions/budgets/get-budget-transactions";
import { getBudgets } from "@/actions/budgets/get-budgets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

export const useBudgets = () => {
  const [page] = useQueryState("page", { defaultValue: "1" });
  const [filter] = useQueryState("filter", { defaultValue: "all" });

  return useQuery({
    queryKey: ["budgets", page, filter],
    queryFn: () => getBudgets({ take: 8, page: +page, filter: filter as any }),
    // staleTime: 1000 * 60 * 30, // Cada 30 minutos
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateBudgetAction,
    onSuccess: (response) => {
      if (!response.ok) return;

      queryClient.invalidateQueries({
        queryKey: ["budgets"],
        // refetchType: "all", // Fuerza refetch incluso si está en staleTime
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
