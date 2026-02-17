import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    path: string;
  };
}

export function SectionHeader({ title, subtitle, icon: Icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn("p-2 rounded-xl bg-accent text-accent-foreground")}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <Link href={action.path ?? "/"} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {action.label}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
