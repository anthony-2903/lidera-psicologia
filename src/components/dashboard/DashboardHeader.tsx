
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw, LayoutDashboard, Users, LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  title: React.ReactNode;
  subtitle: string;
  isFetching?: boolean;
  onRefresh: () => void;
  view?: string;
  onViewChange?: (view: any) => void;
  stats?: { label: string; value: string | number; icon: LucideIcon };
  className?: string;
  tabs?: { id: string; label: string; icon: LucideIcon; activeColor?: string }[];
}

/**
 * Premium Hero Header for dashboards with action buttons and stats
 */
export const DashboardHeader = ({ 
  title, 
  subtitle, 
  isFetching, 
  onRefresh, 
  view, 
  onViewChange, 
  stats, 
  className,
  tabs
}: DashboardHeaderProps) => (
  <div className={cn("relative overflow-hidden rounded-3xl bg-card border border-border/40 shadow-xl p-6 md:p-8 group", className)}>
    {/* Animated background element */}
    <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[180px] -translate-y-1/3 translate-x-1/3 animate-slow-pan pointer-events-none group-hover:bg-primary/15 transition-colors duration-1000"></div>
    
    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base font-medium leading-relaxed max-w-xl">
          {subtitle}
        </p>
      </div>
      
      <div className="flex flex-col items-start lg:items-end gap-4">
        {/* Navigation Tabs/Switcher */}
        {onViewChange && tabs && (
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-background/50 backdrop-blur-3xl rounded-2xl border border-border/40 shadow-xl">
            {tabs.map((tab) => (
              <Button 
                key={tab.id}
                onClick={() => onViewChange(tab.id)} 
                variant={view === tab.id ? 'default' : 'ghost'}
                className={cn(
                  "gap-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all h-10 px-6", 
                  view === tab.id ? "shadow-2xl shadow-primary/30" : "text-muted-foreground/60 hover:text-foreground"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </Button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Action */}
          <Button variant="outline" onClick={onRefresh} className="gap-2.5 rounded-xl text-[9px] h-11 px-5 border-border/40 bg-background/40 backdrop-blur-2xl shadow-lg uppercase font-black tracking-widest hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95 group">
            <RefreshCw className={cn("w-4 h-4 group-hover:rotate-180 transition-transform duration-700", isFetching ? "animate-spin text-primary" : "")} /> Sync Repo
          </Button>
          
          {/* High-level Stat */}
          {stats && (
            <div className="bg-foreground text-background px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 group/stat transition-transform duration-500">
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50 mb-0.5">{stats.label}</p>
                <p className="text-2xl font-black tabular-nums leading-none tracking-tight">{stats.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-background/15 flex items-center justify-center text-background shadow-inner">
                <stats.icon className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
