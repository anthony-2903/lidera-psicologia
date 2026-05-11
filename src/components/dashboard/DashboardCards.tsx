
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface KpiCardProps {
  label: string;
  value: string | number | undefined;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  description?: string;
  info?: string;
  glowColor?: string;
  className?: string;
}

/**
 * Premium KPI Card with icon and animations
 */
export const KpiCard = ({ label, value, icon: Icon, color, bg, border, description, info, glowColor, className }: KpiCardProps) => (
  <TooltipProvider>
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Card className={cn(
          "border-2 bg-card/60 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500", 
          border, 
          glowColor && `hover:shadow-${glowColor}`, 
          className
        )}>
          <CardContent className="p-6 flex items-center gap-4 relative">
            {info && (
              <div className="absolute top-2 right-2 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info className="w-3 h-3" />
              </div>
            )}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-1000">
               <Icon className="w-16 h-16" />
            </div>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-12 transition-transform duration-500", bg, color)}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-0.5">{label}</p>
              <p className={cn("text-xl font-black tabular-nums leading-none tracking-tighter", color)}>{value}</p>
              {description && (
                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-2">{description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      {info && (
        <TooltipContent className="max-w-[200px] text-[10px] font-medium leading-relaxed bg-slate-900 text-white border-slate-800 rounded-xl p-3 shadow-2xl">
          {info}
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string; // e.g. "from-primary/10"
  hoverEffect?: boolean;
}

/**
 * Base glassmorphism container for dashboards
 */
export const GlassCard = ({ children, className, gradient, hoverEffect = true }: GlassCardProps) => (
  <Card className={cn(
    "border-2 border-border/40 bg-white/40 backdrop-blur-2xl shadow-3xl overflow-hidden relative transition-all duration-1000",
    hoverEffect && "hover:border-primary/20",
    className
  )}>
    {gradient && (
      <div className={cn("absolute inset-0 bg-gradient-to-br via-transparent to-transparent pointer-events-none opacity-40", gradient)}></div>
    )}
    {children}
  </Card>
);
