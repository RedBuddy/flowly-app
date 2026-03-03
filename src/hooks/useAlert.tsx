import { getAlertsAction } from "@/actions/alerts/get-alerts.action";
import { markAlertAsReadAction } from "@/actions/alerts/mark-alert-as-read.action";
import { deleteAlertAction } from "@/actions/alerts/delete-alert.action";
import { createAlertAction } from "@/actions/alerts/create-alert.action";
import { markAllAlertsAsReadAction } from "@/actions/alerts/mark-all-alerts-as-read.action";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useGetAlerts = () => {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => getAlertsAction(),
  });
};

export const useMarkAlertAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAlertAsReadAction,
    onSuccess: (res) => {
      if (!res.ok) return;
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlertAction,
    onSuccess: (res) => {
      if (!res.ok) return;
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { type: "debt" | "budget" | "goal"; title: string; message: string } }) => createAlertAction(userId, data),
    onSuccess: (res) => {
      if (!res.ok) return;
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

export const useMarkAllAlertsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAlertsAsReadAction,
    onSuccess: (res) => {
      if (!res.ok) return;
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};
