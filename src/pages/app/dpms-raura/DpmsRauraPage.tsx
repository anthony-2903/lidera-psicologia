import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRauraData, RauraEntry } from "@/lib/sheets-adapter";
import {
  Users,
  AlertCircle,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Activity,
  LayoutDashboard,
  Search,
  X,
  User,
  Radar as RadarIcon,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Zap,
  Star,
  Target,
  FileText,
  ArrowRight,
  MousePointer2,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DASHBOARD_PALETTES } from "@/lib/dashboard-configs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCard, GlassCard } from "@/components/dashboard/DashboardCards";
import {
  ChartTooltip,
  ChartLegend,
} from "@/components/dashboard/ChartElements";

const SHEET_ID = "16keeTLLxphGx7QtfRbtDC7yG1ACxyyQui1KypTX43o4";

// --- Paletas ---
const CAT_COLORS = DASHBOARD_PALETTES.rauraCategories;

// --- Helpers ---
const getInterpretation = (val: string) => {
  if (!val) return "";
  const v = val.trim();
  const map: Record<string, string> = {
    "1": "Nivel Reactivo - Acción basada en instinto y miedo.",
    "2": "Nivel Dependiente - Acción basada en supervisión y reglas.",
    "3": "Nivel Independiente - Acción basada en autovigilancia y convicción.",
    "4": "Nivel Interdependiente - Acción basada en el cuidado mutuo y proactividad.",
    "5": "Excelente / Liderazgo - Cultura preventiva plenamente integrada y ejemplar.",
  };
  return map[v] || val;
};

const getQuestionText = (val: string) => {
  if (!val) return "";
  const v = val.trim();
  const map: any = {
    "1": "Nunca",
    "2": "Pocas veces",
    "3": "Algunas veces",
    "4": "Muchas veces",
    "5": "Siempre",
  };
  return map[v] || v;
};

// --- Componentes Internos ---

const EntryPanel = ({
  entry,
  onClose,
}: {
  entry: RauraEntry;
  onClose: () => void;
}) => {
  const getAIAnalysis = (dims: RauraEntry["dimensions"]) => {
    const sorted = Object.entries(dims).sort((a, b) => a[1].score - b[1].score);
    const lowest = sorted[0];
    const highest = sorted[5];

    let analysis = `El perfil presenta una madurez operativa destacada en **${highest[0].toUpperCase()}** (${Math.round(highest[1].score)}%), categorizado como **${highest[1].perfil}**. `;

    if (lowest[1].score < 50) {
      analysis += `Sin embargo, se detecta un área crítica en **${lowest[0].toUpperCase()}** (${Math.round(lowest[1].score)}%), donde el perfil actual es **${lowest[1].perfil}**. Esto sugiere la necesidad de una intervención inmediata para elevar el nivel de madurez organizacional.`;
    } else {
      analysis += `Incluso en su punto más bajo (**${lowest[0].toUpperCase()}**), mantiene un nivel aceptable de **${lowest[1].perfil}**, lo que refleja una cultura de seguridad robusta.`;
    }

    return { analysis };
  };

  const aiResult = useMemo(() => getAIAnalysis(entry.dimensions), [entry]);

  const radarData = useMemo(
    () => [
      {
        subject: "LIDERAZGO",
        A: entry.dimensions.liderazgo.score,
        fullMark: 100,
      },
      {
        subject: "PERCEPCIÓN",
        A: entry.dimensions.percepcion.score,
        fullMark: 100,
      },
      {
        subject: "COMUNICACIÓN",
        A: entry.dimensions.comunicacion.score,
        fullMark: 100,
      },
      {
        subject: "ROL EQUIPO",
        A: entry.dimensions.rolEquipo.score,
        fullMark: 100,
      },
      { subject: "CULTURA", A: entry.dimensions.cultura.score, fullMark: 100 },
      {
        subject: "MOTIVACIÓN",
        A: entry.dimensions.motivacion.score,
        fullMark: 100,
      },
    ],
    [entry],
  );

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-full duration-700 cubic-bezier(0.23, 1, 0.32, 1) border-l border-white/10 bg-white/40 backdrop-blur-3xl shadow-[-20px_0_80px_rgba(0,0,0,0.1)]">
      {/* Sidebar Header */}
      <div className="px-8 py-8 border-b border-black/5 shrink-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl animate-pulse group-hover:bg-primary/30 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-white/50 border border-white/20 flex items-center justify-center text-primary shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-110">
              <User className="w-7 h-7" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mb-1 italic">
              Perfil de Respuesta
            </p>
            <h3 className="text-2xl font-black text-foreground tracking-tighter leading-none">
              {entry.area}
            </h3>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full h-10 w-10 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
        {/* Entry Snapshot */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-[1.5rem] bg-white/60 border border-white/20 shadow-sm transition-all hover:shadow-md">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Cargo
            </p>
            <p className="text-xs font-bold text-foreground truncate uppercase">
              {entry.cargo}
            </p>
          </div>
          <div className="p-4 rounded-[1.5rem] bg-white/60 border border-white/20 shadow-sm transition-all hover:shadow-md">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Ubicación
            </p>
            <p className="text-xs font-bold text-foreground truncate uppercase">
              {entry.ubicacion}
            </p>
          </div>
          <div className="p-4 rounded-[1.5rem] bg-white/60 border border-white/20 shadow-sm transition-all hover:shadow-md">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              DNI
            </p>
            <p className="text-xs font-bold text-foreground truncate uppercase">
              {entry.dni}
            </p>
          </div>
          <div className="p-4 rounded-[1.5rem] bg-white/60 border border-white/20 shadow-sm transition-all hover:shadow-md">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Empresa
            </p>
            <p className="text-xs font-bold text-foreground truncate uppercase">
              {entry.empresa}
            </p>
          </div>
        </div>

        {/* Detailed Radar */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/80 px-2 flex items-center gap-2 italic">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />{" "}
            Neural Fingerprint
          </h4>
          <div className="h-[280px] bg-white/40 rounded-[2.5rem] p-6 border border-white/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-all" />
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.05)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fontSize: 9,
                    fontWeight: 900,
                    fill: "rgba(0,0,0,0.4)",
                    letterSpacing: "0.1em",
                  }}
                />
                <Radar
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.25}
                  dot={{
                    r: 5,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Grid with Qualitative Profiles */}
        <div className="grid grid-cols-2 gap-5">
          {Object.entries(entry.dimensions).map(([key, dim], idx) => {
            const label =
              key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1");
            const color = Object.values(CAT_COLORS)[idx];
            return (
              <div key={key} className="relative group cursor-default">
                <div
                  className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-40 transition-opacity rounded-3xl"
                  style={{ backgroundColor: color }}
                />
                <Card className="rounded-[2rem] border-border/40 bg-white/80 shadow-sm relative z-10 overflow-hidden group-hover:-translate-y-1 transition-transform h-full">
                  <div
                    className="absolute top-0 left-0 w-1.5 h-full"
                    style={{ backgroundColor: color }}
                  />
                  <CardHeader className="p-5 pb-1">
                    <CardTitle className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-1">
                    <p
                      className="text-2xl font-black tabular-nums tracking-tighter"
                      style={{ color: color }}
                    >
                      {Math.round(dim.score)}%
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[8px] font-bold uppercase tracking-tighter border-muted-foreground/20 text-muted-foreground"
                    >
                      {dim.perfil}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Categoría Neural Analysis (IA) */}
        <div className="relative p-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] border border-indigo-500/30 shadow-3xl group overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.4em] italic mb-1">
                  Diagnóstico IA Psicología Expert
                </h4>
                <p className="text-xs font-bold text-indigo-100/60">
                  Análisis Conductual y Predictivo
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p
                className="text-sm font-medium text-indigo-100/90 leading-relaxed italic border-l-2 border-indigo-500/50 pl-4 py-1"
                dangerouslySetInnerHTML={{ __html: aiResult.analysis }}
              />
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3 fill-indigo-400" /> Foco de Mejora
                </p>
                <p className="text-xs font-bold text-indigo-100/80 leading-relaxed">
                  Basado en el perfil cualitativo, se recomienda priorizar el
                  desarrollo de competencias en las áreas de menor puntuación
                  para equilibrar la cultura organizacional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {entry.comentarios && (
          <div className="relative p-7 bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-3xl group overflow-hidden">
            <div className="absolute top-0 right-0 p-5 opacity-10">
              <MessageSquare className="w-16 h-16 text-primary" />
            </div>
            <h4 className="text-[10px] font-black uppercase text-primary mb-4 flex items-center gap-3 tracking-[0.4em] italic">
              <Zap className="w-4 h-4 fill-primary" /> Transcripción Crítica
            </h4>
            <p className="text-sm font-medium text-slate-200 leading-relaxed italic relative z-10 selection:bg-primary/30">
              "{getInterpretation(entry.comentarios)}"
            </p>
          </div>
        )}

        {/* Interpretación Section (Nota: El desglose de preguntas individuales se encuentra en las pestañas específicas del Excel) */}
      </div>
    </div>
  );
};

export default function DpmsRauraPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "individual" | "comments"
  >("general");
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<RauraEntry | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["rauraData", SHEET_ID],
    queryFn: () => fetchRauraData(SHEET_ID),
  });

  const companies = useMemo(() => {
    if (!data?.entries) return [];
    return Array.from(new Set(data.entries.map((e) => e.empresa))).sort();
  }, [data]);

  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    return data.entries
      .filter((e) => {
        const matchesSearch =
          (e.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (e.cargo || "").toLowerCase().includes(search.toLowerCase()) ||
          (e.empresa || "").toLowerCase().includes(search.toLowerCase());
        const matchesCompany =
          selectedCompany === "all" || e.empresa === selectedCompany;
        return matchesSearch && matchesCompany;
      })
      .sort((a, b) => a.id - b.id);
  }, [data, search, selectedCompany]);

  const statsMetrix = useMemo(() => {
    if (!filteredEntries.length)
      return { avg: 0, categories: [], areas: [], voice: 0 };

    const avg = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const categories = [
      {
        name: "Liderazgo",
        value: avg(filteredEntries.map((e) => e.dimensions.liderazgo.score)),
      },
      {
        name: "Percepción",
        value: avg(filteredEntries.map((e) => e.dimensions.percepcion.score)),
      },
      {
        name: "Comunicación",
        value: avg(filteredEntries.map((e) => e.dimensions.comunicacion.score)),
      },
      {
        name: "Rol Equipo",
        value: avg(filteredEntries.map((e) => e.dimensions.rolEquipo.score)),
      },
      {
        name: "Cultura",
        value: avg(filteredEntries.map((e) => e.dimensions.cultura.score)),
      },
      {
        name: "Motivación",
        value: avg(filteredEntries.map((e) => e.dimensions.motivacion.score)),
      },
    ];

    const areaGroups: Record<string, number[]> = {};
    filteredEntries.forEach((e) => {
      const a = (e.area || "GENERAL").trim().toUpperCase();
      if (!areaGroups[a]) areaGroups[a] = [];
      areaGroups[a].push(e.totalScore);
    });

    const areas = Object.keys(areaGroups)
      .map((name) => ({
        name,
        score: Math.round(avg(areaGroups[name])),
      }))
      .sort((a, b) => b.score - a.score);

    return {
      avg: avg(filteredEntries.map((e) => e.totalScore)),
      categories,
      areas,
      voice: filteredEntries.filter((e) => e.comentarios).length,
    };
  }, [filteredEntries]);

  const maturityData = useMemo(() => {
    if (!filteredEntries.length) return [];
    const levels = [
      {
        name: "Reactivo",
        value: 0,
        color: "#ef4444",
        desc: "Cultura basada en instinto y miedo. La seguridad es una carga delegada.",
      },
      {
        name: "Dependiente",
        value: 0,
        color: "#f59e0b",
        desc: "Cultura basada en supervisión y reglas. Se cumple por temor a la sanción.",
      },
      {
        name: "Independiente",
        value: 0,
        color: "#3b82f6",
        desc: "Cultura basada en autovigilancia. El individuo se cuida por convicción.",
      },
      {
        name: "Interdependiente",
        value: 0,
        color: "#10b981",
        desc: 'Cultura colectiva. "Yo te cuido, tú me cuidas". Excelencia operacional.',
      },
    ];

    filteredEntries.forEach((e) => {
      const s = e.totalScore;
      if (s <= 25) levels[0].value++;
      else if (s <= 50) levels[1].value++;
      else if (s <= 75) levels[2].value++;
      else levels[3].value++;
    });

    return levels.filter((l) => l.value > 0);
  }, [filteredEntries]);

  const cultureData = useMemo(() => {
    if (!filteredEntries.length)
      return { avg: 0, distribution: [], label: "N/A" };
    const avgCulture = statsMetrix.categories[4]?.value || 0;

    const levels = [
      { name: "Reactivo", value: 0, color: "#ef4444", range: "0-25%" },
      { name: "Dependiente", value: 0, color: "#f59e0b", range: "26-50%" },
      { name: "Independiente", value: 0, color: "#3b82f6", range: "51-75%" },
      {
        name: "Interdependiente",
        value: 0,
        color: "#10b981",
        range: "76-100%",
      },
    ];

    filteredEntries.forEach((e) => {
      const s = e.dimensions.cultura.score;
      if (s <= 25) levels[0].value++;
      else if (s <= 50) levels[1].value++;
      else if (s <= 75) levels[2].value++;
      else levels[3].value++;
    });

    let currentLabel = "N/A";
    let currentColor = "#cbd5e1";

    if (avgCulture <= 25) {
      currentLabel = "Reactivo";
      currentColor = "#ef4444";
    } else if (avgCulture <= 50) {
      currentLabel = "Dependiente";
      currentColor = "#f59e0b";
    } else if (avgCulture <= 75) {
      currentLabel = "Independiente";
      currentColor = "#3b82f6";
    } else {
      currentLabel = "Interdependiente";
      currentColor = "#10b981";
    }

    return {
      avg: avgCulture,
      distribution: levels.filter((l) => l.value > 0),
      label: currentLabel,
      color: currentColor,
    };
  }, [filteredEntries, statsMetrix]);

  const behaviorCategory = useMemo(() => {
    if (!filteredEntries.length) return { name: "N/A", color: "#cbd5e1" };
    const s = statsMetrix.avg;
    if (s <= 25) return { name: "Reactivo", color: "#ef4444" };
    if (s <= 50) return { name: "Dependiente", color: "#f59e0b" };
    if (s <= 75) return { name: "Independiente", color: "#3b82f6" };
    return { name: "Interdependiente", color: "#10b981" };
  }, [filteredEntries, statsMetrix]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="relative">
          <div className="w-24 h-24 rounded-[2.5rem] bg-card border border-border/40 flex items-center justify-center shadow-2xl animate-float">
            <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>
        <div className="space-y-4 relative z-10">
          <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary/30 underline-offset-8">
            DPMS Network
          </h2>
          <p className="text-muted-foreground font-black uppercase tracking-[0.5em] text-[11px] animate-pulse">
            Analizando Madurez de Seguridad...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
        <div className="w-28 h-28 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-2xl border border-red-500/20">
          <AlertCircle className="w-14 h-14" />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tighter">
            Sync Interrumpido
          </h2>
          <p className="text-muted-foreground max-w-md font-medium text-lg italic">
            El repositorio de datos DPMS-Raura no respondió al llamado.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          className="gap-3 px-10 h-16 rounded-2xl text-base font-black shadow-2xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95"
        >
          <RefreshCw className={cn("w-5 h-5", isFetching && "animate-spin")} />{" "}
          Reconectar Canales
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col selection:bg-primary/20 overflow-x-hidden p-4 md:p-8 space-y-12">
      <DashboardHeader
        title={
          <>
            DPMS <span className="text-primary not-italic">Raura</span>
          </>
        }
        subtitle="Métricas de percepción y madurez en seguridad minera. Análisis de comportamiento y liderazgo visible."
        isFetching={isFetching}
        onRefresh={refetch}
        view={activeTab}
        onViewChange={setActiveTab}
        stats={{
          label: "Muestreo Total",
          value: data.totalRespondents,
          icon: Users,
        }}
        tabs={[
          { id: "general", icon: LayoutDashboard, label: "Resumen Global" },
          {
            id: "individual",
            icon: MousePointer2,
            label: "Explorar Respuestas",
          },
          { id: "comments", icon: MessageSquare, label: "Mesa de Voz" },
        ]}
        className={cn(selectedEntry ? "lg:pr-[450px]" : "")}
      />

      {/* --- CONTENT AREA --- */}

      <div
        className={cn(
          "flex-1 space-y-20 transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1)",
          selectedEntry ? "lg:pr-[450px]" : "",
        )}
      >
        {activeTab === "general" && (
          <div className="space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-forwards">
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <KpiCard
                label="Promedio Global"
                value={`${Math.round(statsMetrix.avg)}%`}
                icon={Target}
                color="text-primary"
                bg="bg-primary/10"
                border="border-primary/20"
                glowColor="primary/20"
                description="Madurez Organizacional"
              />
              <KpiCard
                label="Liderazgo"
                value={`${Math.round(statsMetrix.categories[0]?.value || 0)}%`}
                icon={Star}
                color="text-purple-500"
                bg="bg-purple-500/10"
                border="border-purple-500/20"
                glowColor="purple-500/20"
                description="Percepción directiva"
              />
              <KpiCard
                label="Cultura SST"
                value={`${Math.round(statsMetrix.categories[4]?.value || 0)}%`}
                icon={ShieldCheck}
                color="text-emerald-500"
                bg="bg-emerald-500/10"
                border="border-emerald-500/20"
                glowColor="emerald-500/20"
                description="Curva de Bradley"
              />
              <KpiCard
                label="Participación"
                value={`${Math.round(statsMetrix.categories[2]?.value || 0)}%`}
                icon={Users}
                color="text-blue-500"
                bg="bg-blue-500/10"
                border="border-blue-500/20"
                glowColor="blue-500/20"
                description="Comunicación asertiva"
              />
            </div>

            {/* MAIN CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* RADAR DIMENSIONS */}
              <Card className="rounded-3xl lg:rounded-[4rem] border-2 border-border/40 bg-white/40 backdrop-blur-2xl shadow-3xl overflow-hidden group/card relative hover:border-primary/30 transition-all duration-1000">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
                <CardHeader className="p-6 lg:p-12 pb-0 flex flex-col items-center gap-3 text-center">
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/20 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4"
                  >
                    Neural Vision
                  </Badge>
                  <CardTitle className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter italic uppercase">
                    Dimensiones Críticas
                  </CardTitle>
                  <CardDescription className="text-sm font-black uppercase tracking-[0.4em] opacity-40">
                    Mapeo de Madurez Evolutiva
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 lg:p-12 h-[400px] lg:h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={statsMetrix.categories}
                    >
                      <PolarGrid
                        stroke="rgba(0,0,0,0.08)"
                        strokeDasharray="10 10"
                      />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "rgba(0,0,0,0.5)",
                          letterSpacing: "0.15em",
                        }}
                      />
                      <PolarRadiusAxis domain={[0, 100]} hide />
                      <Tooltip content={<ChartTooltip />} />
                      <Radar
                        name="Madurez"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.25}
                        dot={{
                          r: 6,
                          fill: "hsl(var(--primary))",
                          stroke: "#fff",
                          strokeWidth: 3,
                        }}
                        animationDuration={2500}
                        animationBegin={500}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AREAS BAR CHART */}
              <Card className="rounded-3xl lg:rounded-[4rem] border-2 border-border/40 bg-white/40 backdrop-blur-2xl shadow-3xl overflow-hidden group/card relative hover:border-emerald-500/30 transition-all duration-1000">
                <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                <CardHeader className="p-6 lg:p-12 pb-0 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-xl group-hover:rotate-12 transition-transform">
                      <BarChart3 className="w-8 h-8" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter italic uppercase">
                    Performance Local
                  </CardTitle>
                  <CardDescription className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-600/60 mt-4">
                    Comparativa Entre Áreas Operativas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 lg:p-12 h-[400px] lg:h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statsMetrix.areas}
                      layout="vertical"
                      margin={{ left: 60, right: 40 }}
                    >
                      <CartesianGrid
                        strokeDasharray="15 15"
                        horizontal={false}
                        stroke="rgba(0,0,0,0.05)"
                      />
                      <XAxis type="number" domain={[0, 104]} hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fontWeight: 900,
                          fill: "rgba(0,0,0,0.6)",
                        }}
                        tickFormatter={(value) => value.toUpperCase()}
                        width={140}
                      />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
                      />
                      <Bar
                        dataKey="score"
                        radius={[0, 20, 20, 0]}
                        barSize={40}
                        animationDuration={2000}
                        animationBegin={800}
                      >
                        {statsMetrix.areas.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.score > 80
                                ? "#10b981"
                                : entry.score > 60
                                  ? "#3b82f6"
                                  : "#f59e0b"
                            }
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* MATURITY ANALYSIS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* BAR CHART SECTION (Previous areas bar chart now takes 2 cols if needed, or we keep 3 charts in a row) */}
              {/* Let's place the Pie chart in 1 col and the analysis in 2 cols */}

              <Card className="rounded-3xl lg:rounded-[4rem] border-2 border-border/40 bg-white/40 backdrop-blur-2xl shadow-3xl overflow-hidden group/card relative hover:border-primary/30 transition-all duration-1000 lg:col-span-1">
                <CardHeader className="p-6 lg:p-10 pb-0 text-center">
                  <CardTitle className="text-xl sm:text-3xl font-black tracking-tighter italic uppercase">
                    Nivel de Seguridad
                  </CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
                    Madurez de la Cultura Preventiva
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={maturityData}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {maturityData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip isPie />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-4xl font-black tracking-tighter text-foreground italic">
                      {filteredEntries.length}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">
                      Muestras
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl lg:rounded-[4rem] border-2 border-border/40 bg-white/40 backdrop-blur-2xl shadow-3xl overflow-hidden relative lg:col-span-2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-10 group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                  <TrendingUp className="w-40 h-40 text-primary" />
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />{" "}
                      Neural Diagnostic Summary
                    </h4>
                    <Badge
                      className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-lg animate-in zoom-in duration-500"
                      style={{
                        backgroundColor: `${behaviorCategory.color}20`,
                        color: behaviorCategory.color,
                        boxShadow: `0 0 20px ${behaviorCategory.color}30`,
                      }}
                    >
                      Nivel: {behaviorCategory.name}
                    </Badge>
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black tracking-tighter text-foreground leading-none italic max-w-2xl">
                    Análisis de Comportamiento y{" "}
                    <span className="text-primary not-italic">
                      ADN Preventivo
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  {maturityData.map((level, idx) => (
                    <div key={idx} className="flex gap-5 group/item">
                      <div
                        className="w-1.5 h-auto rounded-full group-hover:scale-y-110 transition-transform"
                        style={{ backgroundColor: level.color }}
                      />
                      <div>
                        <p
                          className="text-[10px] font-black uppercase tracking-widest mb-1"
                          style={{ color: level.color }}
                        >
                          {level.name}
                        </p>
                        <p className="text-[13px] font-medium text-muted-foreground leading-relaxed italic">
                          {level.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border/10 relative z-10">
                  <p className="text-sm font-medium text-slate-500 italic max-w-3xl leading-relaxed">
                    El diagnóstico actual refleja un{" "}
                    <span className="font-black text-foreground">
                      {Math.round(statsMetrix.avg)}%
                    </span>{" "}
                    de alineamiento global. La concentración mayoritaria en el
                    nivel{" "}
                    <span className="font-black text-foreground uppercase italic tracking-tight underline decoration-primary/30">
                      {
                        maturityData.reduce((prev, current) =>
                          prev.value > current.value ? prev : current,
                        ).name
                      }
                    </span>{" "}
                    sugiere que la organización{" "}
                    {statsMetrix.avg > 75
                      ? "posee una base robusta para la interdependencia."
                      : statsMetrix.avg > 50
                        ? "se encuentra en una etapa de transición crítica hacia la autogestión."
                        : "requiere un refuerzo inmediato en liderazgo visible y supervisión."}
                  </p>
                </div>
              </Card>
            </div>

            {/* CULTURE ANALYSIS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <Card className="rounded-3xl lg:rounded-[4rem] border-2 border-border/40 bg-white/40 backdrop-blur-2xl shadow-3xl overflow-hidden relative lg:col-span-2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-8 group">
                <div className="absolute -bottom-10 -left-10 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                  <Users className="w-60 h-60 text-primary" />
                </div>

                <div className="space-y-4 relative z-10 text-right lg:text-left">
                  <div className="flex flex-wrap items-center gap-3 mb-2 lg:justify-start justify-end">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 italic flex items-center gap-3">
                      <Activity className="w-4 h-4 text-blue-500" />{" "}
                      Organizational DNA Index
                    </h4>
                    <Badge
                      className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-lg"
                      style={{
                        backgroundColor: `${cultureData.color}20`,
                        color: cultureData.color,
                        boxShadow: `0 0 20px ${cultureData.color}30`,
                      }}
                    >
                      Nivel: {cultureData.label}
                    </Badge>
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black tracking-tighter text-foreground leading-none italic max-w-2xl">
                    Nivel de{" "}
                    <span className="text-blue-500 not-italic">Cultura</span>{" "}
                    Organizativa
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {cultureData.distribution.map((level, idx) => (
                    <div
                      key={idx}
                      className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all"
                    >
                      <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">
                        Población {level.name}
                      </p>
                      <div className="flex items-end justify-between">
                        <span
                          className="text-3xl font-black tabular-nums italic"
                          style={{ color: level.color }}
                        >
                          {level.value}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground/40 mb-1">
                          {level.range}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border/10 relative z-10">
                  <p className="text-sm font-medium text-slate-500 italic max-w-3xl leading-relaxed">
                    La cultura organizacional se define por el grado de cohesión
                    y comunicación. Actualmente, el{" "}
                    <span className="font-black text-foreground">
                      {Math.round(
                        ((cultureData.distribution.find(
                          (d) => d.name === cultureData.label,
                        )?.value || 0) /
                          filteredEntries.length) *
                          100,
                      )}
                      %
                    </span>{" "}
                    de la muestra se sitúa en el segmento{" "}
                    <span
                      className="font-black"
                      style={{ color: cultureData.color }}
                    >
                      {cultureData.label.toUpperCase()}
                    </span>
                    .
                    {cultureData.avg > 75
                      ? " Esto indica una base sólida de confianza e interdependencia que potencia la seguridad colectiva."
                      : cultureData.avg > 50
                        ? " Existe un clima de autogestión e independencia funcional, con individuos comprometidos con su seguridad."
                        : cultureData.avg > 25
                          ? " Se observa una cultura dependiente de la supervisión constante y el cumplimiento de reglas externas."
                          : " La organización presenta un nivel reactivo basado en el instinto, con vacíos críticos en la cultura preventiva."}
                  </p>
                </div>
              </Card>

              <Card className="rounded-2xl lg:rounded-[4rem] border-2 border-border/40 bg-white/40 backdrop-blur-2xl shadow-3xl overflow-hidden group/card relative hover:border-blue-400/30 transition-all duration-1000 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none"></div>
                <CardHeader className="p-6 lg:p-10 pb-0 text-center">
                  <Badge
                    variant="outline"
                    className="text-blue-500 border-blue-500/20 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4"
                  >
                    Culture Gauge
                  </Badge>
                  <CardTitle className="text-xl lg:text-3xl font-black tracking-tighter italic uppercase text-foreground">
                    Nivel del entorno en seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 h-[350px] flex flex-col items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="100%"
                      barSize={25}
                      data={[
                        {
                          name: "Cultura",
                          value: cultureData.avg,
                          fill: cultureData.color,
                        },
                      ]}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={30}
                        animationDuration={2000}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute top-[60%] flex flex-col items-center text-center">
                    <p
                      className="text-6xl font-black tracking-tighter tabular-nums italic leading-none"
                      style={{ color: cultureData.color }}
                    >
                      {Math.round(cultureData.avg)}%
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mt-3">
                      {cultureData.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "individual" && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-16 duration-1000 fill-mode-forwards">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-6 flex-1 items-center">
                <div className="relative flex-1 group w-full">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-blue-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-primary relative z-10" />
                  <Input
                    placeholder="Buscando por Área, Puesto o Empresa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-20 h-20 bg-white/60 backdrop-blur-3xl border-border/40 rounded-[2rem] shadow-2xl focus:ring-8 focus:ring-primary/5 text-xl font-black tracking-tight relative z-10 border-2"
                  />
                </div>

                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger className="w-full sm:w-[280px] h-20 bg-white/60 backdrop-blur-3xl border-border/40 rounded-[2rem] shadow-2xl text-lg font-black tracking-tight border-2 px-8">
                    <SelectValue placeholder="Filtrar por Empresa" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 bg-white/90 backdrop-blur-xl">
                    <SelectItem value="all" className="font-bold py-3">
                      Todas las Empresas
                    </SelectItem>
                    {companies.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="font-bold py-3 uppercase"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden xl:flex items-center gap-8 bg-card px-16 py-7 rounded-[3rem] border-2 border-border/20 shadow-3xl group ">
                <div className="text-right border-r-2 border-border/20 pr-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-2 italic">
                    Neural Index
                  </p>
                  <p className="text-xs font-bold text-primary">
                    Active Search_
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-black text-foreground tabular-nums tracking-tighter italic">
                    {filteredEntries.length}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-1">
                    Found
                  </p>
                </div>
              </div>
            </div>

            <Card className="rounded-2xl sm:rounded-[4rem] border-border/40 bg-white/40 backdrop-blur-3xl shadow-3xl border-2 overflow-hidden">
              <div className="max-h-[750px] overflow-y-auto overflow-x-auto custom-scrollbar relative">
                <Table>
                  <TableHeader className="bg-slate-100/90 backdrop-blur-md sticky top-0 z-40">
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="w-[120px] font-black text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60 py-4 pl-14 italic sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Nombre / DNI
                      </TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60 py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Ubicación / Área
                      </TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60 py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Empresa / Contrata
                      </TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60 py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Cargo / Puesto
                      </TableHead>
                      <TableHead className="font-black text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60 py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Neural Maturity
                      </TableHead>
                      <TableHead className="text-right font-black text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60 py-4 pr-14 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Detalle
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className={cn(
                          "cursor-pointer border-border/20 transition-all hover:bg-primary/5 group h-24",
                          selectedEntry?.id === entry.id
                            ? "bg-primary/10 border-l-8 border-l-primary"
                            : "",
                        )}
                      >
                        <TableCell className="pl-14">
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase text-foreground truncate max-w-[200px]">
                              {entry.name}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground/60 tabular-nums">
                              {entry.dni}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-[11px] font-black text-foreground group-hover:translate-x-1 transition-transform uppercase italic tracking-tight">
                            {entry.ubicacion} / {entry.area}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[11px] font-bold text-primary px-3 py-1 bg-primary/5 rounded-full uppercase italic">
                            {entry.empresa}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border-border/40 group-hover:bg-background group-hover:border-primary/30 transition-all"
                          >
                            {entry.cargo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-5">
                            <div className="w-32 h-3 bg-muted/40 rounded-full overflow-hidden border border-border/10">
                              <div
                                className="h-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000"
                                style={{ width: `${entry.totalScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-black italic">
                              {Math.round(entry.totalScore)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-14">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:rotate-12 transition-all shadow-xl">
                            <ChevronRight className="w-6 h-6" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in zoom-in-95 duration-1000 fill-mode-forwards">
            {data.entries
              .filter((e) => e.comentarios)
              .map((e, i) => (
                <div key={e.id} className="relative group perspective-1000">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]"></div>
                  <Card className="rounded-[3rem] border-2 border-border/40 bg-white/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group-hover:-rotate-2 group-hover:scale-[1.02] transition-all duration-700 h-full flex flex-col">
                    <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <Badge className="w-fit bg-primary text-white border-0 px-5 py-1.5 text-[10px] uppercase font-black tracking-widest italic">
                          {e.area}
                        </Badge>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                          {e.cargo}
                        </p>
                      </div>
                      <div className="text-[10px] font-black text-muted-foreground/30 italic">
                        #{e.id}
                      </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-0 flex-1 flex flex-col justify-center">
                      <p className="text-xl font-medium leading-relaxed italic text-slate-700 select-none pb-8 border-b border-border/10">
                        "{getInterpretation(e.comentarios)}"
                      </p>
                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                            Feedback Verificado
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground/50">
                          {e.fecha}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* FLOATING ACTION PANEL */}
      {selectedEntry && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-500"
            onClick={() => setSelectedEntry(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] lg:w-[500px] z-[100] animate-in slide-in-from-right duration-700 cubic-bezier(0.23, 1, 0.32, 1)">
            <EntryPanel
              entry={selectedEntry}
              onClose={() => setSelectedEntry(null)}
            />
          </div>
        </>
      )}

      {/* DESIGN DECORATIONS */}
      <div className="fixed bottom-10 left-10 pointer-events-none opacity-20 hidden 2xl:block">
        <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[1em] text-[10px] italic">
          <Activity className="w-4 h-4 animate-pulse" /> Diagnostic
          Protocol_Raura
        </div>
      </div>
    </div>
  );
}
