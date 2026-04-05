import { useState, useMemo } from "react";
import { Users, UsersRound, CheckCircle, Calendar, Clock, AlertCircle, TrendingUp, BarChart3, PieChart as PieChartIcon, Info, ChevronLeft, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchSheetData, GroupMetric } from "@/lib/sheets-adapter";

const SHEET_ID = "1abuYNzrdEH_6YCzlq31SAA9zLrbov0kt03gWNQPKUeU";

const DashboardPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<GroupMetric | null>(null);
  const [view, setView] = useState<'grid' | 'detail'>('grid');

  const { data: groupMetrics = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['sheetData', SHEET_ID],
    queryFn: () => fetchSheetData(SHEET_ID),
  });

  const summaryData = useMemo(() => {
    if (!groupMetrics.length) return { totalGroups: 0, totalEvaluated: 0, totalCompleted: 0, avgSystemScore: 0 };
    
    return {
      totalGroups: groupMetrics.length,
      totalEvaluated: groupMetrics.reduce((acc, g) => acc + g.total, 0),
      totalCompleted: groupMetrics.reduce((acc, g) => acc + g.completed, 0),
      avgSystemScore: Math.round(groupMetrics.reduce((acc, g) => acc + g.avgScore, 0) / groupMetrics.length)
    };
  }, [groupMetrics]);

  const handleGroupClick = (group: GroupMetric) => {
    setSelectedGroup(group);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setView('grid');
    setSelectedGroup(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Conectando con Google Sheets...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">Error de Conexión</h2>
          <p className="text-muted-foreground max-w-md">No pudimos obtener los datos del Google Sheet. Asegúrate de que el documento esté compartido.</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2 px-8">
          <RefreshCw className="w-4 h-4" /> Reintentar
        </Button>
      </div>
    );
  }

  if (view === 'detail' && selectedGroup) {
    return (
      <div className="space-y-6 md:space-y-8 pb-10 animate-in fade-in zoom-in-95 duration-500 ease-out fill-mode-forwards px-2 md:px-0">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="group/back gap-2 text-muted-foreground hover:text-primary transition-all p-0 h-auto font-black uppercase tracking-widest text-[10px]"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover/back:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Volver
          </Button>
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-black uppercase tracking-tighter text-[10px]">
            Vista Detallada
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner shrink-0 scale-100 md:scale-110">
            <UsersRound className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">{selectedGroup.name}</h1>
            <p className="text-muted-foreground text-sm md:text-lg font-medium flex items-center gap-2">
              <Info className="w-3.5 h-3.5 md:w-4 md:h-4" /> Análisis profundo de desempeño
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Metrics Card */}
          <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-5 md:space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estado de Ejecución</h3>
                <div className="space-y-4 md:space-y-5">
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-emerald-600">Completado</span>
                      <span className="text-foreground">{selectedGroup.completed} de {selectedGroup.total}</span>
                    </div>
                    <Progress value={(selectedGroup.completed / selectedGroup.total) * 100} className="h-2 bg-muted" />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-amber-600">En Curso</span>
                      <span className="text-foreground">{selectedGroup.inProgress} de {selectedGroup.total}</span>
                    </div>
                    <Progress value={(selectedGroup.inProgress / selectedGroup.total) * 100} className="h-2 bg-muted" />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-red-600">Sin Iniciar</span>
                      <span className="text-foreground">{selectedGroup.pending} de {selectedGroup.total}</span>
                    </div>
                    <Progress value={(selectedGroup.pending / selectedGroup.total) * 100} className="h-2 bg-muted" />
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 flex flex-col items-center justify-center text-center border border-primary/10">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Avance Grupal</div>
                <div className="text-5xl md:text-6xl lg:text-7xl font-black text-primary tracking-tighter">{selectedGroup.avgScore}%</div>
                <div className="mt-3 md:mt-4 flex items-center gap-2 text-[10px] md:text-xs font-bold text-primary/80">
                  <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Basado en estado de ejecución
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 md:mb-6">Radar de Competencias Grupales</h3>
              <div className="h-[250px] md:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={selectedGroup.radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, md: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
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
          <div className="space-y-6 md:space-y-8">
            <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl p-5 md:p-6">
              <CardHeader className="p-0 pb-4 md:pb-6">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <PieChartIcon className="w-3 h-3" /> Distribución Género
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[150px] md:h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={selectedGroup.genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
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
                <div className="flex justify-center flex-wrap gap-3 md:gap-4 mt-3 md:mt-4">
                  {selectedGroup.genderData.map((g) => (
                    <div key={g.name} className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-tighter">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                      <span className="text-muted-foreground">{g.name}: {g.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-indigo-600 shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-3 md:space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-black leading-tight">Insight Estratégico</h3>
                <p className="text-indigo-50 text-xs md:text-sm font-medium leading-relaxed">
                  El área de <strong>{selectedGroup.name}</strong> presenta un avance del {selectedGroup.avgScore}%.
                </p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase text-[9px] md:text-[10px] tracking-widest py-4 md:py-6 rounded-xl md:rounded-2xl transition-all">
                  Generar Reporte PDF
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-forwards px-0 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-foreground leading-none">Dashboard General</h1>
          <p className="text-muted-foreground text-xs md:text-lg font-medium">Análisis de desempeño agrupado</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl text-[10px] md:text-xs h-8 md:h-10">
            <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} /> Sincronizar
          </Button>
          <div className="hidden sm:flex items-center gap-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Sync</span>
          </div>
        </div>
      </div>

      {/* Primary Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Áreas Activas", value: summaryData.totalGroups, icon: UsersRound, color: "bg-blue-500/10 text-blue-600" },
          { label: "Participantes Totales", value: summaryData.totalEvaluated, icon: Users, color: "bg-indigo-500/10 text-indigo-600" },
          { label: "Promedio General", value: `${summaryData.avgSystemScore}%`, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden group">
            <CardContent className="p-4 md:p-6 relative">
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-0.5">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{kpi.label}</p>
                  <p className="text-2xl md:text-4xl font-black text-foreground tabular-nums group-hover:scale-105 transition-transform duration-500 origin-left">
                    {kpi.value}
                  </p>
                </div>
                <div className={cn("w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500", kpi.color)}>
                  <kpi.icon className="w-5 h-5 md:w-7 h-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Specific Dashboards */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BarChart3 className="w-4 h-4 md:w-5 h-5" />
          </div>
          <h2 className="text-base md:text-xl font-black uppercase tracking-tight">Desglose por Áreas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {groupMetrics.map((group) => {
            const completionRate = Math.round((group.completed / group.total) * 100);
            
            return (
              <Card 
                key={group.id} 
                onClick={() => handleGroupClick(group)}
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
    </div>
  );
};

export default DashboardPage;
