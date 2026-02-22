import { Loader2 } from "lucide-react";

export const CustomLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-96">
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-primary spinner" />
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
};
