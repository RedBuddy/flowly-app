import { createDebt, CreateDebtInput } from "@/actions/debts/create-debt";
import { deleteDebt } from "@/actions/debts/delete-debt";
import { getDebts } from "@/actions/debts/get-debts";
import { getLatestDebts } from "@/actions/debts/get-latest-debts";
import { deleteDebtPayment } from "@/actions/debts/delete-debt-payment";
import { updateDebtPayment } from "@/actions/debts/update-debt-payment";
import { getDebtPayments } from "@/actions/debts/get-debt-payments";
import { createDebtPayment, CreateDebtPaymentInput } from "@/actions/debts/create-debt-payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDebts = () => {
  return useQuery({
    queryKey: ["debts"],
    queryFn: () => getDebts(),
  });
};

export const useLatestDebts = (take: number = 4) => {
  return useQuery({
    queryKey: ["latestDebts"],
    queryFn: () => getLatestDebts(take),
  });
};

export const useCreateDebt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDebt,
    onSuccess: (response) => {
      if (!response.ok) return;

      queryClient.invalidateQueries({
        queryKey: ["debts"],
      });
    },
  });
};

export const useDeleteDebt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDebt,
    onSuccess: (response) => {
      if (!response.ok) return;
      queryClient.invalidateQueries({
        queryKey: ["debts"],
      });
    },
  });
};

export const useDebtPayments = (debtId: string) => {
  return useQuery({
    queryKey: ["debtPayments", debtId],
    queryFn: () => getDebtPayments(debtId),
    enabled: !!debtId,
  });
};

export const useCreateDebtPayment = (debtId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDebtPaymentInput) => createDebtPayment(data),
    onSuccess: (response) => {
      if (!response.ok) return;

      queryClient.setQueryData(["debtPayments", debtId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          result: [response.result, ...old.result],
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["debts"],
      });
    },
  });
};

export const useDeleteDebtPayment = (debtId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { paymentId: string; amount: number }) => deleteDebtPayment(debtId, data),
    onSuccess: (response, variables) => {
      if (!response.ok) return;

      queryClient.setQueryData(["debtPayments", debtId], (old: any) => {
        if (!old?.result) return old;
        return {
          ...old,
          result: old.result.filter((p: any) => p.id !== variables.paymentId),
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["debts"],
      });
    },
  });
};

export const useUpdateDebtPayment = (debtId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { paymentId: string; amount: number; description: string; oldAmount: number }) => updateDebtPayment(debtId, data),
    onSuccess: (response, variables) => {
      if (!response.ok) return;

      queryClient.setQueryData(["debtPayments", debtId], (old: any) => {
        if (!old?.result) return old;
        return {
          ...old,
          result: old.result.map((p: any) => (p.id === variables.paymentId ? { ...p, description: variables.description, amount: variables.amount } : p)),
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["debts"],
      });
    },
  });
};
