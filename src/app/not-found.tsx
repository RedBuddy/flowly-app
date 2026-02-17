// import { usePathname } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  // const location = usePathname();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Página no encontrada</p>
        <Link href="/" className="rounded-md text-foreground hover:text-primary/90 cursor-pointer inline-flex items-center gap-1 bg-card px-2 py-1">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
