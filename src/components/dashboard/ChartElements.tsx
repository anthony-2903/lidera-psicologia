
import { cn } from "@/lib/utils";

/**
 * Premium Tooltip for Recharts dashboards
 */
export const ChartTooltip = ({ active, payload, label, isPie = false }: any) => {
  if (active && payload && payload.length) {
    const data = isPie ? payload[0].payload : null;
    return (
      <div className="bg-background/95 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-2xl animate-in fade-in zoom-in-95 duration-300 z-50 ring-1 ring-black/5 min-w-[180px] max-w-[280px]">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3 border-b border-border/20 pb-2">
          {isPie ? data?.name : (label || 'Detalle')}
        </p>
        
        {isPie ? (
          <div className="space-y-3">
            {data?.desc && (
              <p className="text-[11px] font-bold text-muted-foreground leading-relaxed italic">"{data.desc}"</p>
            )}
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black uppercase text-muted-foreground/60">Frecuencia / Valor:</span>
               <span className="text-lg font-black text-foreground">{payload[0].value}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{entry.name}:</span>
                </div>
                <span className="text-[10px] font-black text-foreground tabular-nums">{entry.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

/**
 * Horizontal premium legend for charts
 */
export const ChartLegend = ({ payload }: any) => {
  if (!payload) return null;
  return (
    <ul className="flex flex-wrap justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/80 hover:text-foreground transition-all duration-300 cursor-default group">
          <span className="w-2.5 h-2.5 rounded-full mr-2.5 shadow-sm group-hover:scale-125 transition-transform" style={{ backgroundColor: entry.color }}></span>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};
