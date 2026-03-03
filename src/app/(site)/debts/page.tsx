"use client";

import { CreditCard } from "lucide-react";
import { CustomHeader } from "@/components/shared/custom-header";
import { DebtsControls } from "./_components/debts-controls";
import { DebtsGrid } from "./_components/debts-grid";

export default function Debts() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <CustomHeader title="Deudas" icon={<CreditCard className="w-6 h-6 text-primary" />} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <DebtsControls />
        <DebtsGrid />
      </main>
    </div>
  );
}
