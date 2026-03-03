"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAlerts } from "@/hooks/useAlert";
import { useAlertModalsStore } from "@/stores/alert-modals.store";

export const NotificationMenu = () => {
  const { switchAlertsModal } = useAlertModalsStore();
  const { data } = useGetAlerts();

  const alerts = data?.ok ? data?.result ?? [] : [];
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <Button variant="ghost" size="icon" className="relative p-3 rounded-md hover:bg-accent transition-colors cursor-pointer" onClick={() => switchAlertsModal(true)}>
      <Bell className="w-5 h-5 text-muted-foreground" />
      {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadCount > 9 ? "9+" : unreadCount}</span>}
    </Button>
  );
};
