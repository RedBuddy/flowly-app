import { AppHeader } from "@/components/landing/app-header";
import { BudgetSlider, HeroSection } from "@/components/landing";
import { DebtSlider } from "@/components/landing/debts-slider";
import { ModalAutoCloser } from "@/components/modal/modal-auto-closer";
import { GoalSlider } from "@/components/landing/goals-slider";
import { AlertsPreview } from "@/components/landing/alerts-preview";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* contenido del dashboard */}
        <HeroSection />
        {/* <AlertsPreview /> */}
        <BudgetSlider />
        <GoalSlider />
        <DebtSlider />
        {/* Helper */}
        <ModalAutoCloser />
      </main>
    </>
  );
}
