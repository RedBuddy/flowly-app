import { AppHeader } from "@/components/main/app-header";
import { BudgetSlider, HeroSection, ProjectSlider } from "@/components/main";
import { DebtSlider } from "@/components/main/debts-slider";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* contenido del dashboard */}
        <HeroSection />
        <BudgetSlider />
        <ProjectSlider />
        <DebtSlider />
        {/* <Index /> */}
      </main>
    </>
  );
}
