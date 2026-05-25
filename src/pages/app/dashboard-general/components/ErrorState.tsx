import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600">
      <AlertCircle className="w-10 h-10" />
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl font-black tracking-tight">Error de Conexión</h2>
      <p className="text-muted-foreground max-w-md">No pudimos obtener los datos del Google Sheet. Asegúrate de que el documento esté compartido.</p>
    </div>
    <Button onClick={onRetry} className="gap-2 px-8">
      <RefreshCw className="w-4 h-4" /> Reintentar
    </Button>
  </div>
);
