import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
  ArrowLeft
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GlassCard } from "@/components/dashboard/DashboardCards";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchDimensionesData, DimensionesEntry } from "@/lib/sheets-adapter";
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
  if (score >= 80) return { label: "Óptimo", color: "text-emerald-500", bg: "bg-emerald-500/10" };
  if (score >= 60) return { label: "Alto", color: "text-blue-500", bg: "bg-blue-500/10" };
  if (score >= 40) return { label: "Medio", color: "text-amber-500", bg: "bg-amber-500/10" };
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

export default function DimensionesPage() {
  const [view, setView] = useState<"table" | "analysis">("table");
  const [selectedGroup, setSelectedGroup] = useState("catalina");
  const [selectedRole, setSelectedRole] = useState("supervisor");
  const [search, setSearch] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["dimensionesData", SHEET_ID],
    queryFn: () => fetchDimensionesData(SHEET_ID),
  });

  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    return data.entries.filter(e => 
        e.nombre.toLowerCase().includes(search.toLowerCase()) || 
        e.dni.includes(search)
    );
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

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 flex-1 w-full">
                                {[
                                    { label: "LBA II", wt: "30%", val: selectedEntry.lbaScore, c: "text-blue-600", bg: "bg-blue-500/10", bdr: "border-blue-200" },
                                    { label: "Belbin", wt: "20%", val: selectedEntry.belbinScore, c: "text-purple-600", bg: "bg-purple-500/10", bdr: "border-purple-200" },
                                    { label: "EMA", wt: "15%", val: selectedEntry.emaScore, c: "text-rose-600", bg: "bg-rose-500/10", bdr: "border-rose-200" },
                                    { label: "Big Five", wt: "20%", val: selectedEntry.bigFiveScore, c: "text-amber-600", bg: "bg-amber-500/10", bdr: "border-amber-200" },
                                    { label: "Entrevista", wt: "15%", val: selectedEntry.entrevistaScore, c: "text-indigo-600", bg: "bg-indigo-500/10", bdr: "border-indigo-200" },
                                    { label: "Total", wt: "100%", val: selectedEntry.total, c: "text-white", bg: "bg-primary shadow-lg shadow-primary/30", bdr: "border-primary", isTotal: true },
                                ].map((s, i) => (
                                    <div key={i} className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-3xl transition-all hover:scale-105 border",
                                        s.bg, s.bdr
                                    )}>
                                        <span className={cn("text-[8px] font-black uppercase tracking-widest", s.isTotal ? "text-white/70" : "text-slate-400")}>{s.label}</span>
                                        <div className="flex items-baseline gap-0.5">
                                            <span className={cn("text-xl font-black tracking-tighter", s.c)}>
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
                                        <span className={cn("text-[7px] font-black uppercase tracking-tight", s.isTotal ? "text-white/60" : "text-slate-300")}>{s.wt} Peso</span>
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
                        { label: "Nombre Completo", icon: User, val: selectedEntry.nombre, tint: "bg-blue-500/5 text-blue-600" },
                        { label: "Documento de Identidad", icon: IdCard, val: selectedEntry.dni, tint: "bg-purple-500/5 text-purple-600" },
                        { label: "Cargo / Puesto", icon: Briefcase, val: selectedEntry.cargo, tint: "bg-amber-500/5 text-amber-600" },
                        { label: "Área / Empresa", icon: Filter, val: `${selectedEntry.area} - ${selectedEntry.empresa}`, tint: "bg-emerald-500/5 text-emerald-600" },
                        ].map((item, i) => (
                        <div key={i} className="bg-white/80 p-5 rounded-3xl border border-white/50 shadow-sm flex items-center gap-4 group hover:bg-white transition-all hover:translate-x-1 duration-500">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", item.tint)}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1.5">{item.label}</p>
                                <p className="text-xs font-black text-slate-700 truncate">{item.val}</p>
                            </div>
                        </div>
                        ))}
                    </div>

                    {/* CENTER: SILHOUETTE */}
                    <div className="lg:col-span-4 flex justify-center relative py-10 z-10">
                        <Silhouette 
                            entry={selectedEntry} 
                            colorClass={selectedRole === "supervisor" ? "text-cyan-500" : "text-emerald-500"} 
                        />
                    </div>

                    {/* RIGHT: RESULTS */}
                    <div className="lg:col-span-5 space-y-6 relative z-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-center text-slate-400 italic mb-4">Análisis Predictivo</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { 
                                    title: "Percepción de Riesgo", 
                                    score: selectedEntry.puntuacionPercepcion, 
                                    icon: Shield,
                                    color: "primary",
                                    gradient: "from-primary/10 to-transparent",
                                    insightLabel: "Insight Preventivo",
                                    text: "El colaborador demuestra un enfoque preventivo integrado. Se sugiere mantener el refuerzo positivo en la detección precoz de riesgos."
                                },
                                { 
                                    title: "LLeadership (LBA II)", 
                                    score: selectedEntry.puntuacionLiderazgo, 
                                    icon: Zap,
                                    color: "indigo-500",
                                    gradient: "from-indigo-500/10 to-transparent",
                                    insightLabel: "Estrategia de Mejora",
                                    text: selectedEntry.perfil || "Fortalecer la influencia en campo y la proactividad para consolidar un liderazgo más efectivo."
                                }
                            ].map((res, idx) => {
                                const cfg = getLevelConfig(res.score);
                                return (
                                    <div key={idx} className="group relative overflow-hidden p-1 rounded-[2rem] transition-all hover:scale-[1.01] duration-500">
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", res.gradient)} />
                                        <div className="relative flex items-center gap-6 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl h-full">
                                            <div className="flex flex-col items-center justify-center shrink-0 w-24 space-y-3 pr-6 border-r border-slate-100">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6", cfg.bg, cfg.color)}>
                                                    <res.icon className="w-6 h-6" />
                                                </div>
                                                <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-tighter border-none", cfg.bg, cfg.color)}>
                                                    {cfg.label}
                                                </Badge>
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <h5 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", idx === 0 ? "text-primary/60" : "text-indigo-400")}>{res.title}</h5>
                                                <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic line-clamp-3 uppercase tracking-tighter">"{res.text}"</p>
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
                                    <TableCell className="font-black text-xs text-slate-700 uppercase tracking-tight group-hover/row:text-primary transition-colors">{e.nombre}</TableCell>
                                    <TableCell className="font-black text-[10px] text-slate-400 tracking-tighter">{e.dni}</TableCell>
                                    <TableCell className="font-bold text-[10px] text-slate-500 italic uppercase tracking-tighter">{e.cargo}</TableCell>
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

        {/* --- FOOTER: TASC --- */}
        <div className="max-w-4xl mx-auto space-y-6 pt-10">
            <h4 className="text-center font-black uppercase tracking-widest text-primary/40 text-xs italic">
                {view === "analysis" ? "Diagnóstico Sistémico Avanzado" : "Gestión General de Dimensiones Psicológicas"}
            </h4>
            <div className="bg-white p-10 rounded-[4rem] border border-white shadow-2xl text-center italic text-slate-400 text-[11px] font-bold leading-relaxed tracking-tight group hover:bg-primary hover:text-white transition-all duration-700">
               "El flujo de análisis drill-down permite una identificación precisa de causas raíz (TASC), optimizando la intervención preventiva basada en datos individuales del repositorio de alta fidelidad."
            </div>
        </div>
      </div>
    </div>
  );
}
