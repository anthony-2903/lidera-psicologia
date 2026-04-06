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

// --- Componentes Internos ---

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-4 mt-2">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: entry.color }}></span>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

// Panel Lateral de Detalle Individual
const IndividualPanel = ({ individual, onClose }: { individual: IndividualEvaluation; onClose: () => void }) => {
  const personalityData = individual.personality.map(p => ({
    subject: p.name,
    A: mapScaleToNum(p.value),
    fullMark: 5
  }));

  const motivationalData = individual.motivational.map(m => ({
    name: m.name,
    value: mapScaleToNum(m.value)
  }));

  const teamworkData = individual.teamwork.map(t => ({
    name: t.name,
    value: mapScaleToNum(t.value)
  }));

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-500 ease-out fill-mode-forwards border-l border-border/40 bg-card/60 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border/40 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <User className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Perfil Psicológico</p>
              <h3 className="text-xl font-black text-foreground leading-tight">{individual.name}</h3>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted transition-all">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar pb-20">
        
        {/* PERSONALITY RADAR */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <RadarIcon className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-black uppercase tracking-widest">Espectro de Personalidad</h4>
          </div>
          <div className="h-[280px] bg-background/40 rounded-3xl p-4 border border-border/20 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={personalityData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
                <Radar
                  name="Nivel"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.5}
                  strokeWidth={3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {individual.personality.map(p => (
              <div key={p.name} className="px-3 py-2 rounded-xl bg-muted/30 border border-border/10 flex justify-between items-center text-[10px]">
                <span className="font-bold text-muted-foreground">{p.name}</span>
                <span className="font-black text-foreground text-right ml-2">{p.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* MOTIVATIONAL */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" />
            <h4 className="text-xs font-black uppercase tracking-widest">Perfil Motivacional</h4>
          </div>
          <div className="h-[300px] bg-background/40 rounded-3xl p-4 border border-border/20 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={motivationalData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide domain={[0, 5]} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800 }} width={90} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', fontSize: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* KEY INDICATORS */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-border/40 bg-background/50 overflow-hidden rounded-2xl">
            <CardHeader className="p-4 pb-2 border-b border-border/20 bg-muted/20">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <BrainCircuit className="w-3 h-3" /> Liderazgo y Conducta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-muted-foreground">Estilo de Gerencia:</span>
                <span className="text-[11px] font-black text-foreground">{individual.leadership || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-muted-foreground">Perfil Conductual:</span>
                <span className="text-[11px] font-black text-foreground">{individual.behavioral || "N/A"}</span>
              </div>
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
          <ActivitySquare className="w-20 h-20 text-primary animate-pulse relative z-10" />
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-sm animate-pulse">Procesando Inteligencia Psicológica...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-2xl">
          <AlertCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter">Error de Conexión</h2>
          <p className="text-muted-foreground max-w-md font-medium text-lg">No pudimos procesar los datos de las métricas psicológicas.</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2 px-8 h-14 rounded-2xl text-base font-bold shadow-xl">
          <RefreshCw className="w-5 h-5" /> Reintentar Sincronización
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col">
      <div className={cn(
        "flex-1 space-y-8 pb-20 px-2 md:px-0 transition-all duration-500 ease-in-out",
        selectedIndividual ? "pr-0 lg:pr-[400px] xl:pr-[450px]" : ""
      )}>
        
        {/* HEADER HERO */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-sm p-8 md:p-12">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-slow-pan pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 backdrop-blur-sm">
                <BrainCircuit className="w-4 h-4" />
                Inteligencia Global · Live Sync
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
                Dashboard {view === 'charts' ? <span className="text-primary">Psicológico</span> : <span className="text-emerald-500">Participantes</span>}
              </h1>
              <p className="text-muted-foreground text-lg font-medium max-w-xl">
                Análisis profundo de personalidad, trabajo en equipo y perfil conductual basado en data en tiempo real.
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-6">
              <div className="flex gap-2 p-1.5 bg-muted/40 backdrop-blur-md rounded-2xl border border-border/40">
                <Button 
                  onClick={() => setView('charts')} 
                  variant={view === 'charts' ? 'default' : 'ghost'}
                  className={cn("gap-2 rounded-xl text-xs font-bold transition-all h-10 px-4", view === 'charts' ? "shadow-lg" : "")}
                >
                  <LayoutDashboard className="w-4 h-4" /> General
                </Button>
                <Button 
                  onClick={() => setView('list')} 
                  variant={view === 'list' ? 'default' : 'ghost'}
                  className={cn("gap-2 rounded-xl text-xs font-bold transition-all h-10 px-4", view === 'list' ? "shadow-lg bg-emerald-600 hover:bg-emerald-700" : "")}
                >
                  <ListFilter className="w-4 h-4" /> Listado
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => refetch()} className="gap-2 rounded-xl text-[10px] h-10 border-border/50 bg-background/50 backdrop-blur-md shadow-sm uppercase font-black tracking-widest">
                  <RefreshCw className={isFetching ? "animate-spin w-4 h-4" : "w-4 h-4"} /> Sync
                </Button>
                <div className="bg-background/80 backdrop-blur-md border border-border/40 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Evaluados</p>
                    <p className="text-2xl font-black text-foreground tabular-nums leading-none tracking-tighter">{data.totalEvaluated}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- VIEW SWITCHER --- */}
        {view === 'charts' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* PERSONALITY */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-card to-transparent border-b border-border/50 p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter">Perfil de Personalidad</CardTitle>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Big Five: Espectro de 5 niveles</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.personality} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: "hsl(var(--foreground))" }} width={120} />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                      <Legend content={renderLegend} verticalAlign="top" height={36} />
                      <Bar dataKey="MUY BAJO" stackId="a" fill={STACK_COLORS_5[0]} radius={[8, 0, 0, 8]} />
                      <Bar dataKey="BAJO" stackId="a" fill={STACK_COLORS_5[1]} />
                      <Bar dataKey="PROMEDIO" stackId="a" fill={STACK_COLORS_5[2]} />
                      <Bar dataKey="ALTO" stackId="a" fill={STACK_COLORS_5[3]} />
                      <Bar dataKey="MUY ALTO" stackId="a" fill={STACK_COLORS_5[4]} radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* MOTIVATIONAL */}
              <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-card to-transparent border-b border-border/50 p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter">Perfil Motivacional</CardTitle>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Factores intrínsecos y extrínsecos</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.motivational} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }} width={100} />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                      <Legend content={renderLegend} verticalAlign="top" height={36} />
                      <Bar dataKey="BAJO" stackId="a" fill={STACK_COLORS_5[0]} radius={[8, 0, 0, 8]} />
                      <Bar dataKey="REGULAR" stackId="a" fill={STACK_COLORS_5[1]} />
                      <Bar dataKey="PROMEDIO" stackId="a" fill={STACK_COLORS_5[2]} />
                      <Bar dataKey="ALTO" stackId="a" fill={STACK_COLORS_5[3]} />
                      <Bar dataKey="MUY ALTO" stackId="a" fill={STACK_COLORS_5[4]} radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* TEAMWORK - FULL WIDTH */}
            <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[3rem] overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-card to-transparent border-b border-border/50 p-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                    <Users2 className="w-7 h-7" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-black tracking-tighter underline decoration-emerald-500/30 underline-offset-8">Distribución de Talentos en Equipo</CardTitle>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mt-2">Roles de Belbin: Análisis de sinergias grupales</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.teamwork} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "hsl(var(--foreground))" }} dy={15} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                    <Legend content={renderLegend} verticalAlign="top" height={50} />
                    <Bar dataKey="BAJO" stackId="a" fill={TEAM_COLORS_4[0]} radius={[0, 0, 8, 8]} barSize={40} />
                    <Bar dataKey="MEDIO" stackId="a" fill={TEAM_COLORS_4[1]} barSize={40} />
                    <Bar dataKey="ALTO" stackId="a" fill={TEAM_COLORS_4[2]} barSize={40} />
                    <Bar dataKey="MUY ALTO" stackId="a" fill={TEAM_COLORS_4[3]} radius={[12, 12, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Perfil Proyectivo", desc: "4 Ejes de Riesgo", data: data.projective, type: "bar", colors: PROJ_COLORS_3 },
                { title: "Liderazgo", desc: "Estilos Gerenciales", data: data.leadership, type: "pie", colors: LEAD_COLORS_4 },
                { title: "Perfil Conductual", desc: "Riesgos del Comportamiento", data: data.behavioral, type: "pie", colors: PROJ_COLORS_3 },
              ].map((item, i) => (
                <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                  <CardHeader className="p-8 pb-0 text-center">
                    <CardTitle className="text-xl font-black tracking-tight">{item.title}</CardTitle>
                    <CardDescription className="text-[9px] font-bold uppercase tracking-[0.2em] mt-1">{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className={cn("p-6 flex items-center justify-center", item.type === 'bar' ? 'h-[300px]' : 'h-[320px]')}>
                    <ResponsiveContainer width="100%" height="100%">
                      {item.type === 'bar' ? (
                        <BarChart data={item.data}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800 }} dy={5} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="RIESGO" stackId="a" fill={item.colors[0]} />
                          <Bar dataKey="EN OBSERVACION" stackId="a" fill={item.colors[1]} />
                          <Bar dataKey="ADECUADO" stackId="a" fill={item.colors[2]} radius={[8, 8, 0, 0]} />
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie 
                            data={item.data} 
                            innerRadius={item.title === "Liderazgo" ? 60 : 0} 
                            outerRadius={90} 
                            paddingAngle={5} 
                            dataKey="value" 
                            label={item.title !== "Liderazgo" ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                            style={{ fontSize: '10px', fontWeight: 'bold' }}
                          >
                            {item.data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={item.colors[index % item.colors.length]} stroke="hsl(var(--background))" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* PARTICIPANTS LIST VIEW */
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-forwards">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-2">
              <div className="relative w-full md:w-[450px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input 
                  placeholder="Buscar participante por nombre..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-14 bg-card/60 backdrop-blur-md border-border/40 rounded-2xl shadow-xl focus:ring-primary/20 text-base font-medium"
                />
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  {filteredIndividuals.length} Participantes
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredIndividuals.length > 0 ? (
                filteredIndividuals.map((individual) => (
                  <Card 
                    key={individual.id}
                    onClick={() => setSelectedIndividual(individual)}
                    className={cn(
                      "group border-border/40 bg-card/40 backdrop-blur-md hover:bg-card/80 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-[2rem]",
                      selectedIndividual?.id === individual.id ? "ring-2 ring-primary border-primary shadow-primary/20 bg-card/80" : ""
                    )}
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-foreground group-hover:text-primary transition-colors">{individual.name}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">ID #2024-{individual.id}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="px-6 pb-6 pt-0 flex gap-2 overflow-x-auto no-scrollbar">
                      {individual.personality.slice(0, 3).map(p => (
                        <div key={p.name} className="flex flex-col items-center shrink-0 px-3 py-1.5 rounded-xl bg-background/50 border border-border/20">
                          <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">{p.name}</span>
                          <span className="text-[10px] font-black text-foreground">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground/40">
                    <Search className="w-10 h-10" />
                  </div>
                  <p className="text-muted-foreground font-black uppercase tracking-widest text-sm">No se encontraron participantes</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- SLIDING DETAIL PANEL --- */}
      <div className={cn(
        "fixed top-0 right-0 h-screen z-50 transition-all duration-500 ease-in-out",
        selectedIndividual 
          ? "w-full sm:w-[450px] lg:w-[480px] opacity-100" 
          : "w-0 opacity-0 pointer-events-none"
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
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-500"
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
