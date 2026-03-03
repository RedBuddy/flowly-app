"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAlertModalsStore } from "@/stores/alert-modals.store";
import { useGetAlerts, useMarkAlertAsRead, useDeleteAlert } from "@/hooks/useAlert";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/generated/prisma/client";
import { Clock, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/helpers/date-formatter";

const alertTypeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  debt: { label: "Deuda", color: "text-red-600", bgColor: "bg-red-100" },
  budget: { label: "Presupuesto", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  goal: { label: "Meta", color: "text-blue-600", bgColor: "bg-blue-100" },
};

export function AlertsModal() {
  const { isOpen, switchAlertsModal } = useAlertModalsStore();
  const { data, isLoading } = useGetAlerts();
  const { mutateAsync: markAsRead, isPending: isMarkingAsRead } = useMarkAlertAsRead();
  const { mutateAsync: deleteAlert, isPending: isDeletingAlert } = useDeleteAlert();

  const alerts: Alert[] = data?.ok ? data?.result || [] : [];
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const handleMarkAsRead = async (alert: Alert) => {
    try {
      const response = await markAsRead(alert.id);
      if (response.ok) {
        toast.success("Alerta marcada como leída");
      }
    } catch (error) {
      toast.error("Error al marcar la alerta");
    }
  };

  const handleDeleteAlert = async (alert: Alert) => {
    try {
      const response = await deleteAlert(alert.id);
      if (response.ok) {
        toast.success("Alerta eliminada");
      }
    } catch (error) {
      toast.error("Error al eliminar la alerta");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => switchAlertsModal()}>
      <DialogContent className="rounded-2xl max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Alertas {unreadCount > 0 && <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">{unreadCount}</span>}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">No hay alertas</div>
          ) : (
            alerts.map((alert: Alert) => {
              const typeConfig = alertTypeConfig[alert.type] || alertTypeConfig.goal;
              return (
                <div key={alert.id} className={`p-3 rounded-xl border transition-colors ${alert.isRead ? "bg-muted/30 border-border/50" : "bg-primary/5 border-primary/30"} hover:bg-muted/50`}>
                  <div className="flex items-start gap-3">
                    <div className={`px-2 py-1 rounded-md text-xs font-semibold ${typeConfig.bgColor} ${typeConfig.color} flex-shrink-0 mt-0.5`}>{typeConfig.label}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">{formatDateTime(alert.createdAt)}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {!alert.isRead && (
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-primary/20" onClick={() => handleMarkAsRead(alert)} disabled={isMarkingAsRead || isDeletingAlert}>
                          <Check className="w-4 h-4 text-primary" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-destructive/20" onClick={() => handleDeleteAlert(alert)} disabled={isDeletingAlert || isMarkingAsRead}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button onClick={() => switchAlertsModal(false)} size="sm" variant="outline" className="w-full font-semibold text-sm rounded-md">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
