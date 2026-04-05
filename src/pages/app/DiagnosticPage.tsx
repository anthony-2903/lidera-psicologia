import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSheetData, GroupMetric } from "@/lib/sheets-adapter";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, RefreshCw, AlertCircle, ClipboardCheck, Users, Activity,
  BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const SHEET_ID = "1abuYNzrdEH_6YCzlq31SAA9zLrbov0kt03gWNQPKUeU";

const COLORS_STATUS = {
  completo: "hsl(142, 71%, 45%)", // Green
  proceso: "hsl(38, 92%, 50%)",  // Amber
  falta: "hsl(10, 81%, 59%)",    // Red
  realizado: "hsl(212, 52%, 25%)", // Deep Blue
};

const DiagnosticPage = () => {
  const { data: groupMetrics = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['sheetData', SHEET_ID],
    queryFn: () => fetchSheetData(SHEET_ID),
  });

  const globalStats = useMemo(() => {
    const stats = {
      total: 0,
      psychology: { completo: 0, proceso: 0, falta: 0 },
      interview: { realizado: 0, falta: 0 },
      status: { completo: 0, proceso: 0, falta: 0 }
    };

    groupMetrics.forEach(g => {
      stats.total += g.total;
      stats.psychology.completo += g.psychologyStats.completo;
      stats.psychology.proceso += g.psychologyStats.proceso;
      stats.psychology.falta += g.psychologyStats.falta;
      
      stats.interview.realizado += g.interviewStats.realizado;
      stats.interview.falta += g.interviewStats.falta;
      
      stats.status.completo += g.statusStats.completo;
      stats.status.proceso += g.statusStats.proceso;
      stats.status.falta += g.statusStats.falta;
    });

    return stats;
  }, [groupMetrics]);

  const chartData = useMemo(() => [
    {
      name: "Batería Psicología",
      data: [
        { name: "Completo", value: globalStats.psychology.completo, color: COLORS_STATUS.completo },
        { name: "Proceso", value: globalStats.psychology.proceso, color: COLORS_STATUS.proceso },
        { name: "Falta", value: globalStats.psychology.falta, color: COLORS_STATUS.falta },
      ]
    },
    {
      name: "Entrevista por Competencias",
      data: [
        { name: "Realizado", value: globalStats.interview.realizado, color: COLORS_STATUS.realizado },
        { name: "Falta", value: globalStats.interview.falta, color: COLORS_STATUS.falta },
      ]
    },
    {
      name: "Estado General",
      data: [
        { name: "Completo", value: globalStats.status.completo, color: COLORS_STATUS.completo },
        { name: "Proceso", value: globalStats.status.proceso, color: COLORS_STATUS.proceso },
        { name: "Falta", value: globalStats.status.falta, color: COLORS_STATUS.falta },
      ]
    }
  ], [globalStats]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Cargando Seguimiento...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-black">Error de Sincronización</h2>
        <Button onClick={() => refetch()}>Reintentar conexión</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic">
            Seguimiento de <span className="text-primary italic">Aplicación</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Reporte consolidado de estados y cumplimiento (Seguridad Privada)</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl border-primary/20 hover:bg-primary/5">
            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} /> 
            {isFetching ? "Actualizando..." : "Sincronizar Datos"}
          </Button>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-bold">LIVE SYNC</Badge>
        </div>
      </div>

      {/* Global Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Evaluados</p>
                <p className="text-4xl font-black text-foreground">{globalStats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-emerald-500/5 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Baterías Listas</p>
                <p className="text-4xl font-black text-emerald-700">{globalStats.psychology.completo}</p>
              </div>
              <ClipboardCheck className="w-10 h-10 text-emerald-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-blue-500/5 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Entrevistas</p>
                <p className="text-4xl font-black text-blue-700">{globalStats.interview.realizado}</p>
              </div>
              <Activity className="w-10 h-10 text-blue-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-amber-500/5 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">En Proceso</p>
                <p className="text-4xl font-black text-amber-700">{globalStats.status.proceso}</p>
              </div>
              <Loader2 className="w-10 h-10 text-amber-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* The 3 Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {chartData.map((chart) => (
          <Card key={chart.name} className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden p-6 hover:shadow-primary/5 transition-all">
            <CardHeader className="p-0 pb-6 text-center">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{chart.name}</CardTitle>
            </CardHeader>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chart.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {chart.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center flex-wrap gap-4 mt-6">
              {chart.data.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-[10px] font-black uppercase">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}: <span className="text-foreground">{d.value}</span></span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Area Breakdown Table (Numeric only) */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Desglose Numérico por Área
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Área</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Baterías OK</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Entrevistas OK</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Total</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progreso</th>
                </tr>
              </thead>
              <tbody>
                {groupMetrics.map((group) => (
                  <tr key={group.id} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-black text-sm text-foreground">{group.name}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{group.psychologyStats.completo}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">{group.interviewStats.realizado}</td>
                    <td className="px-6 py-4 text-center font-bold text-muted-foreground">{group.total}</td>
                    <td className="px-6 py-4 w-48">
                      <div className="flex items-center gap-3">
                        <Progress value={group.avgScore} className="h-2 flex-1" />
                        <span className="text-xs font-black w-8">{group.avgScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticPage;
