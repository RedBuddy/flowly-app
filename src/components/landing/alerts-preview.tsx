"use client";
import { useGetAlerts, useMarkAlertAsRead } from "@/hooks/useAlert";
import { useAlertModalsStore } from "@/stores/alert-modals.store";
import { Alert } from "@/generated/prisma/client";
import { Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/helpers/date-formatter";

const alertTypeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  debt: { label: "Deuda", color: "text-red-600", bgColor: "bg-red-100" },
  budget: { label: "Presupuesto", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  goal: { label: "Meta", color: "text-blue-600", bgColor: "bg-blue-100" },
};

export function AlertsPreview() {
  const { switchAlertsModal } = useAlertModalsStore();
  const { data, isLoading } = useGetAlerts();
  const { mutateAsync: markAsRead } = useMarkAlertAsRead();

  const alerts: Alert[] = data?.ok ? data?.result || [] : [];
  const unreadAlerts = alerts.filter((a) => !a.isRead).slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (unreadAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Alertas Pendientes</h3>
          <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">{alerts.filter((a) => !a.isRead).length}</span>
        </div>
      </div>

      {unreadAlerts.map((alert: Alert) => {
        const typeConfig = alertTypeConfig[alert.type] || alertTypeConfig.goal;
        return (
          <div key={alert.id} className="group relative bg-card rounded-xl p-4 shadow-soft border border-border/50 hover:shadow-card transition-all duration-300 cursor-pointer" onClick={() => markAsRead(alert.id)}>
            <div className="flex items-start gap-3">
              <div className={`px-2 py-1 rounded-md text-xs font-semibold ${typeConfig.bgColor} ${typeConfig.color} flex-shrink-0`}>{typeConfig.label}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{formatDateTime(alert.createdAt)}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </div>
        );
      })}

      {unreadAlerts.length > 0 && (
        <Button onClick={() => switchAlertsModal(true)} variant="outline" className="w-full rounded-md">
          Ver todas las alertas {alerts.filter((a) => !a.isRead).length > 3 && `(${alerts.filter((a) => !a.isRead).length})`}
        </Button>
      )}
    </div>
  );
}
