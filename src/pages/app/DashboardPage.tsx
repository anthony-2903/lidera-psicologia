import { useState } from "react";
import { Users, UsersRound, CheckCircle, Calendar, Clock, AlertCircle, TrendingUp, BarChart3, PieChart as PieChartIcon, Info, ChevronLeft, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const groupMetrics = [
  { 
    id: 1, 
    name: "Operaciones Mina", 
    total: 12, 
    completed: 8, 
    inProgress: 3, 
    pending: 1,
    avgScore: 78,
    color: "hsl(212, 52%, 25%)",
    genderData: [
      { name: "Masculino", value: 10, color: "hsl(212, 52%, 25%)" },
      { name: "Femenino", value: 2, color: "hsl(38, 92%, 50%)" },
    ],
    radarData: [
      { subject: 'Liderazgo', A: 120, fullMark: 150 },
      { subject: 'Seguridad', A: 98, fullMark: 150 },
      { subject: 'Comunicación', A: 86, fullMark: 150 },
      { subject: 'Técnico', A: 99, fullMark: 150 },
      { subject: 'Ética', A: 65, fullMark: 150 },
    ]
  },
  { 
    id: 2, 
    name: "Seguridad Industrial", 
    total: 8, 
    completed: 4, 
    inProgress: 2, 
    pending: 2,
    avgScore: 82,
    color: "hsl(142, 71%, 45%)",
    genderData: [
      { name: "Masculino", value: 4, color: "hsl(212, 52%, 25%)" },
      { name: "Femenino", value: 4, color: "hsl(38, 92%, 50%)" },
    ],
    radarData: [
      { subject: 'Liderazgo', A: 110, fullMark: 150 },
      { subject: 'Seguridad', A: 145, fullMark: 150 },
      { subject: 'Comunicación', A: 95, fullMark: 150 },
      { subject: 'Técnico', A: 80, fullMark: 150 },
      { subject: 'Ética', A: 130, fullMark: 150 },
    ]
  },
  { 
    id: 3, 
    name: "Mantenimiento Planta", 
    total: 15, 
    completed: 10, 
    inProgress: 4, 
    pending: 1,
    avgScore: 75,
    color: "hsl(38, 92%, 50%)",
    genderData: [
      { name: "Masculino", value: 13, color: "hsl(212, 52%, 25%)" },
      { name: "Femenino", value: 2, color: "hsl(38, 92%, 50%)" },
    ],
    radarData: [
      { subject: 'Liderazgo', A: 90, fullMark: 150 },
      { subject: 'Seguridad', A: 110, fullMark: 150 },
      { subject: 'Comunicación', A: 70, fullMark: 150 },
      { subject: 'Técnico', A: 140, fullMark: 150 },
      { subject: 'Ética', A: 100, fullMark: 150 },
    ]
  },
  { 
    id: 4, 
    name: "Geología", 
    total: 7, 
    completed: 2, 
    inProgress: 4, 
    pending: 1,
    avgScore: 90,
    color: "hsl(262, 83%, 58%)",
    genderData: [
      { name: "Masculino", value: 3, color: "hsl(212, 52%, 25%)" },
      { name: "Femenino", value: 4, color: "hsl(38, 92%, 50%)" },
    ],
    radarData: [
      { subject: 'Liderazgo', A: 130, fullMark: 150 },
      { subject: 'Seguridad', A: 100, fullMark: 150 },
      { subject: 'Comunicación', A: 120, fullMark: 150 },
      { subject: 'Técnico', A: 110, fullMark: 150 },
      { subject: 'Ética', A: 140, fullMark: 150 },
    ]
  },
  { 
    id: 5, 
    name: "Logística", 
    total: 3, 
    completed: 3, 
    inProgress: 0, 
    pending: 0,
    avgScore: 88,
    color: "hsl(10, 81%, 59%)",
    genderData: [
      { name: "Masculino", value: 2, color: "hsl(212, 52%, 25%)" },
      { name: "Femenino", value: 1, color: "hsl(38, 92%, 50%)" },
    ],
    radarData: [
      { subject: 'Liderazgo', A: 100, fullMark: 150 },
      { subject: 'Seguridad', A: 120, fullMark: 150 },
      { subject: 'Comunicación', A: 130, fullMark: 150 },
      { subject: 'Técnico', A: 90, fullMark: 150 },
      { subject: 'Ética', A: 110, fullMark: 150 },
    ]
  }
];

const summaryData = {
  totalGroups: groupMetrics.length,
  totalEvaluated: groupMetrics.reduce((acc, g) => acc + g.total, 0),
  totalCompleted: groupMetrics.reduce((acc, g) => acc + g.completed, 0),
  avgSystemScore: Math.round(groupMetrics.reduce((acc, g) => acc + g.avgScore, 0) / groupMetrics.length)
};

const DashboardPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<typeof groupMetrics[0] | null>(null);
  const [view, setView] = useState<'grid' | 'detail'>('grid');

  const handleGroupClick = (group: typeof groupMetrics[0]) => {
    setSelectedGroup(group);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setView('grid');
    setSelectedGroup(null);
  };

  if (view === 'detail' && selectedGroup) {
    return (
      <div className="space-y-8 pb-10 animate-in fade-in zoom-in-95 duration-500 ease-out fill-mode-forwards">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="group/back gap-2 text-muted-foreground hover:text-primary transition-all p-0 h-auto font-black uppercase tracking-widest text-[10px]"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover/back:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Volver al Dashboard
          </Button>
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-black uppercase tracking-tighter text-xs">
            Vista Detallada
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner shrink-0 scale-110">
            <UsersRound className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">{selectedGroup.name}</h1>
            <p className="text-muted-foreground text-lg font-medium flex items-center gap-2">
              <Info className="w-4 h-4" /> Análisis profundo de desempeño y métricas grupales
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Metrics Card */}
          <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Estado de Ejecución</h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-emerald-600">Completado</span>
                      <span className="text-foreground">{selectedGroup.completed} de {selectedGroup.total}</span>
                    </div>
                    <Progress value={(selectedGroup.completed / selectedGroup.total) * 100} className="h-2 bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-amber-600">En Curso</span>
                      <span className="text-foreground">{selectedGroup.inProgress} de {selectedGroup.total}</span>
                    </div>
                    <Progress value={(selectedGroup.inProgress / selectedGroup.total) * 100} className="h-2 bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-red-600">Sin Iniciar</span>
                      <span className="text-foreground">{selectedGroup.pending} de {selectedGroup.total}</span>
                    </div>
                    <Progress value={(selectedGroup.pending / selectedGroup.total) * 100} className="h-2 bg-muted" />
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center border border-primary/10">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Puntaje Grupal</div>
                <div className="text-7xl font-black text-primary tracking-tighter">{selectedGroup.avgScore}%</div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary/80">
                  <TrendingUp className="w-4 h-4" />
                  Supera el promedio global
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Radar de Competencias Grupales</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={selectedGroup.radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
                    <Radar 
                      name="Fuerza del Grupo" 
                      dataKey="A" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.4} 
                      strokeWidth={3}
                    />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Side Panels */}
          <div className="space-y-8">
            <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl p-6">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <PieChartIcon className="w-3 h-3" /> Distribución Género
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={selectedGroup.genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        paddingAngle={8}
                      >
                        {selectedGroup.genderData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center flex-wrap gap-4 mt-4">
                  {selectedGroup.genderData.map((g) => (
                    <div key={g.name} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                      <span className="text-muted-foreground">{g.name}: {g.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-indigo-600 shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black leading-tight">Insight Estratégico</h3>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                  Este grupo muestra un desempeño excepcional en <strong>Seguridad</strong>, superando el estándar organizacional en un 12%. Recomendado como mentores transversales.
                </p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest py-6 rounded-2xl transition-all">
                  Generar Reporte PDF
                </Button>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-forwards">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Dashboard General</h1>
          <p className="text-muted-foreground text-lg font-medium">Análisis de desempeño por grupos de trabajo</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-2xl">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-primary">Actualizado hoy</span>
        </div>
      </div>

      {/* Primary Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Grupos Activos", value: summaryData.totalGroups, icon: UsersRound, color: "bg-blue-500/10 text-blue-600" },
          { label: "Participantes Totales", value: summaryData.totalEvaluated, icon: Users, color: "bg-indigo-500/10 text-indigo-600" },
          { label: "Promedio General", value: `${summaryData.avgSystemScore}%`, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl ring-1 ring-white/5 overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{kpi.label}</p>
                  <p className="text-4xl font-black text-foreground tabular-nums group-hover:scale-105 transition-transform duration-500 origin-left">
                    {kpi.value}
                  </p>
                </div>
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500", kpi.color)}>
                  <kpi.icon className="w-7 h-7" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Specific Dashboards */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight">Desglose por Grupos</h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {groupMetrics.map((group) => {
            const completionRate = Math.round((group.completed / group.total) * 100);
            
            return (
              <Card 
                key={group.id} 
                onClick={() => handleGroupClick(group)}
                className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-500 cursor-pointer group/card active:scale-[0.98]"
              >
                <div className="h-1.5 w-full" style={{ backgroundColor: `${group.color}20` }}>
                  <div className="h-full transition-all duration-1000" style={{ width: `${completionRate}%`, backgroundColor: group.color }} />
                </div>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black tracking-tight group-hover/card:text-primary transition-colors">{group.name}</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      {group.total} Participantes • <Info className="w-3 h-3 text-primary/40" /> Click para detalles
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="px-3 py-1 font-black text-lg border-primary/20 text-primary bg-primary/5">
                    {completionRate}% <span className="text-[10px] ml-1 opacity-60">Listo</span>
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                  {/* Status Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                        <CheckCircle className="w-3 h-3" /> Completados
                      </div>
                      <div className="text-xl font-black text-emerald-700">{group.completed}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-600">
                        <Clock className="w-3 h-3" /> En Curso
                      </div>
                      <div className="text-xl font-black text-amber-700">{group.inProgress}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-600">
                        <AlertCircle className="w-3 h-3" /> Pendientes
                      </div>
                      <div className="text-xl font-black text-red-700">{group.pending}</div>
                    </div>
                  </div>

                  {/* Distribution Chart */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Balance Operativo</span>
                      <span className="text-xs font-black text-primary">Score Promedio: {group.avgScore}%</span>
                    </div>
                    <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted/30">
                      <div className="h-full bg-emerald-500" style={{ width: `${(group.completed / group.total) * 100}%` }} />
                      <div className="h-full bg-amber-500 border-l-2 border-white/10" style={{ width: `${(group.inProgress / group.total) * 100}%` }} />
                      <div className="h-full bg-red-500 border-l-2 border-white/10" style={{ width: `${(group.pending / group.total) * 100}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
