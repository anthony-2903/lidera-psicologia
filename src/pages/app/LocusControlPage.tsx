import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLocusControlData, LocusControlEntry } from "@/lib/sheets-adapter";
import { 
  Target, Brain, Zap, ShieldCheck, Users, Search, RefreshCw, AlertCircle,
  TrendingUp, ArrowRight, User, Filter, Globe, ChevronRight, LayoutDashboard, List,
  X, FileDown, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/DashboardCards";
import { cn } from "@/lib/utils";

const SHEET_ID = "1W5-F5SXjJBsFehhBd_5EQwaxarP99HoE9Z1ak-93sSM";

const RISK_COLORS = {
  'RIESGO ALTO': '#ef4444',   // Red-500
  'RIESGO MEDIO': '#f59e0b',  // Amber-500
  'APTO': '#10b981'           // Emerald-500
};

// Panel Lateral de Detalle Individual
const LocusIndividualPanel = ({ entry, onClose }: { entry: LocusControlEntry, onClose: () => void }) => {
  const internalPct = (entry.internalScore / 23) * 100;
  
  const getAnalysis = (score: number) => {
    if (score <= 12) return "Perfil con alta dependencia de factores externos. Existe una tendencia a percibir que los resultados de seguridad dependen de la suerte o de terceros, lo cual requiere intervención en autonomía.";
    if (score <= 18) return "Perfil equilibrado con capacidad de autogestión. El individuo reconoce su impacto en los resultados pero mantiene conciencia de las limitaciones del entorno.";
    return "Alta orientación al autodominio. El individuo asume total responsabilidad sobre sus acciones y resultados de seguridad, ideal para roles de liderazgo y supervisión autónoma.";
  };

  return (
    <div className={cn(
      "h-full flex flex-col animate-in slide-in-from-right-full duration-700 cubic-bezier(0.4, 0, 0.2, 1) border-l border-border/40 bg-card/60 backdrop-blur-3xl shadow-[-20px_0_80px_rgba(0,0,0,0.2)]"
    )}>
      {/* Header */}
      <div className="px-6 py-6 border-b border-border/20 shrink-0 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl animate-pulse"></div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner relative z-10">
                <User className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70 mb-0.5">Perfil Individual de Control</p>
              <h3 className="text-xl font-black text-foreground leading-tight tracking-tighter uppercase italic">{entry.name}</h3>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-red-500/10 hover:text-red-500 transition-all">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-muted/5">
        <div className="grid grid-cols-2 gap-4">
           <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
              <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Empresa</p>
              <p className="text-sm font-black italic">{entry.company}</p>
           </Card>
           <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
              <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Puesto</p>
              <p className="text-sm font-black italic">{entry.position}</p>
           </Card>
        </div>

        <div className="space-y-6">
           <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 px-2 flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-primary" /> Balanza de Control
           </h4>
           <div className="bg-background/40 rounded-[2.5rem] p-8 border border-border/10 shadow-xl space-y-8">
              <div className="relative h-4 w-full bg-muted/30 rounded-full overflow-hidden">
                 <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" 
                    style={{ width: `${internalPct}%` }} 
                 />
                 <div 
                    className="absolute h-8 w-2 bg-white border border-border shadow-2xl rounded-full top-1/2 -translate-y-1/2 transition-all duration-1000"
                    style={{ left: `${internalPct}%` }}
                 />
              </div>
              <div className="flex justify-between items-center bg-muted/20 rounded-2xl p-4">
                 <div className="text-center flex-1">
                    <p className="text-2xl font-black text-indigo-600 tabular-nums">{entry.internalScore}</p>
                    <p className="text-[8px] font-bold uppercase text-indigo-500 tracking-widest">Ptos. Interno</p>
                 </div>
                 <div className="w-px h-8 bg-border/20" />
                 <div className="text-center flex-1">
                    <p className="text-2xl font-black text-emerald-600 tabular-nums">{entry.externalScore}</p>
                    <p className="text-[8px] font-bold uppercase text-emerald-500 tracking-widest">Ptos. Externo</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Aptitude Ruler Scale (Regla de Medida) */}
        <div className="space-y-4">
           <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 px-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Regla de Aptitud Cognitiva
           </h4>
           <div className="bg-background/40 rounded-[2.5rem] p-8 border border-border/10 shadow-xl space-y-10 relative overflow-hidden">
              <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground/40 px-1 italic">
                 <span>Riesgo Crítico</span>
                 <span>Punto de Equilibrio</span>
                 <span>Aptitud Óptima</span>
              </div>
              
              <div className="relative h-12 w-full flex items-center">
                 {/* The Ruler Background with segments */}
                 <div className="absolute inset-x-0 h-3 bg-muted/20 rounded-full flex overflow-hidden border border-border/10">
                    <div className="h-full bg-red-500/40 border-r border-white/20" style={{ width: `${(12/23)*100}%` }} />
                    <div className="h-full bg-amber-500/40 border-r border-white/20" style={{ width: `${(6/23)*100}%` }} />
                    <div className="h-full bg-emerald-500/40" style={{ width: `${(5/23)*100}%` }} />
                 </div>

                 {/* Ticks */}
                 <div className="absolute inset-x-0 h-8 flex justify-between px-0.5 pointer-events-none">
                    {[0, 5, 10, 15, 20, 23].map((tick) => (
                      <div key={tick} className="flex flex-col items-center">
                        <div className="w-px h-2 bg-border/40 mb-1" />
                        <span className="text-[7px] font-bold text-muted-foreground/30">{tick}</span>
                      </div>
                    ))}
                 </div>

                 {/* Individual Pointer */}
                 <div 
                    className="absolute z-20 transition-all duration-1000 ease-out"
                    style={{ left: `${(entry.internalScore / 23) * 100}%` }}
                 >
                    <div className="relative -translate-x-1/2 flex flex-col items-center">
                       <div className={cn(
                         "w-1 h-16 -mt-2 shadow-xl rounded-full animate-pulse",
                         entry.internalScore <= 12 ? "bg-red-500" :
                         entry.internalScore <= 18 ? "bg-amber-500" :
                         "bg-emerald-500"
                       )} />
                       <div className={cn(
                         "mt-1 px-3 py-1 rounded-full text-[10px] font-black shadow-2xl border border-white/20 whitespace-nowrap",
                         entry.internalScore <= 12 ? "bg-red-500 text-white" :
                         entry.internalScore <= 18 ? "bg-amber-500 text-white" :
                         "bg-emerald-500 text-white"
                       )}>
                         {entry.internalScore} PTS
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4">
                 <div className={cn("text-center p-2 rounded-xl border border-dashed transition-all", entry.internalScore <= 12 ? "bg-red-500/10 border-red-500/30 ring-1 ring-red-500/20" : "opacity-30")}>
                    <p className="text-[8px] font-black uppercase text-red-600">Alto Riesgo</p>
                 </div>
                 <div className={cn("text-center p-2 rounded-xl border border-dashed transition-all", (entry.internalScore > 12 && entry.internalScore <= 18) ? "bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20" : "opacity-30")}>
                    <p className="text-[8px] font-black uppercase text-amber-600">Riesgo Medio</p>
                 </div>
                 <div className={cn("text-center p-2 rounded-xl border border-dashed transition-all", entry.internalScore > 18 ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20" : "opacity-30")}>
                    <p className="text-[8px] font-black uppercase text-emerald-600">Usuario Apto</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-6 bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-50" />
          <h4 className="text-[11px] font-black uppercase mb-4 text-primary flex items-center gap-2">
             <Sparkles className="w-4 h-4" /> Descriptivo Psicométrico
          </h4>
          <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{getAnalysis(entry.internalScore)}"</p>
        </div>

        <Button className="w-full h-14 rounded-2xl gap-3 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
           <FileDown className="w-5 h-5" /> Descargar Informe PDF
        </Button>
      </div>
    </div>
  );
};

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LocusControlPage = () => {
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<LocusControlEntry | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['locusControl', SHEET_ID],
    queryFn: () => fetchLocusControlData(SHEET_ID),
  });

  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    return data.entries.filter(entry => 
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse uppercase tracking-widest text-xs">Sincronizando Datos Psicometricos...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-xl border border-red-500/20">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Error de Conexión</h2>
          <p className="text-muted-foreground max-w-sm">No pudimos obtener los datos de Locus de Control desde el repositorio.</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} /> Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col selection:bg-primary/20 overflow-x-hidden">
      <div className={cn(
        "flex-1 space-y-12 pb-24 px-4 md:px-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
        selectedEntry ? "pr-0 lg:pr-[450px] xl:pr-[500px]" : ""
      )}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                <Globe className="w-5 h-5" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground italic flex items-center gap-3">
                Locus <span className="text-primary not-italic">Control</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-2xl px-1">
              Análisis de la percepción de control sobre eventos críticos y seguridad operativa.
            </p>
          </div>

          <div className="flex items-center bg-muted/30 p-1 rounded-2xl border border-border/50 backdrop-blur-md">
            <Button 
              variant={view === 'dashboard' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('dashboard')}
              className={cn("rounded-xl gap-2 px-4 font-bold text-xs uppercase tracking-wider", view === 'dashboard' && "shadow-lg shadow-primary/20")}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
            <Button 
              variant={view === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('list')}
              className={cn("rounded-xl gap-2 px-4 font-bold text-xs uppercase tracking-wider", view === 'list' && "shadow-lg shadow-primary/20")}
            >
              <List className="w-4 h-4" /> Listado
            </Button>
            <div className="w-px h-6 bg-border/50 mx-2" />
            <Button variant="ghost" size="icon" onClick={() => refetch()} className="rounded-xl">
              <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
            </Button>
          </div>
        </div>

        {view === 'dashboard' ? (
          <div className="space-y-10">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard 
                label="Total Evaluados" 
                value={data.totalEvaluated} 
                icon={Users} 
                color="text-blue-500" 
                bg="bg-blue-500/10" 
                border="border-blue-500/20" 
              />
              <KpiCard 
                label="Promedio Interno" 
                value={data.avgInternal.toFixed(1)} 
                icon={Brain} 
                color="text-indigo-500" 
                bg="bg-indigo-500/10" 
                border="border-indigo-500/20" 
              />
              <KpiCard 
                label="Promedio Externo" 
                value={data.avgExternal.toFixed(1)} 
                icon={Zap} 
                color="text-emerald-500" 
                bg="bg-emerald-500/10" 
                border="border-emerald-500/20" 
              />
              <KpiCard 
                label="Índice de Aptitud" 
                value={`${((data.riskDistribution.find(d => d.name === 'APTO')?.value || 0) / data.totalEvaluated * 100).toFixed(0)}%`} 
                icon={ShieldCheck} 
                color="text-amber-500" 
                bg="bg-amber-500/10" 
                border="border-amber-500/20" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chart: Risk Distribution */}
              <Card className="lg:col-span-4 border-2 shadow-2xl rounded-[2.5rem] overflow-hidden group">
                <CardHeader className="bg-muted/5 border-b border-border/20 p-8">
                  <CardTitle className="text-xl font-black italic tracking-tighter">Distribución de Aptitud</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Segmentación por puntaje interno</CardDescription>
                </CardHeader>
                <CardContent className="p-8 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {data.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip cursor={{ fill: 'transparent' }} content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-2xl">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].name}</p>
                              <p className="text-xl font-black">{payload[0].value} <span className="text-xs font-medium text-muted-foreground italic">casos</span></p>
                            </div>
                          );
                        }
                        return null;
                      }} />
                      <Legend verticalAlign="bottom" height={36} content={({ payload }) => (
                        <div className="flex justify-center gap-6 mt-4">
                          {payload?.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Chart: Level Line Comparison */}
              <Card className="lg:col-span-8 border-2 shadow-2xl rounded-[2.5rem] overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
                <CardHeader className="bg-muted/5 border-b border-border/20 p-8">
                  <CardTitle className="text-xl font-black italic tracking-tighter">Comparativa Locus Interno vs Externo</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Balance promedio del grupo evaluado</CardDescription>
                </CardHeader>
                <CardContent className="p-8 lg:p-12 space-y-16">
                  
                  <div className="space-y-10 relative">
                    <div className="flex justify-between items-end mb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-indigo-500 uppercase tracking-tighter">Locus Interno</p>
                        <p className="text-4xl font-black tabular-nums italic text-indigo-600">{(data.avgInternal / 23 * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-black text-emerald-500 uppercase tracking-tighter">Locus Externo</p>
                        <p className="text-4xl font-black tabular-nums italic text-emerald-600">{(data.avgExternal / 23 * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="relative h-6 w-full bg-muted/20 rounded-full border border-border/50 overflow-hidden shadow-inner">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${(data.avgInternal / 23 * 100)}%` }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-10 bg-white shadow-xl z-10 border border-border/20 rounded-full" style={{ left: `${(data.avgInternal / 23 * 100)}%`, position: 'absolute', transform: 'translateX(-50%)' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 bg-indigo-50/10 rounded-3xl border border-indigo-200/20">
                        <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Significado
                        </h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">Proporción de individuos que atribuyen sus éxitos a su esfuerzo propio.</p>
                      </div>
                      <div className="p-6 bg-emerald-50/10 rounded-3xl border border-emerald-200/20">
                        <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Significado
                        </h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">Proporción de individuos que perciben que agentes externos determinan su seguridad.</p>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] p-8 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter">Regla de Negocio</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apto</span>
                        <span className="text-xs font-black text-emerald-500 tracking-tighter italic">19 - 23 pts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riesgo Medio</span>
                        <span className="text-xs font-black text-amber-500 tracking-tighter italic">13 - 18 pts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riesgo Alto</span>
                        <span className="text-xs font-black text-red-500 tracking-tighter italic">0 - 12 pts</span>
                      </div>
                    </div>
                </div>
              </Card>

              <Card className="md:col-span-2 border-2 border-dashed rounded-[2.5rem] p-8 bg-muted/5 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-foreground italic uppercase">Análisis Neural Sugerido</h4>
                    <p className="text-muted-foreground text-sm max-w-lg mt-1 italic">
                      "El promedio de {data.avgInternal.toFixed(1)} en el locus interno indica una tendencia hacia la responsabilidad operativa, permitiendo una mejor adherencia a protocolos de seguridad crítica."
                    </p>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full max-w-lg group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Buscar por nombre o empresa..." 
                    className="pl-12 h-14 bg-card shadow-xl border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
              </div>
              <div className="flex items-center gap-3 bg-muted/30 px-6 py-3 rounded-2xl border border-border/50">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{filteredEntries.length} Casos Encontrados</span>
              </div>
            </div>

            <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50 border-b-2">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-6 px-8">ID</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-6">Evaluado</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-6">Puesto / Empresa</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-6">Interno</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-6">Externo</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-6">Condición</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow 
                      key={entry.id} 
                      onClick={() => setSelectedEntry(entry)}
                      className={cn(
                        "group hover:bg-muted/30 transition-colors border-b-border/10 cursor-pointer",
                        selectedEntry?.id === entry.id ? "bg-primary/5" : ""
                      )}
                    >
                      <TableCell className="font-mono text-[10px] font-bold text-muted-foreground/40 px-8 py-5">#{entry.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-black italic uppercase text-xs tracking-tight group-hover:translate-x-1 transition-transform">{entry.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold uppercase">{entry.position}</p>
                          <p className="text-[9px] font-bold text-muted-foreground/60">{entry.company}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-black tabular-nums text-indigo-600">{entry.internalScore}</TableCell>
                      <TableCell className="font-black tabular-nums text-emerald-600">{entry.externalScore}</TableCell>
                      <TableCell>
                        <Badge className={cn("border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", 
                          entry.result === 'APTO' ? "bg-emerald-500/10 text-emerald-600" :
                          entry.result === 'RIESGO MEDIO' ? "bg-amber-500/10 text-amber-600" :
                          "bg-red-500/10 text-red-600"
                        )}>
                          {entry.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>

      {/* Sliding Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-screen z-50 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
        selectedEntry 
          ? "w-full md:w-[450px] lg:w-[500px] xl:w-[550px] translate-x-0" 
          : "w-0 translate-x-full pointer-events-none"
      )}>
        {selectedEntry && (
          <LocusIndividualPanel 
            entry={selectedEntry} 
            onClose={() => setSelectedEntry(null)} 
          />
        )}
      </div>

      {/* Backdrop */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-in fade-in duration-700"
          onClick={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
};

export default LocusControlPage;
