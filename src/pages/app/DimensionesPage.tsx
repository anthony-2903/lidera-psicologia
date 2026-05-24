import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { 
  User, 
  Shield, 
  Zap,
  Briefcase,
  IdCard,
  ChevronRight,
  RefreshCw,
  Search,
  Table as TableIcon,
  LayoutDashboard,
  Filter,
  PersonStanding as PersonStandingIcon,
  ArrowLeft,
  Info,
  Activity
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GlassCard } from "@/components/dashboard/DashboardCards";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchDimensionesData, DimensionesEntry, DimensionReport } from "@/lib/sheets-adapter";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SHEET_ID = "16keeTLLxphGx7QtfRbtDC7yG1ACxyyQui1KypTX43o4";

const GROUPS = [
  { id: "catalina", label: "Catalina Huanca", color: "bg-blue-600" },
  { id: "contratistas-a", label: "Contratistas - A", color: "bg-red-500" },
  { id: "contratistas-b", label: "Contratistas - B", color: "bg-cyan-500" },
  { id: "contratistas-c", label: "Contratistas - C", color: "bg-amber-500" },
];

const ROLES = [
  { id: "supervisor", label: "Supervisor", color: "bg-cyan-500" },
  { id: "trabajador", label: "Trabajador", color: "bg-emerald-500" },
];

const getLevelConfig = (score: number) => {
  if (score >= 67) return { label: "Alto", color: "text-emerald-500", bg: "bg-emerald-500/10" };
  if (score >= 34) return { label: "Medio", color: "text-amber-500", bg: "bg-amber-500/10" };
  return { label: "Bajo", color: "text-red-500", bg: "bg-red-500/10" };
};

const Silhouette = ({ entry, colorClass }: { entry: DimensionesEntry, colorClass: string }) => {
    const imageSrc = entry.genero === 'FEMENINO' 
        ? "/iconos genero/icono mujer.webp" 
        : "/iconos genero/icono hombre.webp";

    return (
        <motion.div 
            className="relative flex items-center justify-center w-full min-h-[400px]"
            animate={{ 
                y: [-12, 12, -12],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <motion.div 
              className="absolute w-56 h-56 bg-primary/20 blur-[80px] rounded-full"
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className={cn("relative z-10 drop-shadow-[0_0_20px_rgba(15,118,110,0.15)] transition-all duration-1000", colorClass)}>
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <img 
                        src={imageSrc} 
                        alt={entry.genero}
                        className="w-64 h-auto max-h-[350px] object-contain drop-shadow-2xl"
                    />
                </motion.div>
            </div>
            
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-6">
                <motion.div 
                  className="w-full h-full bg-primary/10 rounded-full blur-xl"
                  animate={{ scaleX: [1, 1.6, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
            </div>
        </motion.div>
    );
};

const Gauge = ({ value, color, colorClass }: { value: number, color?: string, colorClass: string }) => {
    const data = [
      { value: value },
      { value: Math.max(0, 100 - value) }
    ];
  
    // Using simple color matching for the gauge based on Tailwind classes if color is not provided
    const fillColor = color || (
        colorClass.includes('emerald') ? '#10b981' : 
        colorClass.includes('amber') ? '#f59e0b' : 
        colorClass.includes('red') ? '#ef4444' : 
        colorClass.includes('cyan') ? '#06b6d4' : 
        colorClass.includes('primary') ? '#0f766e' : '#cbd5e1'
    );

    return (
      <div className="w-24 h-16 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={25}
              outerRadius={38}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              <Cell fill={fillColor} />
              <Cell fill="rgba(0,0,0,0.05)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className={cn("text-[11px] font-black", colorClass)}>{Math.round(value)}%</span>
        </div>
      </div>
    );
};

// ────────────────────────────────────────────────────────────
// OrbCard: círculo orbital con modo desktop y móvil
// ────────────────────────────────────────────────────────────
interface OrbCardProps {
  orb: {
    label: string;
    text: string;
    color: string;
    shadow: string;
    pos?: { x: number; y: number };
  };
  lines: string[];
  delay: number;
}

const OrbCard = ({ orb, lines, delay }: OrbCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isOrbital = !!orb.pos;

  // ── Mobile / Grid mode: tarjeta acordeón ──
  if (!isOrbital) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, delay }}
        className="w-full"
      >
        <div
          onClick={() => setExpanded(v => !v)}
          className={cn(
            "w-full rounded-2xl border-2 border-white/40 cursor-pointer bg-gradient-to-br text-white overflow-hidden shadow-[0_0_30px_-5px]",
            orb.color,
            orb.shadow
          )}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/70 mb-0.5">{orb.label}</p>
              <p className="text-[11px] font-bold text-white leading-tight line-clamp-2">{lines[0] || '—'}</p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0"
            >
              <ChevronRight className="w-4 h-4 text-white/70" />
            </motion.div>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-1.5 border-t border-white/20 pt-3">
                  {lines.map((line, li) => (
                    <p key={li} className="text-[11px] text-white leading-relaxed font-medium">{line}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // ── Desktop / Orbital mode: círculo expansible ──
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{ opacity: 1, scale: 1, x: orb.pos!.x, y: orb.pos!.y }}
      transition={{ type: "spring", damping: 12, delay }}
      className="absolute z-50"
    >
      <motion.div
        layout
        onClick={() => setExpanded(v => !v)}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        animate={expanded
          ? { borderRadius: "1.5rem", width: 260, height: "auto" }
          : { borderRadius: "9999px", width: 160, height: 160 }
        }
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={cn(
          "shadow-[0_0_50px_-5px] flex flex-col items-center justify-center text-white border-2 border-white/40 cursor-pointer bg-gradient-to-br overflow-hidden",
          orb.color,
          orb.shadow
        )}
        style={{ minHeight: expanded ? undefined : 160 }}
      >
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center justify-center w-full h-full px-3 py-3"
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-white/70 text-center mb-1">
                {orb.label}
              </span>
              <span className="text-[9px] font-bold text-white text-center leading-tight line-clamp-3">
                {lines[0] || "—"}
              </span>
              <motion.div
                className="mt-2 flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Info className="w-2.5 h-2.5 text-white/80" />
                <span className="text-[7px] font-black text-white/70 uppercase tracking-widest">Ver más</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full px-5 py-5"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-3 text-center">
                {orb.label}
              </p>
              <div className="space-y-2">
                {lines.map((line, li) => (
                  <p key={li} className="text-[12px] text-white leading-relaxed font-medium">
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const DimensionesPage = () => {
  const [view, setView] = useState<"table" | "analysis">("table");
  const [selectedGroup, setSelectedGroup] = useState("catalina");
  const [selectedRole, setSelectedRole] = useState("supervisor");
  const [search, setSearch] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [diagnosticTab, setDiagnosticTab] = useState<'cultura' | 'comunicación' | 'percepción' | 'liderazgo'>('cultura');

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["dimensionesData", SHEET_ID],
    queryFn: () => fetchDimensionesData(SHEET_ID),
  });

  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    const normalizeSearch = (value: unknown) =>
      String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();

    const searchClean = normalizeSearch(search);
    if (!searchClean) return data.entries;

    const searchAsDni = searchClean.replace(/O/g, "0");

    return data.entries.filter((entry) => {
      const searchableText = [
        entry.nombre,
        entry.dni,
        entry.empresa,
        entry.area,
        entry.cargo,
        entry.ubicacion,
        entry.gradoInstruccion,
        entry.nivel,
        entry.nivelLiderazgo,
        entry.nivelPercepcion,
      ]
        .map(normalizeSearch)
        .join(" ");

      return (
        searchableText.includes(searchClean) ||
        normalizeSearch(entry.dni).includes(searchAsDni)
      );
    });
  }, [data, search]);

  const selectedEntry = useMemo(() => {
    if (!data?.entries || selectedEntryId === null) return null;
    return data.entries.find(e => e.id === selectedEntryId) || null;
  }, [data, selectedEntryId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <RefreshCw className="w-12 h-12 text-primary" />
        </motion.div>
        <p className="text-xs font-black tracking-[0.5em] text-muted-foreground uppercase animate-pulse text-center">
            Analizando Registro de Dimensiones...
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative min-h-[calc(100vh-100px)] flex flex-col selection:bg-primary/20 overflow-x-hidden p-6 md:p-8 space-y-8 bg-slate-50/50">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />

      <DashboardHeader
        title={<>Dimensiones <span className="text-primary not-italic tracking-tighter">Psicológicas</span></>}
        subtitle={view === "table" ? "Registro general de colaboradores evaluados." : "Análisis conductual y predictivo individual."}
        onRefresh={refetch}
        isFetching={isFetching}
        view={view}
        onViewChange={() => {}}
      />

      <div className="flex-1 space-y-12 animate-in fade-in duration-1000">
        
        {view === "analysis" && selectedEntry ? (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
                {/* --- BACK BUTTON & ROLE SELECTOR --- */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <button 
                        onClick={() => setView("table")}
                        className="group flex items-center gap-3 px-6 py-2.5 bg-white shadow-xl hover:shadow-2xl rounded-full border border-slate-100 text-slate-500 hover:text-primary transition-all font-black uppercase text-[10px] tracking-widest active:scale-95 self-start"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Volver al Listado
                    </button>

                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-white/40 shadow-sm">
                        {ROLES.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={cn(
                            "px-8 py-2.5 rounded-full flex items-center gap-4 transition-all duration-500 font-black uppercase tracking-widest text-[10px]",
                            selectedRole === role.id 
                                ? `${role.color} text-white shadow-lg scale-105` 
                                : "text-slate-400 hover:bg-white/50"
                            )}
                        >
                            {role.label}
                            <div className={cn("w-2 h-2 rounded-full", selectedRole === role.id ? "bg-white" : "bg-slate-200")} />
                        </button>
                        ))}
                    </div>
                </div>

                {/* --- MAIN DASHBOARD LAYOUT --- */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white shadow-2xl overflow-hidden relative"
                >
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />

                    {/* TOP: PSICOMETRIC BREAKDOWN */}
                    <div className="lg:col-span-12 mb-6 p-8 bg-white/60 rounded-[3rem] border border-white shadow-xl backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] pointer-events-none">
                            <RefreshCw className="w-64 h-64 text-primary rotate-12" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-1 text-center md:text-left min-w-[200px]">
                                <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-[0.4em]">Arquitectura Psicométrica</h4>
                                <p className="text-[10px] font-bold text-slate-400 italic">Análisis ponderado de competencias.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 w-full">
                                {[
                                    { label: "Liderazgo", wt: "50%", val: selectedEntry.puntuacionLiderazgo, nivel: selectedEntry.nivelLiderazgo, c: "text-blue-600", bg: "bg-blue-500/10", bdr: "border-blue-200" },
                                    { label: "Percepción de Riesgos", wt: "50%", val: selectedEntry.puntuacionPercepcion, nivel: selectedEntry.nivelPercepcion, c: "text-indigo-600", bg: "bg-indigo-500/10", bdr: "border-indigo-200" },
                                    { label: "Total General", wt: "100%", val: selectedEntry.total, nivel: selectedEntry.nivel, c: "text-white", bg: "bg-primary shadow-lg shadow-primary/30", bdr: "border-primary", isTotal: true },
                                ].map((s, i) => (
                                    <div key={i} className={cn(
                                        "flex flex-col items-center gap-2.5 p-5 rounded-3xl transition-all hover:scale-105 border",
                                        s.bg, s.bdr
                                    )}>
                                        <span className={cn("text-[8px] font-black uppercase tracking-widest text-center leading-tight", s.isTotal ? "text-white/70" : "text-slate-400")}>{s.label}</span>
                                        <div className="flex items-baseline gap-0.5">
                                            <span className={cn("text-2xl font-black tracking-tighter", s.c)}>
                                                {s.val}
                                            </span>
                                            <span className={cn("text-[9px] font-bold", s.isTotal ? "text-white/50" : "text-slate-400")}>%</span>
                                        </div>
                                        <div className={cn("w-full h-1.5 rounded-full overflow-hidden", s.isTotal ? "bg-white/20" : "bg-slate-200/50")}>
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${s.val}%` }}
                                                transition={{ duration: 1.5, delay: 0.1 * i }}
                                                className={cn("h-full", s.isTotal ? "bg-white" : s.c.replace('text', 'bg'))}
                                            />
                                        </div>
                                        <Badge className={cn("rounded-full px-3 py-0.5 text-[7px] font-black uppercase tracking-tighter border-none whitespace-nowrap", s.isTotal ? "bg-white/20 text-white/80" : s.bg, !s.isTotal && s.c)}>
                                            {s.nivel}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* LEFT: INFO */}
                    <div className="lg:col-span-3 space-y-4 relative z-10">
                        <h4 className="text-[10px] font-black uppercase text-primary/70 tracking-[0.4em] mb-4 text-center lg:text-left italic">
                            Identidad del Evaluado
                        </h4>
                        {[
                        { label: "Documento de Identidad", icon: IdCard, val: selectedEntry.dni, tint: "bg-purple-500/5 text-purple-600" },
                        { label: "Cargo / Puesto", icon: Briefcase, val: selectedEntry.cargo, tint: "bg-amber-500/5 text-amber-600" },
                        { label: "Área / Empresa", icon: Filter, val: `${selectedEntry.area}-${selectedEntry.empresa}`, tint: "bg-emerald-500/5 text-emerald-600" },
                        ].map((item, i) => (
                        <Popover key={i}>
                            <PopoverTrigger asChild>
                                <div className="bg-white/80 p-5 rounded-3xl border border-white/50 shadow-sm flex items-center gap-4 group hover:bg-white transition-all hover:translate-x-1 duration-500 cursor-pointer relative overflow-hidden">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", item.tint)}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1.5">{item.label}</p>
                                        <p className="text-xs font-black text-slate-700 truncate">{item.val}</p>
                                    </div>
                                    <Info className="w-3 h-3 text-slate-200 md:hidden absolute top-4 right-4" />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent side="right" align="start" className="bg-slate-900 text-white border-none rounded-xl p-4 font-bold text-[10px] uppercase tracking-widest px-6 shadow-2xl backdrop-blur-xl z-[100] w-auto max-w-[250px]">
                                <p className="mb-1 text-white/50 text-[8px]">{item.label}</p>
                                {item.val}
                            </PopoverContent>
                        </Popover>
                        ))}
                    </div>

                    {/* CENTER: SILHOUETTE */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-10 z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-10"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-3 block italic">Colaborador Evaluado</span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-800 leading-none drop-shadow-sm cursor-help hover:text-primary transition-colors">
                                        {selectedEntry.nombre}
                                    </h2>
                                </TooltipTrigger>
                                <TooltipContent className="bg-primary text-white border-none rounded-xl p-3 font-black text-xs uppercase tracking-[0.2em] px-8 shadow-2xl">
                                    {selectedEntry.nombre}
                                </TooltipContent>
                            </Tooltip>
                            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mt-6 rounded-full" />
                        </motion.div>

                        <Silhouette 
                            entry={selectedEntry} 
                            colorClass={selectedRole === "supervisor" ? "text-cyan-500" : "text-emerald-500"} 
                        />
                    </div>

                    {/* RIGHT: RESULTS */}
                    <div className="lg:col-span-4 space-y-6 relative z-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-center text-slate-400 italic mb-4">Análisis Predictivo</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { 
                                    title: "Liderazgo", 
                                    score: selectedEntry.puntuacionLiderazgo, 
                                    icon: Zap,
                                    color: "indigo-500",
                                    gradient: "from-indigo-500/10 to-transparent",
                                    insightLabel: `Nivel: ${selectedEntry.nivelLiderazgo}`,
                                    text: selectedEntry.perfilLiderazgo || "Fortalecer la influencia en campo y la proactividad para consolidar un liderazgo más efectivo."
                                },
                                { 
                                    title: "Percepción de Riesgos", 
                                    score: selectedEntry.puntuacionPercepcion, 
                                    icon: Shield,
                                    color: "primary",
                                    gradient: "from-primary/10 to-transparent",
                                    insightLabel: `Nivel: ${selectedEntry.nivelPercepcion}`,
                                    text: selectedEntry.perfilPercepcion || "El colaborador demuestra un enfoque preventivo integrado. Se sugiere mantener el refuerzo positivo en la detección precoz de riesgos."
                                }
                            ].map((res, idx) => {
                                const cfg = getLevelConfig(res.score);
                                return (
                                    <div key={idx} className="group relative overflow-hidden p-1 rounded-[2rem] transition-all hover:scale-[1.01] duration-500">
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", res.gradient)} />
                                        <div className="relative flex items-center gap-6 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl h-full">
                                            <div className="flex flex-col items-center justify-center shrink-0 w-24 space-y-2 pr-6 border-r border-slate-100">
                                                <Gauge 
                                                    value={res.score} 
                                                    colorClass={cfg.color}
                                                />
                                                <Badge className={cn("rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-tighter border-none whitespace-nowrap", cfg.bg, cfg.color)}>
                                                    {cfg.label}
                                                </Badge>
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <h5 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", idx === 0 ? "text-indigo-400" : "text-primary/60")}>{res.title}</h5>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div className="flex items-start gap-2 cursor-pointer group/text">
                                                            <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic line-clamp-3 uppercase tracking-tighter flex-1">
                                                                "{res.text}"
                                                            </p>
                                                            <Info className="w-3 h-3 text-slate-300 group-hover/text:text-primary shrink-0 mt-1 md:hidden" />
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent side="bottom" className="w-[320px] bg-slate-900/95 text-white border-none rounded-2xl p-6 font-bold text-[11px] leading-relaxed shadow-2xl backdrop-blur-xl italic z-[100]">
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                                                                <res.icon className={cn("w-4 h-4", idx === 0 ? "text-indigo-400" : "text-primary")} />
                                                                <span className="text-[9px] font-black uppercase tracking-widest">{res.title}</span>
                                                            </div>
                                                            <p>"{res.text}"</p>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 block pt-1">{res.insightLabel}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </motion.div>
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                        <Input 
                            className="pl-12 h-14 bg-white border-white rounded-[1.5rem] shadow-xl focus:ring-primary/20 transition-all font-black uppercase text-xs tracking-widest placeholder:text-slate-200"
                            placeholder="Buscar en el registro maestro..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-[2rem] border border-white">
                        {GROUPS.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedGroup(group.id)}
                            className={cn(
                            "px-6 py-2.5 rounded-[1.2rem] flex items-center gap-2 transition-all duration-300 font-black text-[10px] uppercase tracking-widest",
                            selectedGroup === group.id ? `${group.color} text-white shadow-lg scale-105` : "text-slate-400 hover:bg-white"
                            )}
                        >
                            {group.label}
                        </button>
                        ))}
                    </div>
                </div>

                <GlassCard className="rounded-[3rem] overflow-hidden border border-white p-2 shadow-2xl bg-white/80">
                  <div className="max-h-[750px] overflow-y-auto overflow-x-auto custom-scrollbar relative">
                    <Table>
                        <TableHeader className="bg-slate-100/90 backdrop-blur-md sticky top-0 z-40">
                            <TableRow className="hover:bg-transparent border-b border-slate-100">
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4 px-10 sticky top-0 bg-slate-100/90 z-40 shadow-sm">ID</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Colaborador</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Identidad</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Cargo Actual</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4 text-center sticky top-0 bg-slate-100/90 z-40 shadow-sm">Liderazgo</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4 text-center sticky top-0 bg-slate-100/90 z-40 shadow-sm">Percepción</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4 text-right px-10 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Dimensiones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEntries.map((e) => (
                                <TableRow 
                                    key={e.id} 
                                    className="hover:bg-primary/5 transition-all border-b border-slate-50 cursor-pointer group/row"
                                    onClick={() => {
                                        setSelectedEntryId(e.id);
                                        setView("analysis");
                                    }}
                                >
                                    <TableCell className="font-mono text-[10px] text-slate-300 py-6 px-10 italic">#{e.id}</TableCell>
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="font-black text-xs text-slate-700 uppercase tracking-tight group-hover/row:text-primary transition-colors truncate max-w-[180px] cursor-pointer flex items-center gap-2">
                                                    {e.nombre}
                                                    <Info className="w-3 h-3 text-slate-200 md:hidden" />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="bg-slate-900 text-white border-none rounded-xl p-3 font-bold text-[10px] uppercase tracking-widest px-6 shadow-2xl z-[100]">
                                                {e.nombre}
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell className="font-black text-[10px] text-slate-400 tracking-tighter">{e.dni}</TableCell>
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="font-bold text-[10px] text-slate-500 italic uppercase tracking-tighter truncate max-w-[150px] cursor-pointer flex items-center gap-2">
                                                    {e.cargo}
                                                    <Info className="w-3 h-3 text-slate-200 md:hidden" />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="bg-slate-800 text-white border-none rounded-lg p-2 font-bold text-[9px] uppercase tracking-wider z-[100]">
                                                {e.cargo}
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={cn("rounded-full border-none px-4", getLevelConfig(e.puntuacionLiderazgo).bg, getLevelConfig(e.puntuacionLiderazgo).color)}>
                                            {getLevelConfig(e.puntuacionLiderazgo).label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={cn("rounded-full border-none px-4", getLevelConfig(e.puntuacionPercepcion).bg, getLevelConfig(e.puntuacionPercepcion).color)}>
                                            {getLevelConfig(e.puntuacionPercepcion).label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-10">
                                        <div className="flex justify-end">
                                            <div className="px-5 py-2 bg-slate-100 group-hover/row:bg-primary group-hover/row:text-white text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2">
                                                Analizar <ChevronRight className="w-3 h-3 transition-transform group-hover/row:translate-x-1" />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                  </div>
                </GlassCard>
            </div>
        )}

        {/* --- DIAGNÓSTICO SISTÉMICO AVANZADO --- */}
        {view === "analysis" && selectedEntry && data && (
            <div className="max-w-6xl mx-auto space-y-12 pb-24 mt-20 relative px-4">
                <div className="text-center space-y-4">
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] text-slate-800">
                        Diagnóstico Sistémico Avanzado
                    </h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
                        Análisis comparativo de alta fidelidad basado en metodología TASC
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16 bg-slate-900/5 backdrop-blur-3xl p-6 md:p-10 lg:p-12 rounded-[2rem] lg:rounded-[5rem] border border-white/50 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-indigo-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    {/* LEFT: LEGEND & SELECTOR */}
                    <div className="w-full lg:w-72 space-y-8 relative z-10">
                        <div className="flex flex-col gap-3">
                            {[
                                { id: 'cultura', label: 'Cultura de seguridad', icon: Zap, color: 'text-amber-500' },
                                { id: 'comunicación', label: 'Comunicación', icon: Shield, color: 'text-indigo-500' },
                                { id: 'percepción', label: 'Percepción de riesgos', icon: LayoutDashboard, color: 'text-primary' },
                                { id: 'liderazgo', label: 'Liderazgo', icon: Activity, color: 'text-rose-500' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setDiagnosticTab(tab.id as any)}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 border-2 font-black uppercase tracking-widest text-[9px]",
                                        diagnosticTab === tab.id 
                                            ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-105" 
                                            : "bg-white border-white text-slate-400 hover:border-primary/20"
                                    )}
                                >
                                    <tab.icon className={cn("w-4 h-4", diagnosticTab === tab.id ? tab.color : "text-slate-300")} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-slate-200/50">
                            {[
                                { label: 'Tipo', color: 'bg-[#2DD4BF]', border: 'border-[#2DD4BF]' },
                                { label: 'FORTALEZAS CLAVE', color: 'bg-[#3B82F6]', border: 'border-[#3B82F6]' },
                                { label: 'Riesgos o puntos críticos', color: 'bg-[#FBBF24]', border: 'border-[#FBBF24]' },
                                { label: 'ENFOQUE DE MEJORA', color: 'bg-[#EF4444]', border: 'border-[#EF4444]' },
                            ].map((leg, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={cn("w-3 h-3 rounded-full shadow-lg", leg.color, leg.border)} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{leg.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CENTER: ORBITAL VISUALIZATION */}
                    {(() => {
                        const getReport = (e: DimensionesEntry): DimensionReport | undefined =>
                            diagnosticTab === 'cultura' ? e.culturaReport :
                            diagnosticTab === 'comunicación' ? e.comunicacionReport :
                            diagnosticTab === 'percepción' ? e.percepcionReport :
                            e.liderazgoReport;

                        const report = getReport(selectedEntry);

                        const getLines = (text: string) => text
                            .split('\n')
                            .map(l => l.replace(/^[-\s]+/, '').trim())
                            .filter(Boolean);

                        const orbits = [
                            { label: 'TIPO', text: report?.tipo || '—', color: 'from-[#2DD4BF] to-teal-700', shadow: 'shadow-[#2DD4BF]/50', pos: { x: -175, y: -175 } },
                            { label: 'FORTALEZAS CLAVE', text: report?.fortalezas || '—', color: 'from-[#3B82F6] to-blue-800', shadow: 'shadow-[#3B82F6]/50', pos: { x: 175, y: -175 } },
                            { label: 'Riesgos críticos', text: report?.riesgos || '—', color: 'from-[#FBBF24] to-amber-700', shadow: 'shadow-[#FBBF24]/50', pos: { x: 175, y: 175 } },
                            { label: 'ENFOQUE DE MEJORA', text: report?.enfoque || '—', color: 'from-[#EF4444] to-red-800', shadow: 'shadow-[#EF4444]/50', pos: { x: -175, y: 175 } },
                        ];

                        const currentScore = Math.round(
                            diagnosticTab === 'cultura' ? selectedEntry.total :
                            diagnosticTab === 'comunicación' ? selectedEntry.total :
                            diagnosticTab === 'percepción' ? selectedEntry.puntuacionPercepcion :
                            selectedEntry.puntuacionLiderazgo
                        );

                        return (
                            <>
                                {/* ── DESKTOP (lg+): layout orbital ── */}
                                <div className="hidden lg:flex flex-1 relative items-center justify-center min-h-[600px] perspective-1000">
                                    {/* Glowing Radial Spikes */}
                                    <div className="absolute z-0 w-[500px] h-[500px] flex items-center justify-center">
                                        {[...Array(60)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-[2px] bg-gradient-to-t from-primary/60 to-transparent"
                                                style={{
                                                    height: `${20 + Math.random() * 40}px`,
                                                    transform: `rotate(${i * 6}deg) translateY(-140px)`,
                                                    transformOrigin: "bottom center",
                                                }}
                                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.05 }}
                                            />
                                        ))}
                                    </div>
                                    {/* Rings */}
                                    <div className="absolute w-[450px] h-[450px] border border-primary/30 rounded-full" />
                                    <div className="absolute w-[300px] h-[300px] border border-indigo-500/20 rounded-full" />
                                    <motion.div
                                        className="absolute w-[380px] h-[380px] border-t-2 border-primary/60 border-l-2 border-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Nucleus */}
                                    <div className="relative z-40">
                                        <motion.div
                                            className="w-48 h-48 rounded-full bg-slate-900 flex flex-col items-center justify-center border-[8px] border-white relative overflow-hidden"
                                            animate={{ boxShadow: ["0 0 50px rgba(45,212,191,0.2)", "0 0 100px rgba(45,212,191,0.5)", "0 0 50px rgba(45,212,191,0.2)"] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800" />
                                            <div className="relative z-10 flex flex-col items-center">
                                                <span className="text-5xl font-black text-white">
                                                    {currentScore}<span className="text-xl text-primary">%</span>
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">EVALUADO</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="absolute -inset-4 border border-primary/30 rounded-full z-30"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                    {/* Orbital OrbCards */}
                                    {orbits.map((orb, i) => (
                                        <OrbCard key={i} orb={orb} lines={getLines(orb.text)} delay={i * 0.12} />
                                    ))}
                                    {/* Glow */}
                                    <div className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                                </div>

                                {/* ── MOBILE (<lg): mêni núcleus + grid 2×2 ── */}
                                <div className="flex lg:hidden flex-col items-center gap-5 w-full">
                                    {/* Mini Nucleus */}
                                    <motion.div
                                        className="w-28 h-28 rounded-full bg-slate-900 flex flex-col items-center justify-center border-4 border-white relative overflow-hidden"
                                        animate={{ boxShadow: ["0 0 30px rgba(45,212,191,0.2)", "0 0 60px rgba(45,212,191,0.5)", "0 0 30px rgba(45,212,191,0.2)"] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800" />
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="text-3xl font-black text-white">
                                                {currentScore}<span className="text-sm text-primary">%</span>
                                            </span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-0.5">EVALUADO</span>
                                        </div>
                                    </motion.div>
                                    {/* 2×2 Grid */}
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        {orbits.map((orb, i) => (
                                            <OrbCard
                                                key={i}
                                                orb={{ ...orb, pos: undefined }}
                                                lines={getLines(orb.text)}
                                                delay={i * 0.08}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>

                <div className="bg-white/40 p-10 rounded-[3rem] border border-white shadow-xl text-center italic text-slate-400 text-xs font-bold leading-relaxed max-w-3xl mx-auto">
                    "El análisis sistémico compara el perfil individual contra métricas agregadas de alta relevancia operativa. Este modelo permite identificar brechas críticas frente al estándar del proyecto y promedios de la industria."
                </div>
            </div>
        )}

        {/* --- FOOTER: TASC --- */}
        <div className="max-w-4xl mx-auto space-y-6 pt-10 border-t border-slate-100">
            <h4 className="text-center font-black uppercase tracking-widest text-primary/40 text-[10px] italic">
                {view === "analysis" ? "Resumen de Identificación de Riesgos" : "Gestión General de Dimensiones Psicológicas"}
            </h4>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default DimensionesPage;
