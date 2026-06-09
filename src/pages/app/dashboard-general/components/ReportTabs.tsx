import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  FileBarChart,
  LayoutDashboard,
  MapPin,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GroupMetric } from "@/lib/sheets-adapter";
import { COMPANY_BAR_COLORS } from "../constants";
import { GroupBreakdown } from "./GroupBreakdown";

export interface ReportSegment {
  name: string;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

interface ReportTabsProps {
  totalEvaluated: number;
  statusTotals: {
    completo: number;
    proceso: number;
    falta: number;
  };
  contractorData: ReportSegment[];
  locationData: ReportSegment[];
  groupMetrics: GroupMetric[];
  onGroupClick: (group: GroupMetric) => void;
}

const areaLinks = [
  { label: "Dashboard General", path: "/app/dashboard", icon: LayoutDashboard },
  { label: "Seguimiento de Aplicación", path: "/app/diagnostic", icon: ClipboardCheck },
  { label: "Dashboard Final", path: "/app/final-dashboard", icon: FileBarChart },
  { label: "Diagnóstico Psicosocial", path: "/app/dimensiones", icon: BarChart3 },
];

const statusChartColors = {
  completed: "#16a34a",
  inProgress: "#d97706",
  pending: "#dc2626",
};

const percentOf = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const getPerformanceLabel = (rate: number) => {
  if (rate >= 85) return "avance solido";
  if (rate >= 60) return "avance controlado";
  if (rate >= 35) return "avance en desarrollo";
  return "avance crítico";
};

const getTopSegment = (segments: ReportSegment[]) =>
  [...segments].sort((a, b) => b.completionRate - a.completionRate || b.total - a.total)[0];

const getPendingSegment = (segments: ReportSegment[]) =>
  [...segments].sort((a, b) => b.pending - a.pending || b.total - a.total)[0];

const StatusLegend = ({ statusTotals, totalEvaluated }: Pick<ReportTabsProps, "statusTotals" | "totalEvaluated">) => {
  const rows = [
    { label: "Aplicadas", value: statusTotals.completo, color: statusChartColors.completed },
    { label: "En proceso", value: statusTotals.proceso, color: statusChartColors.inProgress },
    { label: "Pendientes", value: statusTotals.falta, color: statusChartColors.pending },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg border bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
              <span className="text-xs font-bold uppercase text-muted-foreground">{row.label}</span>
            </div>
            <span className="text-sm font-black">{row.value}</span>
          </div>
          <Progress value={percentOf(row.value, totalEvaluated)} className="mt-2 h-1.5 bg-muted" />
        </div>
      ))}
    </div>
  );
};

const RelatedLinks = () => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {areaLinks.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className="group flex min-h-16 items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <item.icon className="h-4 w-4" />
          </div>
          <span className="truncate text-sm font-black text-foreground">{item.label}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </Link>
    ))}
  </div>
);

const SegmentBarChart = ({ data, dataKeyId }: { data: ReportSegment[]; dataKeyId: string }) => (
  <div className="h-[340px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ top: 8, right: 46, bottom: 8, left: 18 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.2} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={128}
          tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--primary) / 0.06)" }}
          formatter={(value: number, name: string) => [value, name === "total" ? "Participantes" : name]}
          contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 14px 30px rgb(15 23 42 / 0.12)" }}
        />
        <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={24}>
          <LabelList
            dataKey="completionRate"
            position="right"
            formatter={(value: number) => `${value}%`}
            style={{ fontSize: "11px", fontWeight: 800, fill: "hsl(var(--muted-foreground))" }}
          />
          {data.slice(0, 10).map((_, index) => (
            <Cell key={`${dataKeyId}-${index}`} fill={COMPANY_BAR_COLORS[index % COMPANY_BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const SegmentStackedStatusChart = ({ data }: { data: ReportSegment[] }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.slice(0, 8)} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 18 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.18} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={124}
          tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--primary) / 0.05)" }}
          contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 14px 30px rgb(15 23 42 / 0.12)" }}
        />
        <Bar dataKey="completed" name="Aplicadas" stackId="status" fill={statusChartColors.completed} radius={[8, 0, 0, 8]} />
        <Bar dataKey="inProgress" name="En proceso" stackId="status" fill={statusChartColors.inProgress} />
        <Bar dataKey="pending" name="Pendientes" stackId="status" fill={statusChartColors.pending} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const SegmentCompletionChart = ({ data, color = "hsl(var(--primary))" }: { data: ReportSegment[]; color?: string }) => {
  const chartData = [...data]
    .sort((a, b) => b.completionRate - a.completionRate || b.total - a.total)
    .slice(0, 8);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 18, right: 12, bottom: 56, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.18} />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={62}
            tick={{ fontSize: 9, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Avance"]}
            cursor={{ fill: "hsl(var(--primary) / 0.05)" }}
            contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 14px 30px rgb(15 23 42 / 0.12)" }}
          />
          <Bar dataKey="completionRate" name="Avance" fill={color} radius={[8, 8, 0, 0]} barSize={28}>
            <LabelList
              dataKey="completionRate"
              position="top"
              formatter={(value: number) => `${value}%`}
              style={{ fontSize: "10px", fontWeight: 800, fill: "hsl(var(--foreground))" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const SegmentPendingChart = ({ data }: { data: ReportSegment[] }) => {
  const chartData = [...data]
    .sort((a, b) => b.pending - a.pending || b.total - a.total)
    .slice(0, 7);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 18, right: 12, bottom: 56, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.18} />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={62}
            tick={{ fontSize: 9, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "hsl(var(--destructive) / 0.05)" }}
            contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 14px 30px rgb(15 23 42 / 0.12)" }}
          />
          <Bar dataKey="pending" name="Pendientes" fill={statusChartColors.pending} radius={[8, 8, 0, 0]} barSize={28}>
            <LabelList
              dataKey="pending"
              position="top"
              style={{ fontSize: "10px", fontWeight: 800, fill: "hsl(var(--foreground))" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ChartPanel = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof BarChart3;
  children: ReactNode;
}) => (
  <Card className="rounded-lg border bg-white shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base font-black">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const SegmentTable = ({ data }: { data: ReportSegment[] }) => (
  <div className="overflow-hidden rounded-lg border bg-white">
    <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr] gap-2 border-b bg-muted/40 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground sm:grid-cols-[1.6fr_repeat(4,0.7fr)]">
      <span>Segmento</span>
      <span className="text-right">Total</span>
      <span className="text-right">Avance</span>
      <span className="hidden text-right sm:block">Aplicadas</span>
      <span className="hidden text-right sm:block">Pendientes</span>
    </div>
    <div className="divide-y">
      {data.slice(0, 8).map((item) => (
        <div key={item.name} className="grid grid-cols-[1.2fr_0.7fr_0.7fr] gap-2 px-4 py-3 text-sm sm:grid-cols-[1.6fr_repeat(4,0.7fr)]">
          <span className="min-w-0 truncate font-bold">{item.name}</span>
          <span className="text-right font-black">{item.total}</span>
          <span className="text-right font-black text-primary">{item.completionRate}%</span>
          <span className="hidden text-right font-semibold text-emerald-700 sm:block">{item.completed}</span>
          <span className="hidden text-right font-semibold text-red-700 sm:block">{item.pending}</span>
        </div>
      ))}
    </div>
  </div>
);

export const ReportTabs = ({
  totalEvaluated,
  statusTotals,
  contractorData,
  locationData,
  groupMetrics,
  onGroupClick,
}: ReportTabsProps) => {
  const statusData = [
    { name: "Aplicadas", value: statusTotals.completo, color: statusChartColors.completed },
    { name: "En proceso", value: statusTotals.proceso, color: statusChartColors.inProgress },
    { name: "Pendientes", value: statusTotals.falta, color: statusChartColors.pending },
  ];
  const generalCompletion = percentOf(statusTotals.completo, totalEvaluated);
  const topContractor = getTopSegment(contractorData);
  const pendingContractor = getPendingSegment(contractorData);
  const topLocation = getTopSegment(locationData);
  const pendingLocation = getPendingSegment(locationData);

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-lg border bg-white p-2 shadow-sm md:grid-cols-3">
        <TabsTrigger value="general" className="h-11 gap-2 rounded-md text-xs font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white">
          <PieChartIcon className="h-4 w-4" />
          Reporte general
        </TabsTrigger>
        <TabsTrigger value="contractor" className="h-11 gap-2 rounded-md text-xs font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white">
          <Building2 className="h-4 w-4" />
          Por contratista
        </TabsTrigger>
        <TabsTrigger value="location" className="h-11 gap-2 rounded-md text-xs font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white">
          <MapPin className="h-4 w-4" />
          Por zona
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card className="rounded-lg border bg-white shadow-sm">
          <CardHeader className="space-y-2">
            <Badge variant="outline" className="w-fit rounded-md border-primary/20 bg-primary/5 text-primary">
              Visión ejecutiva
            </Badge>
            <CardTitle className="text-2xl font-black tracking-tight">Reporte general de aplicación</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={64} outerRadius={102} dataKey="value" paddingAngle={4}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-5">
              <StatusLegend statusTotals={statusTotals} totalEvaluated={totalEvaluated} />
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-primary">
                  <TrendingUp className="h-4 w-4" />
                  Lectura del resultado
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  El avance global se ubica en {generalCompletion}%, clasificado como {getPerformanceLabel(generalCompletion)}. La prioridad operativa es cerrar los {statusTotals.falta} casos pendientes y sostener el ritmo de los {statusTotals.proceso} casos en proceso para consolidar la cobertura total.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartPanel title="Ranking de avance por contratista" icon={Building2}>
            <SegmentCompletionChart data={contractorData} color="#2563eb" />
          </ChartPanel>
          <ChartPanel title="Zonas con mayor carga pendiente" icon={MapPin}>
            <SegmentPendingChart data={locationData} />
          </ChartPanel>
        </div>
        <RelatedLinks />
      </TabsContent>

      <TabsContent value="contractor" className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-lg border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <Building2 className="h-5 w-5 text-primary" />
                Participación y avance por contratista
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SegmentBarChart data={contractorData} dataKeyId="contractor" />
            </CardContent>
          </Card>
          <Card className="rounded-lg border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Análisis por contratista</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {topContractor ? `${topContractor.name} lidera el avance con ${topContractor.completionRate}% de evaluaciones aplicadas.` : "Aún no hay contratistas disponibles para analizar."}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {pendingContractor ? `El mayor volumen pendiente se concentra en ${pendingContractor.name}, con ${pendingContractor.pending} registros por completar.` : "No se registran pendientes por contratista."}
              </p>
              <SegmentTable data={contractorData} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartPanel title="Composición de estados por contratista" icon={BarChart3}>
            <SegmentStackedStatusChart data={contractorData} />
          </ChartPanel>
          <ChartPanel title="Ranking porcentual de cumplimiento" icon={TrendingUp}>
            <SegmentCompletionChart data={contractorData} color="#16a34a" />
          </ChartPanel>
        </div>
        <GroupBreakdown groupMetrics={groupMetrics} onGroupClick={onGroupClick} />
      </TabsContent>

      <TabsContent value="location" className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-lg border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <MapPin className="h-5 w-5 text-primary" />
                Cobertura por zona o ubicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SegmentBarChart data={locationData} dataKeyId="location" />
            </CardContent>
          </Card>
          <Card className="rounded-lg border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Análisis territorial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {topLocation ? `${topLocation.name} muestra el mejor avance territorial con ${topLocation.completionRate}% de aplicación.` : "Aún no hay zonas disponibles para analizar."}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {pendingLocation ? `La ubicación que requiere mayor seguimiento es ${pendingLocation.name}, con ${pendingLocation.pending} evaluaciones pendientes.` : "No se registran pendientes por zona."}
              </p>
              <SegmentTable data={locationData} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartPanel title="Composición de estados por zona" icon={BarChart3}>
            <SegmentStackedStatusChart data={locationData} />
          </ChartPanel>
          <ChartPanel title="Ranking porcentual por ubicación" icon={TrendingUp}>
            <SegmentCompletionChart data={locationData} color="#0f766e" />
          </ChartPanel>
        </div>
        <RelatedLinks />
      </TabsContent>
    </Tabs>
  );
};
