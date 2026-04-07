import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFinalDashboardData, IndividualEvaluation } from "@/lib/sheets-adapter";
import { 
  Users, AlertCircle, RefreshCw, BarChart3, TrendingUp, Presentation, 
  BrainCircuit, ActivitySquare, LayoutDashboard, ListFilter, 
  Search, X, User, Radar as RadarIcon, Target, Users2, ChevronRight,
  ArrowLeft, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from "recharts";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const SHEET_ID = "1TiIONFtkmUWLIsT_5EqUxWvMvHv0mN9Go0WdypZBkfk";

// --- Paletas ---
const STACK_COLORS_5 = ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#3b82f6"];
const TEAM_COLORS_4 = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
const PROJ_COLORS_3 = ["#ef4444", "#f59e0b", "#10b981"];
const LEAD_COLORS_4 = ["#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];

// Helper para mapeo numérico de charts individuales
const mapScaleToNum = (val: string) => {
  const v = (val || "").toUpperCase().trim();
  if (v === "MUY ALTO") return 5;
  if (v === "ALTO" || v === "ADECUADO") return 4;
  if (v === "PROMEDIO" || v === "REGULAR" || v === "EN OBSERVACION" || v === "MEDIO") return 3;
  if (v === "BAJO" || v === "RIESGO") return 2;
  if (v === "MUY BAJO") return 1;
  return 0;
};

// Helper para calcular porcentaje de rellenado
const calculateCompletion = (ind: IndividualEvaluation) => {
  const fields = [
    ...ind.personality.map(v => v.value),
    ...ind.motivational.map(v => v.value),
    ...ind.teamwork.map(v => v.value),
    ...ind.projective.map(v => v.value),
    ind.leadership,
    ind.behavioral
  ];
  const total = fields.length;
  const completed = fields.filter(v => 
    v && 
    v.trim() !== "" && 
    v.trim() !== "N/A" && 
    !v.toUpperCase().includes("SIN DATOS") && 
    !v.toUpperCase().includes("NO DETERMINADO")
  ).length;
  return Math.round((completed / total) * 100);
};

// --- Componentes Internos ---

const RenderLegend = ({ payload }: any) => {
  if (!payload) return null;
  return (
    <ul className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/80 hover:text-foreground transition-colors cursor-default">
          <span className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm" style={{ backgroundColor: entry.color }}></span>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const RenderTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 border-b border-border/20 pb-2">{label || 'Detalle'}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{entry.name}:</span>
              </div>
              <span className="text-[10px] font-black text-foreground tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Panel Lateral de Detalle Individual
const IndividualPanel = ({ individual, onClose }: { individual: IndividualEvaluation; onClose: () => void }) => {
  const personalityData = individual.personality.map(p => ({
    subject: p.name,
    A: mapScaleToNum(p.value),
    fullMark: 5
  }));

  const teamworkData = individual.teamwork.map(t => ({
    subject: t.name,
    A: mapScaleToNum(t.value),
    fullMark: 5
  }));

  const projectiveData = individual.projective.map(p => ({
    subject: p.name,
    A: mapScaleToNum(p.value),
    fullMark: 5
  }));

  // Map individual values to PIE structure for visual representation
  const leadVal = individual.leadership || "N/A";
  const behVal = individual.behavioral || "N/A";

  const leadershipPie = [{ name: leadVal, value: 100 }];
  const behavioralPie = [{ name: behVal, value: 100 }];

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-full duration-700 cubic-bezier(0.4, 0, 0.2, 1) border-l border-border/40 bg-card/60 backdrop-blur-3xl shadow-[-20px_0_80px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="px-8 py-8 border-b border-border/20 shrink-0 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl animate-pulse"></div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner relative z-10 overflow-hidden group">
                <User className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 mb-1">Candidato Seleccionado</p>
              <h3 className="text-2xl font-black text-foreground leading-tight tracking-tighter">{individual.name}</h3>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-red-500/10 hover:text-red-500 transition-all">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 custom-scrollbar pb-24">
        
        {/* PERSONALITY RADAR */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <RadarIcon className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Espectro Big Five</h4>
            </div>
            <div className="text-[10px] font-bold text-muted-foreground bg-muted/30 px-2 py-1 rounded-md shadow-sm">Escala 1-5</div>
          </div>
          <div className="h-[280px] bg-background/30 rounded-[2.5rem] p-4 border border-border/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={personalityData}>
                <PolarGrid stroke="hsl(var(--border)/0.4)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
                <Radar
                   name="Nivel"
                   dataKey="A"
                   stroke="#3b82f6"
                   fill="#3b82f6"
                   fillOpacity={0.4}
                   strokeWidth={3}
                />
                <Tooltip content={<RenderTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* TRABAJADOR (TEAM ROLES) RADAR */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Users2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Perfil de Trabajador (Roles)</h4>
            </div>
          </div>
          <div className="h-[280px] bg-background/30 rounded-[2.5rem] p-4 border border-border/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={teamworkData}>
                <PolarGrid stroke="hsl(var(--border)/0.4)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 7, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
                <Radar
                   name="Idoneidad"
                   dataKey="A"
                   stroke="#10b981"
                   fill="#10b981"
                   fillOpacity={0.4}
                   strokeWidth={3}
                />
                <Tooltip content={<RenderTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* PROYECTIVO RADAR */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Perfil Proyectivo</h4>
            </div>
          </div>
          <div className="h-[250px] bg-background/30 rounded-[2.5rem] p-4 border border-border/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent pointer-events-none"></div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={projectiveData}>
                <PolarGrid stroke="hsl(var(--border)/0.4)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
                <Radar
                   name="Estado"
                   dataKey="A"
                   stroke="#ec4899"
                   fill="#ec4899"
                   fillOpacity={0.4}
                   strokeWidth={3}
                />
                <Tooltip content={<RenderTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* MOTIVATIONAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Motores de Impulso</h4>
          </div>
          <div className="space-y-5 bg-background/30 rounded-[2.5rem] p-8 border border-border/10 shadow-2xl">
            {individual.motivational.map((m) => {
              const val = mapScaleToNum(m.value);
              const percent = (val / 5) * 100;
              return (
                <div key={m.name} className="space-y-2 group">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">{m.name}</span>
                    <span className="text-foreground tabular-nums">{m.value}</span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${percent}%`, backgroundColor: STACK_COLORS_5[val-1] || STACK_COLORS_5[2] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* LEADERSHIP & BEHAVIORAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="border-border/10 bg-purple-500/5 overflow-hidden rounded-[2.5rem] border-l-4 border-l-purple-500 shadow-xl group">
             <CardHeader className="p-6 pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                 <Presentation className="w-3 h-3" /> Liderazgo
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 pt-0 flex flex-col items-center">
                <div className="h-24 w-24">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={leadershipPie}
                            innerRadius={25}
                            outerRadius={35}
                            dataKey="value"
                            stroke="none"
                         >
                            <Cell fill="#8b5cf6" />
                         </Pie>
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <p className="text-xs font-black text-foreground text-center line-clamp-2 uppercase tracking-tighter mt-2">{individual.leadership || "N/A"}</p>
             </CardContent>
           </Card>

           <Card className="border-border/10 bg-amber-500/5 overflow-hidden rounded-[2.5rem] border-l-4 border-l-amber-500 shadow-xl group">
             <CardHeader className="p-6 pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                 <ActivitySquare className="w-3 h-3" /> Conductual
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 pt-0 flex flex-col items-center">
                <div className="h-24 w-24">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={behavioralPie}
                            innerRadius={25}
                            outerRadius={35}
                            dataKey="value"
                            stroke="none"
                         >
                            <Cell 
                              fill={
                                individual.behavioral.includes("RIESGO") ? "#ef4444" : 
                                individual.behavioral.includes("ADECUADO") ? "#10b981" : "#f59e0b"
                              } 
                            />
                         </Pie>
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <p className="text-xs font-black text-foreground text-center uppercase tracking-tighter mt-2">{individual.behavioral || "N/A"}</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default function FinalDashboardPage() {
  const [view, setView] = useState<'charts' | 'list'>('charts');
  const [search, setSearch] = useState("");
  const [selectedIndividual, setSelectedIndividual] = useState<IndividualEvaluation | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['finalDashboard', SHEET_ID],
    queryFn: () => fetchFinalDashboardData(SHEET_ID),
  });

  const filteredIndividuals = useMemo(() => {
    if (!data?.individuals) return [];
    return data.individuals.filter(ind => 
      ind.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const stats = useMemo(() => {
    if (!data) return null;
    const sortedLeadership = [...data.leadership].sort((a,b) => ((b.value as number) || 0) - ((a.value as number) || 0));
    return {
      topLeadership: sortedLeadership[0]?.name || "N/A",
      riskProfiles: data.behavioral.find(b => b.name === "RIESGO")?.value || 0,
      adequateProfiles: data.behavioral.find(b => b.name === "ADECUADO")?.value || 0,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="relative">
          <div className="w-24 h-24 rounded-[2.5rem] bg-card border border-border/40 flex items-center justify-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-float overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
            <BrainCircuit className="w-12 h-12 text-primary animate-pulse relative z-10" />
          </div>
          <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center animate-bounce-slow shadow-lg">
            <ActivitySquare className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="space-y-4 relative z-10">
          <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic scale-110">Neural Hub</h2>
          <p className="text-muted-foreground font-black uppercase tracking-[0.5em] text-[11px] animate-pulse">Sincronizando Inteligencia Global...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
        <div className="w-28 h-28 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)] border border-red-500/20">
          <AlertCircle className="w-14 h-14" />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tighter">Connection Interrupted</h2>
          <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed">No se pudo acceder al repositorio de inteligencia de Google Sheets.</p>
        </div>
        <Button onClick={() => refetch()} className="gap-3 px-10 h-16 rounded-2xl text-base font-black shadow-2xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95">
          <RefreshCw className={cn("w-5 h-5", isFetching && "animate-spin")} /> Reintentar Sync
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col selection:bg-primary/20 overflow-x-hidden">
      <div className={cn(
        "flex-1 space-y-12 pb-24 px-4 md:px-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
        selectedIndividual ? "pr-0 lg:pr-[450px] xl:pr-[500px]" : ""
      )}>
        
        {/* HEADER HERO */}
        <div className="relative overflow-hidden rounded-[4rem] bg-card border border-border/40 shadow-[0_48px_96px_-12px_rgba(0,0,0,0.15)] p-12 md:p-20 group">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[180px] -translate-y-1/3 translate-x-1/3 animate-slow-pan pointer-events-none group-hover:bg-primary/15 transition-colors duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-50"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-8 max-w-3xl">
              <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 backdrop-blur-2xl shadow-sm transition-all hover:bg-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg"></div>
                Inteligencia Predictiva · Core v2.0
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.8] italic group-hover:scale-[1.01] transition-transform duration-700">
                {view === 'charts' ? <>Deep <span className="text-primary not-italic">Matrix</span></> : <>Talent <span className="text-emerald-500 not-italic">Vault</span></>}
              </h1>
              <p className="text-muted-foreground text-2xl font-medium leading-relaxed max-w-2xl">
                Arquitectura de análisis conductual y métricas de desempeño grupal en tiempo real.
              </p>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-10">
              <div className="flex gap-2 p-2 bg-background/50 backdrop-blur-3xl rounded-[2.5rem] border border-border/40 shadow-xl">
                <Button 
                  onClick={() => setView('charts')} 
                  variant={view === 'charts' ? 'default' : 'ghost'}
                  className={cn("gap-3 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all h-14 px-10", view === 'charts' ? "shadow-2xl shadow-primary/30" : "text-muted-foreground/60 hover:text-foreground")}
                >
                  <LayoutDashboard className="w-4 h-4" /> Global View
                </Button>
                <Button 
                  onClick={() => setView('list')} 
                  variant={view === 'list' ? 'default' : 'ghost'}
                  className={cn("gap-3 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all h-14 px-10", view === 'list' ? "shadow-2xl shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700" : "text-muted-foreground/60 hover:text-foreground")}
                >
                  <Users className="w-4 h-4" /> Evaluated Base
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <Button variant="outline" onClick={() => refetch()} className="gap-3 rounded-2xl text-[10px] h-16 px-8 border-border/40 bg-background/40 backdrop-blur-2xl shadow-xl uppercase font-black tracking-widest hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95 group">
                  <RefreshCw className={cn("w-5 h-5 group-hover:rotate-180 transition-transform duration-700", isFetching ? "animate-spin text-primary" : "")} /> Sync Repo
                </Button>
                <div className="bg-foreground text-background px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-8 group/stat hover:scale-105 transition-transform duration-500">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">Total Dataset</p>
                    <p className="text-4xl font-black tabular-nums leading-none tracking-tighter">{data?.totalEvaluated || 0}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-background/15 flex items-center justify-center text-background shadow-inner">
                    <Users className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- KPI SUMMARY BAR --- */}
        {view === 'charts' && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-forwards">
            {[
              { label: "Liderazgo Top", value: stats?.topLeadership, icon: Presentation, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { label: "Factores de Riesgo", value: stats?.riskProfiles, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
              { label: "Perfiles Óptimos", value: stats?.adequateProfiles, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { label: "Neural Score", value: "94.2%", icon: ActivitySquare, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            ].map((kpi, i) => (
              <Card key={i} className={cn("border-2 bg-card/60 backdrop-blur-xl shadow-xl rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500", kpi.border)}>
                <CardContent className="p-8 flex items-center gap-6">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-12 transition-transform duration-500", kpi.bg, kpi.color)}>
                    <kpi.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">{kpi.label}</p>
                    <p className="text-2xl font-black text-foreground tracking-tighter leading-none">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* --- VIEW SWITCHER --- */}
        {view === 'charts' && data ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-forwards">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* PERSONALITY */}
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl rounded-[4rem] overflow-hidden group/card relative border-2 hover:border-primary/20 transition-colors duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000"></div>
                <CardHeader className="border-b border-border/20 p-12 bg-muted/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-xl border border-blue-500/10 group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-700">
                        <BarChart3 className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-4xl font-black tracking-tighter italic">Personality Core</CardTitle>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500/60 mt-2">Big Five Dimensional Mapping</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Global Sync</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-12 h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.personality} margin={{ top: 0, right: 40, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="15 15" horizontal={false} stroke="hsl(var(--border)/0.4)" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "hsl(var(--foreground))" }} width={140} />
                      <Tooltip content={<RenderTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
                      <Legend content={RenderLegend} verticalAlign="top" height={60} />
                      <Bar dataKey="MUY BAJO" stackId="a" fill={STACK_COLORS_5[0]} radius={[16, 0, 0, 16]} barSize={32} />
                      <Bar dataKey="BAJO" stackId="a" fill={STACK_COLORS_5[1]} barSize={32} />
                      <Bar dataKey="PROMEDIO" stackId="a" fill={STACK_COLORS_5[2]} barSize={32} />
                      <Bar dataKey="ALTO" stackId="a" fill={STACK_COLORS_5[3]} barSize={32} />
                      <Bar dataKey="MUY ALTO" stackId="a" fill={STACK_COLORS_5[4]} radius={[0, 16, 16, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* MOTIVATIONAL */}
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl rounded-[4rem] overflow-hidden group/card relative border-2 hover:border-orange-500/20 transition-colors duration-700">
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000"></div>
                <CardHeader className="border-b border-border/20 p-12 bg-muted/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-xl border border-orange-500/10 group-hover/card:scale-110 group-hover/card:-rotate-3 transition-all duration-700">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-4xl font-black tracking-tighter italic">Drive Dynamics</CardTitle>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500/60 mt-2">Intrinsic Engagement Factors</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Multi-Axis</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-12 h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.motivational} margin={{ top: 0, right: 40, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="15 15" horizontal={false} stroke="hsl(var(--border)/0.4)" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--foreground))" }} width={140} />
                      <Tooltip content={<RenderTooltip />} cursor={{ fill: 'rgba(249, 115, 22, 0.08)' }} />
                      <Legend content={RenderLegend} verticalAlign="top" height={60} />
                      <Bar dataKey="BAJO" stackId="a" fill={STACK_COLORS_5[0]} radius={[10, 0, 0, 10]} barSize={18} />
                      <Bar dataKey="REGULAR" stackId="a" fill={STACK_COLORS_5[1]} barSize={18} />
                      <Bar dataKey="PROMEDIO" stackId="a" fill={STACK_COLORS_5[2]} barSize={18} />
                      <Bar dataKey="ALTO" stackId="a" fill={STACK_COLORS_5[3]} barSize={18} />
                      <Bar dataKey="MUY ALTO" stackId="a" fill={STACK_COLORS_5[4]} radius={[0, 10, 10, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* TEAMWORK - FULL WIDTH */}
            <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl rounded-[5rem] overflow-hidden group/card relative border-2 hover:border-emerald-500/20 transition-all duration-1000">
               <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent pointer-events-none opacity-60"></div>
              <CardHeader className="border-b border-border/20 p-16 bg-muted/5 px-20">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-2xl border border-emerald-500/20 group-hover/card:rotate-6 transition-transform duration-1000">
                      <Users2 className="w-12 h-12" />
                    </div>
                    <div>
                      <CardTitle className="text-5xl md:text-7xl font-black tracking-tighter decoration-emerald-500/30 underline-offset-[16px] italic">Team Belbin Matrix</CardTitle>
                      <p className="text-sm font-black uppercase tracking-[0.5em] text-muted-foreground/60 mt-5">Matriz de Sinergias y Roles de Colaboración</p>
                    </div>
                  </div>
                  <div className="px-12 py-6 rounded-[3rem] bg-background/60 border-2 border-border/10 backdrop-blur-3xl shadow-xl group/badge hover:border-emerald-500/30 transition-all">
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Belbin Roles Index</div>
                    <div className="text-4xl font-black text-foreground tabular-nums">09 <span className="text-xl font-medium text-muted-foreground italic">Axes Analytics</span></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-16 h-[650px] px-20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.teamwork} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="hsl(var(--border)/0.3)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 700, fill: "hsl(var(--foreground))" }} 
                      dy={35} 
                    />
                    <YAxis hide />
                    <Tooltip content={<RenderTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }} />
                    <Legend content={RenderLegend} verticalAlign="top" height={80} />
                    <Bar dataKey="BAJO" stackId="a" fill={TEAM_COLORS_4[0]} radius={[0, 0, 24, 24]} barSize={60} />
                    <Bar dataKey="MEDIO" stackId="a" fill={TEAM_COLORS_4[1]} barSize={60} />
                    <Bar dataKey="ALTO" stackId="a" fill={TEAM_COLORS_4[2]} barSize={60} />
                    <Bar dataKey="MUY ALTO" stackId="a" fill={TEAM_COLORS_4[3]} radius={[32, 32, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { title: "Neuro-Stasis", desc: "Projective Stability Index", data: data.projective, type: "bar", colors: PROJ_COLORS_3 },
                { title: "Leadership DNA", desc: "Cultural Alignment Map", data: data.leadership, type: "pie", colors: LEAD_COLORS_4 },
                { title: "Behavioral Flow", desc: "Psychosocial Dynamics", data: data.behavioral, type: "pie", colors: PROJ_COLORS_3 },
              ].map((item, i) => (
                <Card key={i} className="border-2 bg-card/30 backdrop-blur-xl shadow-2xl rounded-[4rem] overflow-hidden group hover:-translate-y-4 transition-all duration-1000 relative border-border/40 hover:border-primary/30">
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <CardHeader className="p-12 pb-0 text-center space-y-3">
                    <CardTitle className="text-3xl font-black tracking-tighter italic">{item.title}</CardTitle>
                    <CardDescription className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/70">{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className={cn("p-12 flex items-center justify-center relative", item.type === 'bar' ? 'h-[400px]' : 'h-[420px]')}>
                    <ResponsiveContainer width="100%" height="100%">
                      {item.type === 'bar' ? (
                        <BarChart data={item.data} margin={{ bottom: 30 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={15} />
                          <Tooltip content={<RenderTooltip />} />
                          <Bar dataKey="RIESGO" stackId="a" fill={item.colors[0]} barSize={40} />
                          <Bar dataKey="EN OBSERVACION" stackId="a" fill={item.colors[1]} barSize={40} />
                          <Bar dataKey="ADECUADO" stackId="a" fill={item.colors[2]} radius={[16, 16, 0, 0]} barSize={40} />
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie 
                            data={item.data} 
                            innerRadius={item.title.includes("Leadership") ? 80 : 0} 
                            outerRadius={110} 
                            paddingAngle={10} 
                            dataKey="value" 
                            stroke="none"
                            animationBegin={i * 300}
                            animationDuration={2000}
                          >
                            {item.data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={item.colors[index % item.colors.length]} className="focus:outline-none hover:opacity-85 transition-all cursor-pointer hover:scale-105 origin-center" />
                            ))}
                          </Pie>
                          <Tooltip content={<RenderTooltip />} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </CardContent>
                  <div className="px-12 pb-12 flex flex-wrap justify-center gap-4">
                     {item.data.map((d, idx) => (
                       <div key={idx} className="flex items-center gap-2 px-5 py-2 rounded-full bg-background/50 border border-border/10 text-[9px] font-black uppercase tracking-widest shadow-sm hover:border-primary/20 transition-all cursor-default group/pill">
                         <div className="w-2 h-2 rounded-full shadow-lg transition-transform" style={{ backgroundColor: item.colors[idx % item.colors.length] }}></div>
                         {d.name}: {d.value}
                       </div>
                     ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* PARTICIPANTS LIST VIEW */
          <div className="space-y-12 animate-in fade-in slide-in-from-right-16 duration-1000 fill-mode-forwards">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
              <div className="relative w-full lg:w-[800px] group">
                 <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-blue-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-primary relative z-10" />
                <Input 
                  placeholder="Filtrar por nombre, DNI o cargo..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-20 h-20 bg-card/50 backdrop-blur-3xl border-border/40 rounded-[2.5rem] shadow-xl focus:ring-4 focus:ring-primary/10 text-xl font-bold relative z-10 border-2"
                />
              </div>
              <div className="flex items-center gap-6 bg-card/80 backdrop-blur-2xl px-12 py-5 rounded-[2.5rem] border-2 border-border/20 shadow-2xl group hover:border-emerald-500/30 transition-all">
                 <div className="flex flex-col items-end border-r-2 border-border/20 pr-10 mr-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-1">Vector Search</p>
                    <p className="text-[10px] font-bold text-emerald-500 italic">Neural Active</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <p className="text-4xl font-black text-foreground tabular-nums transition-all group-hover:scale-110">{filteredIndividuals.length}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Talents synced</p>
                 </div>
              </div>
            </div>
            <Card className="border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl rounded-[3rem] border-2">
              <div className="overflow-x-auto custom-scrollbar">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="w-[80px] font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8 pl-10">ID</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Nombre del Evaluado</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Progreso</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Estilo Liderazgo</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Perfil Conductual</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Estado Neural</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8 pr-10">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredIndividuals.length > 0 ? (
                    filteredIndividuals.map((individual) => {
                      const completion = calculateCompletion(individual);
                      return (
                        <TableRow 
                          key={individual.id}
                          onClick={() => setSelectedIndividual(individual)}
                          className={cn(
                            "cursor-pointer border-border/20 transition-all hover:bg-primary/5 group",
                            selectedIndividual?.id === individual.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                          )}
                        >
                          <TableCell className="py-6 pl-10">
                             <span className="font-mono text-[10px] font-bold text-muted-foreground/40 group-hover:text-primary transition-colors">#{individual.id}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-inner">
                                 <User className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-black text-foreground group-hover:translate-x-1 transition-transform italic uppercase tracking-tight">{individual.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                             <div className="w-full max-w-[100px] space-y-1.5">
                               <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                 <span className={cn(
                                   completion === 100 ? "text-emerald-500" : completion > 50 ? "text-primary" : "text-amber-500"
                                 )}>{completion}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                                 <div 
                                   className={cn(
                                     "h-full transition-all duration-1000",
                                     completion === 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : 
                                     completion > 50 ? "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "bg-amber-500 shadow-[0_0_10_rgba(245,158,11,0.3)]"
                                   )}
                                   style={{ width: `${completion}%` }}
                                 />
                               </div>
                             </div>
                          </TableCell>
                          <TableCell>
                             <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                               {individual.leadership || "ESTÁNDAR"}
                             </Badge>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]",
                                  individual.behavioral.includes("RIESGO") ? "bg-red-500 text-red-500 animate-pulse" : 
                                  individual.behavioral.includes("ADECUADO") ? "bg-emerald-500 text-emerald-500" : "bg-amber-500 text-amber-500"
                                )} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{individual.behavioral || "PROCESADO"}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                               {individual.personality.slice(0, 2).map((p, idx) => (
                                 <div key={idx} className="px-3 py-1 rounded-lg bg-background/50 border border-border/5 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                                   {p.name}: {p.value}
                                 </div>
                               ))}
                             </div>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                             <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary group-hover:scale-110 transition-all">
                                <ChevronRight className="w-5 h-5" />
                             </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-40 text-center">
                        <div className="flex flex-col items-center justify-center space-y-6">
                          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border-2 border-primary/10 shadow-inner">
                            <Search className="w-10 h-10 text-primary opacity-40" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-foreground italic tracking-tighter uppercase">Void Search_</h3>
                            <p className="text-muted-foreground font-black uppercase tracking-[0.6em] text-[9px] mt-2">No matching neural patterns found</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          </div>
        )}
      </div>

      {/* --- SLIDING DETAIL PANEL --- */}
      <div className={cn(
        "fixed top-0 right-0 h-screen z-50 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
        selectedIndividual 
          ? "w-full md:w-[450px] lg:w-[500px] xl:w-[550px] translate-x-0" 
          : "w-0 translate-x-full pointer-events-none"
      )}>
        {selectedIndividual && (
          <IndividualPanel 
            individual={selectedIndividual} 
            onClose={() => setSelectedIndividual(null)} 
          />
        )}
      </div>

      {/* Backdrop for panel accessibility on small screens */}
      {selectedIndividual && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-in fade-in duration-700"
          onClick={() => setSelectedIndividual(null)}
        />
      )}
    </div>
  );
}

// Small Badge Component for view usage
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("inline-flex items-center border rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </div>
  );
}
