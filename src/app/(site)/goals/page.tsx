import { Target } from "lucide-react";
import { CustomHeader } from "@/components/shared/custom-header";
import { GoalsControls } from "./_components/goals-controls";
import { GoalsGrid } from "./_components/goals-grid";

export default function Goals() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <CustomHeader title="Metas de ahorro" icon={<Target className="w-6 h-6 text-primary" />} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <GoalsControls />
        <GoalsGrid />
      </main>
    </div>
  );
}
