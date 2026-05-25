import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardHeaderSectionProps {
  isFetching: boolean;
  onRefresh: () => void;
}

export const DashboardHeaderSection = ({ isFetching, onRefresh }: DashboardHeaderSectionProps) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div className="space-y-1">
      <h1 className="text-xl sm:text-4xl font-black tracking-tighter text-foreground leading-none">Dashboard General</h1>
      <p className="text-muted-foreground text-xs md:text-lg font-medium">Análisis de desempeño agrupado</p>
    </div>
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2 rounded-xl text-[10px] md:text-xs h-8 md:h-10">
        <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} /> Sincronizar
      </Button>
      <div className="hidden sm:flex items-center gap-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-xl">
        <Calendar className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Sync</span>
      </div>
    </div>
  </div>
);
