import { BarChart3, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GroupMetric } from "@/lib/sheets-adapter";

interface GroupBreakdownProps {
  groupMetrics: GroupMetric[];
  onGroupClick: (group: GroupMetric) => void;
}

export const GroupBreakdown = ({ groupMetrics, onGroupClick }: GroupBreakdownProps) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <BarChart3 className="w-4 h-4 md:w-5 h-5" />
      </div>
      <h2 className="text-base md:text-xl font-black uppercase tracking-tight">Desglose por Empresa</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      {groupMetrics.map((group) => {
        const completionRate = Math.round((group.completed / group.total) * 100);

        return (
          <Card
            key={group.id}
            onClick={() => onGroupClick(group)}
            className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-500 cursor-pointer group/card active:scale-[0.98]"
          >
            <div className="h-1 w-full" style={{ backgroundColor: `${group.color}20` }}>
              <div className="h-full transition-all duration-1000" style={{ width: `${completionRate}%`, backgroundColor: group.color }} />
            </div>
            <CardHeader className="flex flex-row items-start justify-between pb-2 px-4 md:px-6">
              <div className="space-y-0.5">
                <CardTitle className="text-xl md:text-2xl font-black tracking-tight group-hover/card:text-primary transition-colors">{group.name}</CardTitle>
                <CardDescription className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  {group.total} Participantes • <Info className="w-3 h-3 text-primary/40" /> Detalles
                </CardDescription>
              </div>
              <Badge variant="outline" className="px-2 py-0.5 font-black text-sm md:text-base border-primary/20 text-primary bg-primary/5">
                {completionRate}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-8 pt-2 md:pt-4 px-4 md:px-6 pb-4 md:pb-6">
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className="p-2 md:p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-0.5 whitespace-nowrap">Listos</div>
                  <div className="text-base md:text-xl font-black text-emerald-700">{group.completed}</div>
                </div>
                <div className="p-2 md:p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-amber-600 mb-0.5 whitespace-nowrap">Curso</div>
                  <div className="text-base md:text-xl font-black text-amber-700">{group.inProgress}</div>
                </div>
                <div className="p-2 md:p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-red-600 mb-0.5 whitespace-nowrap">Falta</div>
                  <div className="text-base md:text-xl font-black text-red-700">{group.pending}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);
