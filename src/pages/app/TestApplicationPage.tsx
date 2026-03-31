import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, User, Calendar, Briefcase, Mail, Phone, BarChart, PieChart as PieChartIcon, ArrowRight, ClipboardCheck, TrendingUp, Download } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart as RechartsBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

const mockEvaluated = [
  { 
    id: 1, 
    name: "Juan Pérez", 
    status: "Completado", 
    score: 85, 
    group: "Operaciones Mina", 
    position: "Operador de Pala", 
    email: "juan.perez@mina.com",
    preDescription: "Juan inició con un desempeño sólido en tareas operativas, pero con oportunidades de mejora en comunicación asertiva y liderazgo de equipo.",
    postDescription: "Después del plan de acción, Juan ha demostrado una mejora significativa en la coordinación con su equipo y ha asumido un rol más proactivo en las reuniones de seguridad.",
    actionPlan: "Programa de Coaching en Liderazgo Operativo"
  },
  { 
    id: 2, 
    name: "María García", 
    status: "En curso", 
    score: 45, 
    group: "Seguridad Industrial", 
    position: "Ingeniera de Seguridad", 
    email: "maria.garcia@mina.com",
    preDescription: "María posee un alto nivel técnico. La evaluación inicial destaca la necesidad de mejorar el manejo de conflictos ante situaciones de alta presión.",
    postDescription: "Se observa una evolución positiva en su capacidad de mediación. El proceso continúa enfocado en la gestión del estrés.",
    actionPlan: "Taller de Resolución de Conflictos y Gestión del Estrés"
  },
  { 
    id: 3, 
    name: "Carlos López", 
    status: "Pendiente", 
    score: 0, 
    group: "Mantenimiento Planta", 
    position: "Técnico Mecánico", 
    email: "carlos.lopez@mina.com",
    preDescription: "Evaluación inicial pendiente de completar. Se requiere diagnóstico de competencias blandas.",
    postDescription: "N/A - En espera de evaluación inicial.",
    actionPlan: "Pendiente de asignar"
  },
  { 
    id: 4, 
    name: "Ana Martínez", 
    status: "Completado", 
    score: 92, 
    group: "Operaciones Mina", 
    position: "Supervisora", 
    email: "ana.martinez@mina.com",
    preDescription: "Ana destaca por su visión estratégica. El enfoque inicial fue potenciar su capacidad de delegación efectiva.",
    postDescription: "Ha logrado delegar tareas críticas con éxito, permitiéndole enfocarse en la optimización de procesos de mina.",
    actionPlan: "Mentoría en Alta Gerencia y Delegación"
  },
  { 
    id: 5, 
    name: "Pedro Ruiz", 
    status: "En curso", 
    score: 60, 
    group: "Logística", 
    position: "Chofer", 
    email: "pedro.ruiz@mina.com",
    preDescription: "Pedro muestra compromiso. La primera evaluación sugiere reforzar el conocimiento detallado de los protocolos de logística internacional.",
    postDescription: "Ha completado los módulos teóricos satisfactoriamente. Se encuentra en etapa de aplicación práctica.",
    actionPlan: "Especialización en Normativa Logística y Transporte"
  },
];

const preRadarData = [
  { subject: 'Liderazgo', A: 70, B: 110, fullMark: 150 },
  { subject: 'Seguridad', A: 65, B: 130, fullMark: 150 },
  { subject: 'Comunicación', A: 60, B: 130, fullMark: 150 },
  { subject: 'Técnico', A: 90, B: 100, fullMark: 150 },
  { subject: 'Puntualidad', A: 85, B: 90, fullMark: 150 },
  { subject: 'Ética', A: 65, B: 85, fullMark: 150 },
];

const postRadarData = [
  { subject: 'Liderazgo', A: 105, B: 110, fullMark: 150 },
  { subject: 'Seguridad', A: 125, B: 130, fullMark: 150 },
  { subject: 'Comunicación', A: 115, B: 130, fullMark: 150 },
  { subject: 'Técnico', A: 100, B: 100, fullMark: 150 },
  { subject: 'Puntualidad', A: 95, B: 90, fullMark: 150 },
  { subject: 'Ética', A: 85, B: 85, fullMark: 150 },
];

const preBarData = [
  { name: 'Ene', valor: 210 },
  { name: 'Feb', valor: 240 },
  { name: 'Mar', valor: 200 },
];

const postBarData = [
  { name: 'Ene', valor: 210 },
  { name: 'Feb', valor: 240 },
  { name: 'Mar', valor: 200 },
  { name: 'Abr', valor: 380 },
  { name: 'May', valor: 450 },
];

const comparisonData = preRadarData.map((item, i) => ({
  subject: item.subject,
  pre: item.A,
  post: postRadarData[i].A,
  fullMark: item.fullMark,
  target: item.B
}));

const TestApplicationPage = () => {
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activePhase, setActivePhase] = useState<'pre' | 'post' | 'comp'>('pre');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completado": return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">Completado</Badge>;
      case "En curso": return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">En curso</Badge>;
      case "Pendiente": return <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 border-slate-500/20 font-bold">Pendiente</Badge>;
      default: return null;
    }
  };

  const handleRowClick = (person: any) => {
    setSelectedPerson(person);
    setIsSheetOpen(true);
    setActivePhase('pre'); // Reset to 'pre' when opening a new person
  };

  // Utility to calculate Delta for comparison
  const calculateDelta = (skill: string) => {
    const pre = preRadarData.find(d => d.subject === skill)?.A || 0;
    const post = postRadarData.find(d => d.subject === skill)?.A || 0;
    const diff = post - pre;
    return {
      value: diff,
      percent: Math.round((diff / pre) * 100)
    };
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-end border-b border-border/40 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Aplicación de Pruebas</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Gestión y seguimiento de evaluaciones de personal y planes de acción.
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 p-2 gap-2 font-bold px-4 rounded-full">
          <ClipboardCheck className="w-4 h-4" />
          PROCESO ACTIVO 2024
        </Badge>
      </div>

      <Tabs defaultValue="evaluacion" className="space-y-6">
        <TabsList className="bg-muted/30 p-1.5 rounded-2xl border border-border/40 w-fit">
          <TabsTrigger value="evaluacion" className="rounded-xl gap-2 px-8 font-black text-xs uppercase tracking-wider h-10">
            <ClipboardCheck className="w-4 h-4" />
            PANEL DE EVALUACIÓN
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evaluacion" className="animate-in fade-in zoom-in-95 duration-500">
          <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-2xl border-none ring-1 ring-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-8 py-8">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Estado de Evaluados</CardTitle>
                <CardDescription className="font-medium text-muted-foreground">Lista de participantes y su progreso actual de competencias.</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 rounded-xl hover:bg-muted/80">
                  <Filter className="h-4 w-4" />
                </Button>
                <div className="relative group">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                  <Input placeholder="Buscar evaluado..." className="pl-10 w-[300px] h-10 bg-background/50 border-border/40 font-bold rounded-xl" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Evaluado</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Grupo</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Puntaje</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-right pr-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvaluated.map((person) => (
                    <TableRow 
                      key={person.id} 
                      className="border-border/40 hover:bg-muted/20 transition-all group cursor-pointer"
                      onClick={() => handleRowClick(person)}
                    >
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20 shadow-sm">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-black text-sm tracking-tight">{person.name}</div>
                            <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{person.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold text-[10px] px-3 py-0.5 rounded-full bg-muted/50 border-border/40 uppercase tracking-tight text-muted-foreground">
                          {person.group}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-1.5 rounded-full bg-muted/40 overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-primary transition-all duration-1000 shadow-sm" 
                              style={{ width: `${person.score}%` }} 
                            />
                          </div>
                          <span className="text-xs font-black">{person.score}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(person.status)}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 px-4 font-black text-xs uppercase tracking-wider text-primary hover:bg-primary/10 hover:text-primary gap-2 rounded-xl"
                        >
                          Dashboard
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Controlled Sheet for Details */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-2xl border-l-border/40 bg-card/90 backdrop-blur-3xl shadow-2xl p-0 overflow-hidden animate-in slide-in-from-right-1/2 duration-700 ease-out">
          {selectedPerson && (
            <div className="flex flex-col h-full">
              {/* Header (Cleaned) */}
              <div className="bg-muted/10 p-10 border-b border-border/40 relative overflow-hidden shrink-0">
                <div className="absolute -top-10 -right-10 p-8 opacity-5">
                  <User className="w-60 h-60" />
                </div>
                <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                  <div className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center p-1.5 border border-primary/20 shadow-2xl">
                    <div className="w-full h-full rounded-[24px] bg-white flex items-center justify-center text-4xl font-black text-primary shadow-inner">
                      {selectedPerson.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <SheetTitle className="text-4xl font-black tracking-tighter">{selectedPerson.name}</SheetTitle>
                    <SheetDescription className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                       {selectedPerson.group} <span className="w-1.5 h-1.5 rounded-full bg-border" /> {selectedPerson.position}
                    </SheetDescription>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-10 overflow-y-auto flex-1 pb-32">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 rounded-3xl bg-muted/20 border border-border/40 space-y-2 hover:bg-background/50 transition-colors group">
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-black tracking-widest text-primary/60">
                      <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                    </div>
                    <div className="text-sm font-black truncate text-foreground/90">{selectedPerson.email}</div>
                  </div>
                  <div className="p-5 rounded-3xl bg-muted/20 border border-border/40 space-y-2 hover:bg-background/50 transition-colors group">
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-black tracking-widest text-primary/60">
                      <Phone className="w-3.5 h-3.5" /> Teléfono Móvil
                    </div>
                    <div className="text-sm font-black text-foreground/90">+51 987 654 321</div>
                  </div>
                </div>

                {/* Seguimiento de Desempeño */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black flex items-center gap-3 tracking-tight">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      {activePhase === 'comp' ? 'Análisis de Evolución (Δ)' : 'Seguimiento Psicológico'}
                    </h4>
                  </div>
                  
                  <div className="flex p-1.5 bg-muted/40 rounded-2xl border border-border/40 gap-1.5">
                    <Button 
                      variant={activePhase === 'pre' ? 'default' : 'ghost'} 
                      className={cn(
                        "flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 transition-all",
                        activePhase === 'pre' ? "bg-white text-primary shadow-xl shadow-primary/5 hover:bg-white" : "text-muted-foreground/60 hover:bg-muted/60"
                      )}
                      onClick={() => setActivePhase('pre')}
                    >
                      D. Inicial (PRE)
                    </Button>
                    <Button 
                      variant={activePhase === 'comp' ? 'default' : 'ghost'} 
                      className={cn(
                        "flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 transition-all",
                        activePhase === 'comp' ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700" : "text-muted-foreground/60 hover:bg-muted/60"
                      )}
                      onClick={() => setActivePhase('comp')}
                    >
                      Comparativa
                    </Button>
                    <Button 
                      variant={activePhase === 'post' ? 'default' : 'ghost'} 
                      className={cn(
                        "flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 transition-all",
                        activePhase === 'post' ? "bg-white text-emerald-600 shadow-xl shadow-emerald-600/5 hover:bg-white" : "text-muted-foreground/60 hover:bg-muted/60"
                      )}
                      onClick={() => setActivePhase('post')}
                    >
                      Fase Final (POST)
                    </Button>
                  </div>

                  <Card className={cn(
                    "border-border/40 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-[32px] border-none ring-1 ring-white/10",
                    activePhase === 'comp' ? "bg-indigo-600 text-white shadow-indigo-600/20" : 
                    activePhase === 'post' ? "bg-emerald-600 text-white shadow-emerald-600/20" :
                    "bg-background/60 backdrop-blur-md"
                  )}>
                    <CardContent className="p-8 space-y-6">
                      {activePhase === 'comp' ? (
                        <div className="flex items-center justify-between gap-10">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-white/20 text-white border-none font-black text-[10px] tracking-widest">KPI EVOLUCIÓN</Badge>
                              <Badge className="bg-emerald-400 text-emerald-900 border-none font-black text-[10px] tracking-widest">ÉXITO</Badge>
                            </div>
                            <h5 className="text-4xl font-black tracking-tighter">Crecimiento: +35.2%</h5>
                            <p className="text-sm font-bold text-indigo-100/90 leading-relaxed italic border-l-2 border-white/20 pl-4 py-1">
                              "Se observa una reducción del 40% en conductas de riesgo autopercibidas. El GAP en Liderazgo se ha cerrado en un 85%."
                            </p>
                          </div>
                          <div className="w-24 h-24 rounded-full bg-white/15 flex items-center justify-center text-3xl font-black shadow-inner border border-white/10 shrink-0 backdrop-blur-lg">
                            Δ
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className={cn(
                            "text-[10px] uppercase font-black tracking-[0.2em]",
                            activePhase === 'post' ? "text-emerald-200" : "text-primary"
                          )}>
                            {activePhase === 'pre' ? 'Diagnóstico Psicológico ABC' : 'Reporte de Impacto Final'}
                          </div>
                          <p className={cn(
                            "text-base leading-relaxed font-medium italic",
                            activePhase === 'post' ? "text-emerald-50/90" : "text-foreground/80"
                          )}>
                            "{activePhase === 'pre' ? selectedPerson.preDescription : selectedPerson.postDescription}"
                          </p>
                        </div>
                      )}

                      <div className={cn(
                        "pt-6 border-t font-black",
                        activePhase === 'comp' ? "border-white/10" : 
                        activePhase === 'post' ? "border-white/10" :
                        "border-border/40"
                      )}>
                        <div className={cn(
                          "text-[10px] uppercase font-black tracking-widest mb-3",
                          activePhase === 'comp' ? "text-indigo-200" : 
                          activePhase === 'post' ? "text-emerald-200" :
                          "text-amber-600"
                        )}>
                          Plan de Acción Especialista
                        </div>
                        <div className={cn(
                          "px-5 py-3 rounded-2xl text-sm font-black flex items-center justify-between group transition-all",
                          activePhase === 'comp' ? "bg-white/10 border border-white/10 text-white" : 
                          activePhase === 'post' ? "bg-white/10 border border-white/10 text-white" :
                          "bg-amber-500/5 border border-amber-500/10 text-amber-900"
                        )}>
                          <div className="flex items-center gap-3">
                            <ClipboardCheck className="w-5 h-5 opacity-70" />
                            {selectedPerson.actionPlan}
                          </div>
                          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Dashboard Individual */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <h4 className="text-xl font-black flex items-center gap-3 tracking-tight">
                      <BarChart className="w-6 h-6 text-primary" />
                      Dashboard de Competencias
                    </h4>
                    {activePhase === 'comp' ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 font-black px-4 py-1.5 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest border-none">Visión DUAL</Badge>
                    ) : (
                      <Badge className="bg-primary hover:bg-primary font-black px-4 py-1.5 shadow-lg shadow-primary/20 text-[10px] uppercase tracking-widest border-none">MODO: {activePhase.toUpperCase()}</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-border/40 bg-background/40 backdrop-blur-md shadow-xl overflow-hidden group rounded-3xl border-none ring-1 ring-white/10">
                      <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-black flex items-center gap-2">
                          <PieChartIcon className="w-3.5 h-3.5" /> {activePhase === 'comp' ? 'PRE (Indigo) vs POST (Verde)' : 'Radar de Competencias'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="75%" 
                            data={activePhase === 'comp' ? comparisonData : activePhase === 'pre' ? preRadarData : postRadarData}
                          >
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: "hsl(var(--foreground))" }} />
                            
                            {activePhase === 'comp' ? (
                              <>
                                <Radar 
                                  name="PRE" 
                                  dataKey="pre" 
                                  stroke="#6366f1" 
                                  fill="#6366f1" 
                                  fillOpacity={0.3} 
                                  strokeWidth={2}
                                />
                                <Radar 
                                  name="POST" 
                                  dataKey="post" 
                                  stroke="#10b981" 
                                  fill="#10b981" 
                                  fillOpacity={0.6} 
                                  strokeWidth={3}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                              </>
                            ) : (
                              <Radar 
                                name="Resultado" 
                                dataKey="A" 
                                stroke={activePhase === 'pre' ? "#6366f1" : "#10b981"} 
                                fill={activePhase === 'pre' ? "#6366f1" : "#10b981"} 
                                fillOpacity={0.6} 
                                strokeWidth={3}
                              />
                            )}
                            
                            <Radar 
                              name="Objetivo" 
                              dataKey={activePhase === 'comp' ? "target" : "B"} 
                              stroke="#94a3b8" 
                              fill="#94a3b8" 
                              fillOpacity={0.05} 
                              strokeWidth={1}
                              strokeDasharray="4 4"
                            />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', background: 'rgba(255,255,255,0.9)', padding: '12px' }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-background/40 backdrop-blur-md shadow-xl overflow-hidden group rounded-3xl border-none ring-1 ring-white/10">
                      <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-black flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5" /> Histórico de Puntaje Absoluto
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={activePhase === 'pre' ? preBarData : postBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis hide domain={[0, 500]} />
                            <Tooltip 
                              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                              contentStyle={{ fontSize: '12px', fontWeight: 900, borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', padding: '12px' }} 
                            />
                            <Bar dataKey="valor" radius={[8, 8, 0, 0]} barSize={28}>
                              {(activePhase === 'pre' ? preBarData : postBarData).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={[
                                  '#6366f1', // Indigo
                                  '#8b5cf6', // Violet
                                  '#ec4899', // Pink
                                  '#f59e0b', // Amber
                                  '#10b981', // Emerald
                                ][index % 5]} />
                              ))}
                            </Bar>
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <Button className="w-full py-8 text-lg font-black shadow-2xl shadow-primary/30 rounded-[32px] gap-3 hover:translate-y-[-4px] transition-all duration-500 bg-primary hover:bg-primary/95 text-primary-foreground border-none ring-1 ring-white/20">
                    Descargar Informe de Cierre (PDF)
                    <Download className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TestApplicationPage;
