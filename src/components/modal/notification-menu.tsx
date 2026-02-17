import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertCard } from "@/components/AlertCard";
import { SectionHeader } from "@/components/SectionHeader";

const mockAlerts = [
  { type: "debt" as const, title: "Pago próximo", message: "Tarjeta BBVA vence en 10 días", actionLabel: "Ver" },
  { type: "budget" as const, title: "Presupuesto bajo", message: "Alimentación al 75% del límite", actionLabel: "Revisar" },
];

export const NotificationMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative p-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
          <Bell className="w-10 h-10 text-muted-foreground" />
          {mockAlerts.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto">
        {/* <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}

        {mockAlerts.length > 0 ? (
          <div className="p-2">
            <SectionHeader title="Alertas" subtitle="Requieren tu atención" icon={Bell} />
            <div className="space-y-3 mt-3">
              {mockAlerts.map((alert, index) => (
                <AlertCard key={index} type={alert.type} title={alert.title} message={alert.message} actionLabel={alert.actionLabel} />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No hay notificaciones</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
