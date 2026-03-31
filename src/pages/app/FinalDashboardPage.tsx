import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Target, 
  Zap, 
  ShieldCheck, 
  Award,
  Layers,
  History,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Legend 
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const comparisonData = [
  { 
    name: "Operaciones Mina", 
    pre: 65, 
    post: 82, 
    delta: 17,
    radar: [
      { subject: 'Liderazgo', pre: 80, post: 110 },
      { subject: 'Seguridad', pre: 70, post: 130 },
      { subject: 'Comunicación', pre: 90, post: 100 },
      { subject: 'Técnico', pre: 110, post: 120 },
      { subject: 'Ética', pre: 100, post: 110 },
    ]
  },
  { 
    name: "Seguridad Industrial", 
    pre: 78, 
    post: 94, 
    delta: 16,
    radar: [
      { subject: 'Liderazgo', pre: 90, post: 120 },
      { subject: 'Seguridad', pre: 120, post: 145 },
      { subject: 'Comunicación', pre: 80, post: 110 },
      { subject: 'Técnico', pre: 70, post: 95 },
      { subject: 'Ética', pre: 110, post: 135 },
    ]
  },
  { 
    name: "Mantenimiento Planta", 
    pre: 60, 
    post: 75, 
    delta: 15,
    radar: [
      { subject: 'Liderazgo', pre: 70, post: 95 },
      { subject: 'Seguridad', pre: 85, post: 110 },
      { subject: 'Comunicación', pre: 65, post: 85 },
      { subject: 'Técnico', pre: 120, post: 135 },
      { subject: 'Ética', pre: 90, post: 105 },
    ]
  },
  { 
    name: "Geología", 
    pre: 82, 
    post: 91, 
    delta: 9,
    radar: [
      { subject: 'Liderazgo', pre: 100, post: 125 },
      { subject: 'Seguridad', pre: 90, post: 110 },
      { subject: 'Comunicación', pre: 110, post: 125 },
      { subject: 'Técnico', pre: 115, post: 125 },
      { subject: 'Ética', pre: 120, post: 135 },
    ]
  }
];

const FinalDashboardPage = () => {
  const [isCompareMode, setIsCompareMode] = useState(true);

  const avgPre = Math.round(comparisonData.reduce((acc, d) => acc + d.pre, 0) / comparisonData.length);
  const avgPost = Math.round(comparisonData.reduce((acc, d) => acc + d.post, 0) / comparisonData.length);
  const globalDelta = avgPost - avgPre;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Comparison Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
            Dashboard Final <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black">POST-ACCIÓN</Badge>
          </h1>
          <p className="text-muted-foreground text-lg font-medium tracking-tight">Resultados finales y comparativa de impacto organizacional</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card/40 backdrop-blur-md border border-border/40 p-4 rounded-[2rem] shadow-xl ring-1 ring-white/5 transition-all hover:shadow-emerald-500/5">
          <div className="flex items-center space-x-4">
            <Label htmlFor="compare-mode" className={cn("text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer", !isCompareMode ? "text-primary" : "text-muted-foreground/60")}>Vista Actual</Label>
            <Switch 
              id="compare-mode" 
              checked={isCompareMode} 
              onCheckedChange={setIsCompareMode}
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label htmlFor="compare-mode" className={cn("text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer", isCompareMode ? "text-emerald-500" : "text-muted-foreground/60")}>Modo Comparativo</Label>
          </div>
        </div>
      </div>

      {/* Improvement KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className={cn("border-border/40 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden group transition-all duration-500", isCompareMode ? "border-b-4 border-b-emerald-500 opacity-100 scale-100" : "opacity-60 scale-[0.98]")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Mejora Global (Δ)</p>
                <p className="text-5xl font-black text-emerald-600 tracking-tighter">
                  {isCompareMode ? `+${globalDelta}%` : `${avgPost}%`}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:rotate-12 transition-transform capitalize">
                {isCompareMode ? <TrendingUp className="w-8 h-8" /> : <Award className="w-8 h-8" />}
              </div>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-4 flex items-center gap-1.5 font-mono">
              <History className="w-3 h-3" /> {isCompareMode ? `Baseline: ${avgPre}% → Actual: ${avgPost}%` : `Puntaje Promedio Actual`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Cierre de Brechas</p>
                <p className="text-5xl font-black text-indigo-600 tracking-tighter">92%</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:-rotate-12 transition-transform">
                <Target className="w-8 h-8" />
              </div>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-4 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3 h-3" /> Objetivos de acción cumplidos
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Certificación</p>
                <p className="text-5xl font-black text-amber-600 tracking-tighter">Gold</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-4 flex items-center gap-1.5 font-mono">
              <Award className="w-3 h-3" /> Estándar Internacional
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts: Overlaid Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black tracking-tight">Comparativa de Competencias</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {isCompareMode ? "Superposición de radar PRE vs POST" : "Desempeño actual por competencia"}
              </CardDescription>
            </div>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", isCompareMode ? "bg-emerald-500/20 text-emerald-600" : "bg-primary/10 text-primary")}>
              <Zap className="w-5 h-5" />
            </div>
          </div>
          
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData[0].radar}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
                
                {isCompareMode && (
                  <Radar 
                    name="Estado Inicial (PRE)" 
                    dataKey="pre" 
                    stroke="hsl(var(--muted-foreground))" 
                    fill="hsl(var(--muted-foreground))" 
                    fillOpacity={0.15} 
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                )}
                
                <Radar 
                  name={isCompareMode ? "Estado Final (POST)" : "Resultado Actual"} 
                  dataKey="post" 
                  stroke="hsl(142, 71%, 45%)" 
                  fill="hsl(142, 71%, 45%)" 
                  fillOpacity={0.4} 
                  strokeWidth={3}
                />
                
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Group Comparison Bars */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl p-8 space-y-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">Crecimiento por Unidad</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {isCompareMode ? "Comparación directa de puntajes PRE vs POST" : "Puntaje final acumulado por grupo"}
            </CardDescription>
          </div>
          
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical" barGap={8}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={140} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }}
                />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px' }} />
                
                {isCompareMode && (
                  <Bar 
                    dataKey="pre" 
                    name="Inicial" 
                    fill="hsl(var(--muted))" 
                    radius={[0, 4, 4, 0]} 
                    barSize={isCompareMode ? 12 : 20}
                    className="transition-all duration-500"
                  />
                )}
                
                <Bar 
                  dataKey="post" 
                  name={isCompareMode ? "Final" : "Puntaje"} 
                  fill="hsl(142, 71%, 45%)" 
                  radius={[0, 4, 4, 0]} 
                  barSize={isCompareMode ? 12 : 20}
                  className="transition-all duration-500"
                />
                
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Comparison Detail Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> Detalles de Mejora por Grupo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {comparisonData.map((group) => (
            <Card key={group.name} className="border-border/40 bg-background/60 backdrop-blur-md shadow-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black tracking-tight">{group.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {isCompareMode ? "Crecimiento" : "Puntaje Final"}
                    </p>
                    <p className={cn("text-3xl font-black tracking-tighter transition-all duration-500", isCompareMode ? "text-emerald-600" : "text-foreground")}>
                      {isCompareMode ? `+${group.delta}%` : `${group.post}%`}
                    </p>
                  </div>
                  {isCompareMode && (
                    <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600 animate-in zoom-in-50 duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-black uppercase">
                    <span className="text-muted-foreground/60 tracking-wider">
                      {isCompareMode ? `PRE: ${group.pre}%` : "Avance Grupal"}
                    </span>
                    <span className="text-foreground tracking-wider">
                      {isCompareMode ? `POST: ${group.post}%` : `${group.post}%`}
                    </span>
                  </div>
                  <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-muted/30">
                    {isCompareMode && (
                      <div className="h-full bg-muted/60 transition-all duration-700 ease-in-out" style={{ width: `${group.pre}%` }} />
                    )}
                    <div 
                      className={cn("h-full transition-all duration-1000 ease-out", isCompareMode ? "bg-emerald-500" : "bg-primary")} 
                      style={{ width: isCompareMode ? `${group.delta}%` : `${group.post}%` }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalDashboardPage;
