import { ArrowLeft, BarChart3, Info, PieChart as PieChartIcon, TrendingUp, UsersRound } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { GroupMetric } from "@/lib/sheets-adapter";

interface DetailViewProps {
  selectedGroup: GroupMetric;
  onBack: () => void;
}

export const DetailView = ({ selectedGroup, onBack }: DetailViewProps) => (
  <div className="space-y-6 md:space-y-8 pb-10 animate-in fade-in zoom-in-95 duration-500 ease-out fill-mode-forwards px-4 md:px-0">
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onBack}
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
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">{selectedGroup.name}</h1>
        <p className="text-muted-foreground text-sm md:text-lg font-medium flex items-center gap-2">
          <Info className="w-3.5 h-3.5 md:w-4 md:h-4" /> Análisis profundo de desempeño
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
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
            <div className="text-3xl sm:text-5xl lg:text-7xl font-black text-primary tracking-tighter">{selectedGroup.avgScore}%</div>
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
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
                <Radar
                  name="Fuerza del Grupo"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.4}
                  strokeWidth={3}
                />
                <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

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
              {selectedGroup.genderData.map((gender) => (
                <div key={gender.name} className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-tighter">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: gender.color }} />
                  <span className="text-muted-foreground">{gender.name}: {gender.value}</span>
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
              La empresa <strong>{selectedGroup.name}</strong> presenta un avance del {selectedGroup.avgScore}%.
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
