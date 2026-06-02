import { AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DpmsRauraLoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
    <div className="relative">
      <div className="w-24 h-24 rounded-[2.5rem] bg-card border border-border/40 flex items-center justify-center shadow-2xl animate-float">
        <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
      </div>
    </div>
    <div className="space-y-4 relative z-10">
      <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary/30 underline-offset-8">
        DPMS Network
      </h2>
      <p className="text-muted-foreground font-black uppercase tracking-[0.5em] text-[11px] animate-pulse">
        Analizando Madurez de Seguridad...
      </p>
    </div>
  </div>
);

export const DpmsRauraErrorState = ({
  isFetching,
  onRefetch,
}: {
  isFetching: boolean;
  onRefetch: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
    <div className="w-28 h-28 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-2xl border border-red-500/20">
      <AlertCircle className="w-14 h-14" />
    </div>
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tighter">
        Sync Interrumpido
      </h2>
      <p className="text-muted-foreground max-w-md font-medium text-lg italic">
        El repositorio de datos DPMS-Raura no respondio al llamado.
      </p>
    </div>
    <Button
      onClick={onRefetch}
      className="gap-3 px-10 h-16 rounded-2xl text-base font-black shadow-2xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95"
    >
      <RefreshCw className={cn("w-5 h-5", isFetching && "animate-spin")} />{" "}
      Reconectar Canales
    </Button>
  </div>
);
