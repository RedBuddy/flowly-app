import { AppHeader } from "@/components/main/app-header";
import Index from "./(site)/Index";
import { HeroSection } from "@/components/main";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* contenido del dashboard */}
        <HeroSection />

        {/* <Index /> */}
      </main>
    </>
  );
}
