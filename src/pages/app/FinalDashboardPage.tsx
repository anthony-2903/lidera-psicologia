import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFinalDashboardData } from "@/lib/sheets-adapter";
import { Users, AlertCircle, RefreshCw, BarChart3, TrendingUp, Presentation, BrainCircuit, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const SHEET_ID = "1abuYNzrdEH_6YCzlq31SAA9zLrbov0kt03gWNQPKUeU";

// --- Paletas ---
const STACK_COLORS_5 = ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#3b82f6"];
const TEAM_COLORS_4 = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
const PROJ_COLORS_3 = ["#ef4444", "#f59e0b", "#10b981"];
const LEAD_COLORS_4 = ["#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];

// Helper para Legend
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

export default function FinalDashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['finalDashboard', SHEET_ID],
    queryFn: () => fetchFinalDashboardData(SHEET_ID),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          <ActivitySquare className="w-16 h-16 text-primary animate-pulse relative z-10" />
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-sm animate-pulse">Procesando Inteligencia Psicológica...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Error de Conexión</h2>
          <p className="text-muted-foreground max-w-md font-medium text-lg">No pudimos procesar los datos de las métricas psicológicas.</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2 px-8 h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
          <RefreshCw className="w-5 h-5" /> Reintentar Conexión
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-forwards px-2 md:px-0">
      
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-sm p-8 md:p-12 mt-4">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-slow-pan pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
              <BrainCircuit className="w-4 h-4" />
              Resultados Globales de Sincronización
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
              Dashboard <span className="text-primary">Psicológico</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-xl">
              Análisis profundo de personalidad, trabajo en equipo y perfil conductual basado en data en tiempo real.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-4">
            <Card className="border-border/40 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden rounded-3xl min-w-[200px]">
              <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Participantes Evaluados</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-black text-foreground tabular-nums tracking-tighter">{data.totalEvaluated}</span>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" onClick={() => refetch()} className="gap-2 rounded-xl text-xs h-10 border-border/50 bg-background/50 backdrop-blur-md shadow-sm">
              <RefreshCw className={isFetching ? "animate-spin w-4 h-4" : "w-4 h-4"} /> Sincronizar Datos
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PERSONALITY BAR CHART */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group">
          <CardHeader className="bg-gradient-to-r from-card to-transparent border-b border-border/50 pb-6 p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                <BarChart3 className="w-5 h-5" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">Perfil de Personalidad</CardTitle>
            </div>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Big Five: Espectro de 5 niveles</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.personality} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: "hsl(var(--foreground))" }} width={120} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} wrapperClassName="rounded-xl shadow-2xl border-none outline-none font-bold" />
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

        {/* MOTIVATIONAL BAR CHART */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group">
          <CardHeader className="bg-gradient-to-r from-card to-transparent border-b border-border/50 pb-6 p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">Perfil Motivacional</CardTitle>
            </div>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Factores intrínsecos y extrínsecos</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.motivational} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }} width={100} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} wrapperClassName="rounded-xl shadow-2xl border-none outline-none font-bold" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TEAMWORK - FULL WIDTH */}
        <Card className="lg:col-span-3 border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group">
          <CardHeader className="bg-gradient-to-r from-card to-transparent border-b border-border/50 pb-6 p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">Trabajo en Equipo</CardTitle>
            </div>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Roles de Belbin: Distribución de talentos</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.teamwork} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} wrapperClassName="rounded-xl shadow-2xl border-none outline-none font-bold" />
                <Legend content={renderLegend} verticalAlign="top" height={36} />
                <Bar dataKey="BAJO" stackId="a" fill={TEAM_COLORS_4[0]} radius={[0, 0, 8, 8]} />
                <Bar dataKey="MEDIO" stackId="a" fill={TEAM_COLORS_4[1]} />
                <Bar dataKey="ALTO" stackId="a" fill={TEAM_COLORS_4[2]} />
                <Bar dataKey="MUY ALTO" stackId="a" fill={TEAM_COLORS_4[3]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PROYECTIVO */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <CardHeader className="p-8 pb-0 text-center">
            <CardTitle className="text-xl font-black tracking-tight">Perfil Proyectivo</CardTitle>
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest mt-1">4 Ejes de Evaluación</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.projective}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800 }} dy={5} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', fontWeight: 'bold' }} />
                <Bar dataKey="RIESGO" stackId="a" fill={PROJ_COLORS_3[0]} radius={[0, 0, 6, 6]} />
                <Bar dataKey="EN OBSERVACION" stackId="a" fill={PROJ_COLORS_3[1]} />
                <Bar dataKey="ADECUADO" stackId="a" fill={PROJ_COLORS_3[2]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* LIDERAZGO */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <CardHeader className="p-8 pb-0 text-center">
            <CardTitle className="text-xl font-black tracking-tight">Liderazgo</CardTitle>
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest mt-1">Estilos de Gerencia</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.leadership} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" cx="50%" cy="50%">
                  {data.leadership.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={LEAD_COLORS_4[index % LEAD_COLORS_4.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CONDUCTUAL */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <CardHeader className="p-8 pb-0 text-center">
            <CardTitle className="text-xl font-black tracking-tight">Perfil Conductual</CardTitle>
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest mt-1">Riesgos Comportamentales</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.behavioral} innerRadius={0} outerRadius={90} dataKey="value" cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  style={{ fontSize: '10px', fontWeight: 'bold', fill: 'hsl(var(--foreground))' }}>
                  {data.behavioral.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PROJ_COLORS_3[index % PROJ_COLORS_3.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
