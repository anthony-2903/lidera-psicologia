import {
  Activity,
  Brain,
  MessageSquare,
  Radar as RadarIcon,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DimensionesEntry } from "@/lib/sheets-adapter";
import { scoreByType } from "../../diagnostico-psicosocial/utils";

interface ResultsGeneralTabProps {
  entries: DimensionesEntry[];
  totalProgrammed: number;
  appliedCount: number;
}

const CHART_COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#64748b"];

const normalize = (value: string | undefined) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

const avg = (values: number[]) =>
  values.length ? Math.round(values.reduce((acc, value) => acc + value, 0) / values.length) : 0;

const percentOf = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const distributionFromText = (
  entries: DimensionesEntry[],
  accessor: (entry: DimensionesEntry) => string | undefined,
  categories: string[]
) => {
  const counts = new Map(categories.map((category) => [category, 0]));
  let unknown = 0;

  entries.forEach((entry) => {
    const text = normalize(accessor(entry));
    const matched = categories.find((category) => text.includes(normalize(category)));
    if (matched) counts.set(matched, (counts.get(matched) || 0) + 1);
    else unknown += 1;
  });

  const rows = Array.from(counts.entries())
    .filter(([, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      value,
      percentage: percentOf(value, entries.length),
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

  if (unknown > 0) {
    rows.push({
      name: "Sin dato",
      value: unknown,
      percentage: percentOf(unknown, entries.length),
      color: "#cbd5e1",
    });
  }

  return rows;
};

const levelDistribution = (entries: DimensionesEntry[], accessor: (entry: DimensionesEntry) => string) => {
  const order = ["Bajo", "Medio", "Alto"];
  return order.map((name, index) => {
    const value = entries.filter((entry) => normalize(accessor(entry)) === normalize(name)).length;
    return {
      name,
      value,
      percentage: percentOf(value, entries.length),
      color: ["#ef4444", "#f59e0b", "#16a34a"][index],
    };
  });
};

const MiniKpi = ({ label, value, helper }: { label: string; value: string | number; helper: string }) => (
  <Card className="rounded-lg border bg-white shadow-sm">
    <CardContent className="p-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{helper}</p>
    </CardContent>
  </Card>
);

const DonutPanel = ({
  title,
  icon: Icon,
  data,
  insight,
}: {
  title: string;
  icon: typeof Activity;
  data: { name: string; value: number; percentage: number; color: string }[];
  insight: string;
}) => (
  <Card className="rounded-lg border bg-white shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-base font-black">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="h-[220px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={52} outerRadius={82} dataKey="value" paddingAngle={4}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate text-xs font-black uppercase text-slate-700">{item.name}</span>
            </div>
            <Badge variant="outline" className="rounded-md bg-white text-[10px] font-black">
              {item.percentage}%
            </Badge>
          </div>
        ))}
        <p className="rounded-lg border bg-slate-50 p-3 text-xs font-semibold leading-5 text-muted-foreground">
          {insight}
        </p>
      </div>
    </CardContent>
  </Card>
);

const BarPanel = ({
  title,
  icon: Icon,
  data,
}: {
  title: string;
  icon: typeof Activity;
  data: { name: string; value: number; percentage: number; color: string }[];
}) => (
  <Card className="rounded-lg border bg-white shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base font-black">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 42, bottom: 8, left: 18 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.18} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={24}>
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(value: number) => `${value}%`}
                style={{ fontSize: "11px", fontWeight: 900, fill: "hsl(var(--muted-foreground))" }}
              />
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export const ResultsGeneralTab = ({ entries, totalProgrammed, appliedCount }: ResultsGeneralTabProps) => {
  const coverage = percentOf(appliedCount, totalProgrammed);
  const dimensionScores = [
    { dimension: "Liderazgo", score: avg(entries.map((entry) => entry.puntuacionLiderazgo)) },
    { dimension: "Percepción", score: avg(entries.map((entry) => entry.puntuacionPercepcion)) },
    { dimension: "Cultura", score: avg(entries.map((entry) => scoreByType(entry.culturaReport?.tipo, "cultura"))) },
    { dimension: "Comunicación", score: avg(entries.map((entry) => scoreByType(entry.comunicacionReport?.tipo, "comunicacion"))) },
    { dimension: "Rol Equipo", score: avg(entries.map((entry) => scoreByType(entry.rolEquipoReport?.tipo, "rol"))) },
    { dimension: "Motivación", score: avg(entries.map((entry) => scoreByType(entry.motivacionReport?.tipo, "motivacion"))) },
  ];

  const motivation = distributionFromText(entries, (entry) => entry.motivacionReport?.tipo, ["Extrínseca", "Intrínseca"]);
  const roleGroups = distributionFromText(entries, (entry) => entry.rolEquipoReport?.tipo, ["Acción", "Sociales", "Mentales"]);
  const leadership = distributionFromText(entries, (entry) => entry.liderazgoReport?.tipo, ["Directivo", "Coaching", "Soporte", "Empowerment"]);
  const culture = distributionFromText(entries, (entry) => entry.culturaReport?.tipo, ["Reactiva", "Dependiente", "Independiente", "Interdependiente"]);
  const communication = distributionFromText(entries, (entry) => entry.comunicacionReport?.tipo, ["Asertiva", "Directa", "Colaborativa", "Funcional"]);
  const risk = distributionFromText(entries, (entry) => entry.percepcionReport?.tipo, ["Reactivo", "Normativo", "Cauteloso", "Proactivo"]);
  const leadershipLevels = levelDistribution(entries, (entry) => entry.nivelLiderazgo);
  const riskLevels = levelDistribution(entries, (entry) => entry.nivelPercepcion);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MiniKpi label="Total general" value={totalProgrammed} helper="Colaboradores programados" />
        <MiniKpi label="Evaluados" value={appliedCount} helper={`${coverage}% de cobertura`} />
        <MiniKpi label="Dimensiones" value={dimensionScores.length} helper="Lecturas consolidadas disponibles" />
      </div>

      <Card className="rounded-lg border bg-white shadow-sm">
        <CardHeader className="space-y-2">
          <Badge variant="outline" className="w-fit rounded-md border-primary/20 bg-primary/5 text-primary">
            Inspirado en reporte ejecutivo
          </Badge>
          <CardTitle className="text-2xl font-black tracking-tight">Resultados generales por dimensión</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionScores} outerRadius={118}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {dimensionScores.map((item, index) => (
              <div key={item.dimension} className="rounded-lg border bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                    <span className="text-xs font-black uppercase text-slate-700">{item.dimension}</span>
                  </div>
                  <span className="text-sm font-black text-primary">{item.score}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <DonutPanel title="Motivación EMA" icon={Star} data={motivation} insight="Distribución de orientación motivacional predominante en los evaluados." />
        <DonutPanel title="Roles de equipo Belbin" icon={Users} data={roleGroups} insight="Lectura de la composición de roles predominantes para coordinación, ejecución e ideación." />
        <DonutPanel title="Estilos de liderazgo" icon={Zap} data={leadership} insight="Distribución de estilos de liderazgo reportados en los resultados individuales." />
        <DonutPanel title="Cultura de seguridad" icon={Shield} data={culture} insight="Ubicación de los perfiles en la curva de madurez preventiva." />
        <DonutPanel title="Tipos de comunicación" icon={MessageSquare} data={communication} insight="Tendencias comunicacionales observadas en la lectura cualitativa." />
        <DonutPanel title="Percepción de riesgo" icon={Brain} data={risk} insight="Distribución de perfiles de percepción frente al riesgo operacional." />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BarPanel title="Niveles de liderazgo" icon={RadarIcon} data={leadershipLevels} />
        <BarPanel title="Niveles de percepción de riesgo" icon={Activity} data={riskLevels} />
      </div>
    </div>
  );
};
