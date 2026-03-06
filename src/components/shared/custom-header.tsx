import { ArrowLeft, PiggyBank } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  icon: React.ReactNode;
}

export const CustomHeader = ({ title, icon }: Props) => {
  return (
    <header className="top-0 z-40 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">{icon}</div>
            <span className="text-xl font-bold text-foreground font-display">{title}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
