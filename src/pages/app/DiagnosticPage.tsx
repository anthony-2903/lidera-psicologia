import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSheetData, fetchRawRows, SheetRow } from "@/lib/sheets-adapter";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Loader2, RefreshCw, AlertCircle, ClipboardCheck, Users, Activity,
  BarChart3, TableIcon, Search, X, Eye, EyeOff, User,
  Calendar, Building2, Briefcase, GraduationCap, ArrowLeft, ChevronRight,
  Pencil, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SHEET_ID = "1abuYNzrdEH_6YCzlq31SAA9zLrbov0kt03gWNQPKUeU";

const COLORS_STATUS = {
  completo:  "hsl(142, 71%, 45%)",
  proceso:   "hsl(38,  92%, 50%)",
  falta:     "hsl(10,  81%, 59%)",
  realizado: "hsl(212, 52%, 25%)",
};

const normalise = (v: string) => (v || "").toUpperCase().trim();

const statusBadge = (value: string) => {
  const v = normalise(value);
  if (v === "COMPLETO" || v === "REALIZADO")
    return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-bold text-[10px]">{value || "—"}</Badge>;
  if (v === "PROCESO")
    return <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 font-bold text-[10px]">{value || "—"}</Badge>;
  if (v === "FALTA")
    return <Badge className="bg-red-500/15 text-red-700 border-red-500/30 font-bold text-[10px]">{value || "—"}</Badge>;
  return <span className="text-muted-foreground text-xs">{value || "—"}</span>;
};

const statusColor = (v: string) => {
  const n = normalise(v);
  if (n === "COMPLETO" || n === "REALIZADO") return COLORS_STATUS.completo;
  if (n === "PROCESO") return COLORS_STATUS.proceso;
  return COLORS_STATUS.falta;
};

/* ─────────────────────────────────────────────── */
/* PERSON DETAIL PANEL (slides in from right)      */
/* ─────────────────────────────────────────────── */
const PersonPanel = ({ row, onClose }: { row: SheetRow; onClose: () => void }) => {
  const evaluations = [
    { name: "Batería Psicológica",      raw: row["BATERIAS PSICOLOGICAS"],       color: statusColor(row["BATERIAS PSICOLOGICAS"]) },
    { name: "Entrevista por Competencias", raw: row["ENTREVISTA POR COMPETENCIAS"], color: statusColor(row["ENTREVISTA POR COMPETENCIAS"]) },
    { name: "Estado General",           raw: row.ESTADO,                         color: statusColor(row.ESTADO) },
  ];

  const completedCount = evaluations.filter(
    (d) => normalise(d.raw) === "COMPLETO" || normalise(d.raw) === "REALIZADO"
  ).length;
  const progressPct = Math.round((completedCount / 3) * 100);

  const info = [
    { icon: Building2,     label: "Empresa",           value: row.EMPRESA },
    { icon: Briefcase,     label: "Puesto",             value: row.PUESTO },
    { icon: GraduationCap, label: "Grado Instrucción",  value: row["GRADO DE INSTRUCCIÓN"] },
    { icon: Calendar,      label: "Fecha de Evaluación",value: row["FECHA DE EVALUACION" as keyof SheetRow] as string },
  ];

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-400">
      {/* Header */}
      <div className="px-5 py-5 border-b border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 shrink-0">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              {row.ÁREA || "Sin Área"} · N° {row.N}
            </p>
            <h3 className="text-base font-black text-foreground leading-tight mt-0.5">
              {row["APELLIDOS Y NOMBRES"] || "Sin nombre"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{row.DNI || "—"}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-muted-foreground">Avance Global</span>
            <span className="text-primary">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-1.5" />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Info */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Información</p>
          <div className="space-y-1.5">
            {info.map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/30 border border-border/20">
                <item.icon className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground leading-tight">{item.label}</p>
                  <p className="text-xs font-semibold text-foreground truncate">{item.value || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluations */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Evaluaciones</p>
          <div className="space-y-1.5">
            {evaluations.map((d) => (
              <div key={d.name}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl border bg-card/60"
                style={{ borderColor: `${d.color}25` }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs font-semibold text-foreground">{d.name}</span>
                </div>
                {statusBadge(d.raw)}
              </div>
            ))}
          </div>
        </div>

        {/* Visual donut */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Resumen Visual</p>
          <div className="bg-muted/20 rounded-2xl border border-border/20 p-3">
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={evaluations.map((d) => ({ name: d.name, value: 1, color: d.color }))}
                    cx="50%" cy="50%"
                    innerRadius={42} outerRadius={68}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {evaluations.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "none", fontSize: "10px" }}
                    formatter={(value, name) => [evaluations.find(e => e.name === name)?.raw || "—", name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {evaluations.map((d) => (
                <div key={d.name} className="flex items-center gap-1 text-[8px] font-black uppercase">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground truncate max-w-[80px]">{d.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────── */
/* TABLE VIEW (full page, not modal)               */
/* ─────────────────────────────────────────────── */
const TableView = ({
  rawRows, loadingRaw, onBack,
}: {
  rawRows: SheetRow[];
  loadingRaw: boolean;
  onBack: () => void;
}) => {
  const [search, setSearch]             = useState("");
  const [areaFilter, setAreaFilter]     = useState("TODOS");
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [selectedRow, setSelectedRow]   = useState<SheetRow | null>(null);
  const [allRevealed, setAllRevealed]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SheetRow | null>(null);

  const SHEET_EDIT_URL = `https://docs.google.com/spreadsheets/d/${"1abuYNzrdEH_6YCzlq31SAA9zLrbov0kt03gWNQPKUeU"}/edit`;

  const toggleReveal = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedRows((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const handleRevealAll = () => {
    if (allRevealed) {
      setRevealedRows(new Set());
      setAllRevealed(false);
    } else {
      setRevealedRows(new Set(filteredRows.map((_, i) => i)));
      setAllRevealed(true);
    }
  };

  const handleEditRow = (row: SheetRow, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(SHEET_EDIT_URL, "_blank");
  };

  const handleConfirmDelete = () => {
    // Cannot delete programmatically without Google Sheets API + OAuth.
    // Direct user to the Sheet to delete manually.
    window.open(SHEET_EDIT_URL, "_blank");
    setDeleteTarget(null);
  };

  const uniqueAreas = useMemo(() => {
    const areas = [...new Set(rawRows.map((r) => r.ÁREA || "Sin Área"))];
    return ["TODOS", ...areas];
  }, [rawRows]);

  const filteredRows = useMemo(() => rawRows.filter((row) => {
    const matchArea = areaFilter === "TODOS" || (row.ÁREA || "Sin Área") === areaFilter;
    const term = search.toLowerCase();
    return matchArea && (!term
      || (row["APELLIDOS Y NOMBRES"] || "").toLowerCase().includes(term)
      || (row.DNI || "").toLowerCase().includes(term)
      || (row.EMPRESA || "").toLowerCase().includes(term)
      || (row.PUESTO || "").toLowerCase().includes(term));
  }), [rawRows, search, areaFilter]);

  return (
    /* Escape the container padding to fill all available width/height */
    <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 -mb-4 md:-mb-8 flex flex-col animate-in fade-in slide-in-from-right-3 duration-400"
      style={{ height: "calc(100vh - 80px)" }}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
                      px-4 md:px-8 py-3 border-b border-border/40 bg-card/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" onClick={onBack}
            className="gap-2 font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:text-primary p-0 h-auto shrink-0">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Volver
          </Button>
          <div className="h-5 w-px bg-border/50 shrink-0" />
          <h2 className="text-sm font-black uppercase tracking-tight text-foreground truncate">
            Tabla — Seguimiento de Aplicación
          </h2>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold shrink-0">
            {filteredRows.length} reg.
          </Badge>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Area pills */}
          <div className="hidden lg:flex gap-1.5 flex-wrap">
            {uniqueAreas.map((area) => (
              <button key={area} onClick={() => setAreaFilter(area)}
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border transition-all",
                  areaFilter === area
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/60 text-muted-foreground border-border/40 hover:bg-muted"
                )}>
                {area}
              </button>
            ))}
          </div>
          {/* Reveal All toggle */}
          <button
            onClick={handleRevealAll}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-all",
              allRevealed
                ? "bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/25"
                : "bg-muted text-muted-foreground border-border/40 hover:bg-muted/80"
            )}
          >
            {allRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {allRevealed ? "Ocultar Todo" : "Revelar Todo"}
          </button>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs rounded-xl bg-background/80 border-border/40 w-44 md:w-56"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile area pills */}
      <div className="lg:hidden flex gap-2 flex-wrap px-4 py-2 border-b border-border/30 bg-muted/10 shrink-0">
        {uniqueAreas.map((area) => (
          <button key={area} onClick={() => setAreaFilter(area)}
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border transition-all",
              areaFilter === area
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/60 text-muted-foreground border-border/40"
            )}>
            {area}
          </button>
        ))}
      </div>

      {/* ── Main content: table + person panel ── */}
      <div className="flex-1 overflow-hidden flex min-h-0">

        {/* Table */}
        <div className={cn(
          "flex-1 overflow-auto min-w-0 transition-all duration-500",
          selectedRow ? "hidden lg:block" : ""
        )}>
          {loadingRaw ? (
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">Cargando datos del Sheet...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted/90 backdrop-blur-md border-b border-border/50">
                  {[
                    { label: "N°",     w: "w-10"  },
                    { label: "Apellidos y Nombres", w: "min-w-[180px]" },
                    { label: "DNI",    w: ""       },
                    { label: "Empresa",w: ""       },
                    { label: "Área",   w: ""       },
                    { label: "Puesto", w: "min-w-[120px]" },
                    { label: "Grado",  w: "min-w-[100px]" },
                    { label: "Batería Psic.", w: "" },
                    { label: "Entrevista",   w: "" },
                    { label: "Estado",       w: "" },
                    { label: "Fecha Eval.",  w: "" },
                    { label: "Acciones",     w: "w-24 text-right" },
                  ].map(({ label, w }) => (
                    <th key={label}
                      className={cn("px-4 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap", w)}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-24 text-muted-foreground text-sm">
                      No se encontraron registros
                    </td>
                  </tr>
                ) : filteredRows.map((row, idx) => {
                  const isSelected = selectedRow === row;
                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedRow(isSelected ? null : row)}
                      className={cn(
                        "border-b border-border/10 transition-all duration-200 cursor-pointer group",
                        isSelected
                          ? "bg-primary/8 border-l-[3px] border-l-primary"
                          : idx % 2 === 0
                            ? "hover:bg-primary/5"
                            : "bg-muted/10 hover:bg-primary/5"
                      )}
                    >
                      <td className="px-4 py-2.5 text-xs font-bold text-muted-foreground/60 whitespace-nowrap">{row.N || idx + 1}</td>

                      {/* Name — blurred / revealed */}
                      <td className="px-4 py-2.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-xs font-semibold transition-all duration-300 block max-w-[160px] truncate",
                            revealedRows.has(idx)
                              ? "text-foreground"
                              : "blur-[3px] text-muted-foreground pointer-events-none select-none"
                          )}>
                            {row["APELLIDOS Y NOMBRES"] || "—"}
                          </span>
                          <button
                            onClick={(e) => toggleReveal(idx, e)}
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-all"
                          >
                            {revealedRows.has(idx) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{row.DNI || "—"}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{row.EMPRESA || "—"}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{row.ÁREA || "—"}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{row.PUESTO || "—"}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{row["GRADO DE INSTRUCCIÓN"] || "—"}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">{statusBadge(row["BATERIAS PSICOLOGICAS"])}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">{statusBadge(row["ENTREVISTA POR COMPETENCIAS"])}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">{statusBadge(row.ESTADO)}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {(row as any)["FECHA DE EVALUACION"] || "—"}
                      </td>
                      {/* Actions */}
                      <td className="px-3 py-2.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleEditRow(row, e)}
                            title="Editar en Google Sheets"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500/15 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
                            title="Eliminar fila"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/15 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Person detail side panel ── */}
        <div className={cn(
          "shrink-0 border-l border-border/40 bg-card overflow-hidden transition-all duration-500",
          selectedRow
            ? "w-full lg:w-[340px] xl:w-[380px] opacity-100"
            : "w-0 opacity-0 border-0"
        )}>
          {selectedRow && (
            <PersonPanel row={selectedRow} onClose={() => setSelectedRow(null)} />
          )}
        </div>


      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-card rounded-2xl shadow-2xl border border-border/40 p-6 max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-foreground">Eliminar registro</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Acción irreversible</p>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-3 mb-5 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registro seleccionado</p>
              <p className="text-sm font-bold text-foreground">{deleteTarget["APELLIDOS Y NOMBRES"] || "Sin nombre"}</p>
              <p className="text-xs text-muted-foreground">{deleteTarget.ÁREA} · {deleteTarget.PUESTO}</p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              La eliminación de registros debe realizarse directamente en
              <strong> Google Sheets</strong>. Al confirmar, se abrirá el documento en una nueva pestaña para que puedas eliminar la fila manualmente.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-10 rounded-xl border border-border/40 text-xs font-black uppercase tracking-wide text-muted-foreground hover:bg-muted transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-wide hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Ir al Sheet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

};

/* ─────────────────────────────────────────────── */
/* MAIN PAGE                                       */
/* ─────────────────────────────────────────────── */
const DiagnosticPage = () => {
  const [view, setView] = useState<"dashboard" | "table">("dashboard");

  const { data: groupMetrics = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["sheetData", SHEET_ID],
    queryFn: () => fetchSheetData(SHEET_ID),
  });

  const { data: rawRows = [], isLoading: loadingRaw } = useQuery({
    queryKey: ["rawRows", SHEET_ID],
    queryFn: () => fetchRawRows(SHEET_ID),
    enabled: view === "table",
  });

  const globalStats = useMemo(() => {
    const s = {
      total: 0,
      psychology: { completo: 0, proceso: 0, falta: 0 },
      interview:  { realizado: 0, falta: 0 },
      status:     { completo: 0, proceso: 0, falta: 0 },
    };
    groupMetrics.forEach((g) => {
      s.total               += g.total;
      s.psychology.completo += g.psychologyStats.completo;
      s.psychology.proceso  += g.psychologyStats.proceso;
      s.psychology.falta    += g.psychologyStats.falta;
      s.interview.realizado += g.interviewStats.realizado;
      s.interview.falta     += g.interviewStats.falta;
      s.status.completo     += g.statusStats.completo;
      s.status.proceso      += g.statusStats.proceso;
      s.status.falta        += g.statusStats.falta;
    });
    return s;
  }, [groupMetrics]);

  const chartData = useMemo(() => [
    { name: "Batería Psicología", data: [
        { name: "Completo", value: globalStats.psychology.completo, color: COLORS_STATUS.completo },
        { name: "Proceso",  value: globalStats.psychology.proceso,  color: COLORS_STATUS.proceso  },
        { name: "Falta",    value: globalStats.psychology.falta,    color: COLORS_STATUS.falta    },
    ]},
    { name: "Entrevista por Competencias", data: [
        { name: "Realizado", value: globalStats.interview.realizado, color: COLORS_STATUS.realizado },
        { name: "Falta",     value: globalStats.interview.falta,     color: COLORS_STATUS.falta     },
    ]},
    { name: "Estado General", data: [
        { name: "Completo", value: globalStats.status.completo, color: COLORS_STATUS.completo },
        { name: "Proceso",  value: globalStats.status.proceso,  color: COLORS_STATUS.proceso  },
        { name: "Falta",    value: globalStats.status.falta,    color: COLORS_STATUS.falta    },
    ]},
  ], [globalStats]);

  /* ── Loading / Error ── */
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse">Cargando Seguimiento...</p>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <AlertCircle className="w-16 h-16 text-red-500" />
      <h2 className="text-xl font-black">Error de Sincronización</h2>
      <Button onClick={() => refetch()}>Reintentar conexión</Button>
    </div>
  );

  /* TABLE VIEW */
  if (view === "table") {
    return (
      <TableView
        rawRows={rawRows}
        loadingRaw={loadingRaw}
        onBack={() => setView("dashboard")}
      />
    );
  }

  /* DASHBOARD VIEW */
  return (
    <div className="space-y-6 md:space-y-8 pb-10 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase italic leading-none">
            Seguimiento de <span className="text-primary">Aplicación</span>
          </h1>
          <p className="text-muted-foreground text-xs md:text-base font-medium mt-1">Reporte consolidado de cumplimiento</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl text-xs h-9">
            <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} /> Sincronizar
          </Button>
          <Button
            size="sm"
            onClick={() => setView("table")}
            className="gap-2 rounded-xl text-xs h-9 shadow-md shadow-primary/20"
          >
            <TableIcon className="w-3.5 h-3.5" /> Ver Tabla Completa
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold px-2">LIVE</Badge>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: "Total",          value: globalStats.total,               icon: Users,          cls: "text-primary"      },
          { label: "Baterías OK",    value: globalStats.psychology.completo, icon: ClipboardCheck,  cls: "text-emerald-600"  },
          { label: "Entrevistas OK", value: globalStats.interview.realizado, icon: Activity,        cls: "text-blue-600"     },
          { label: "En Proceso",     value: globalStats.status.proceso,      icon: Loader2,         cls: "text-amber-600"    },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/40 bg-card/60 shadow-lg">
            <CardContent className="p-3 md:p-6 flex items-center justify-between">
              <div>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                <p className="text-xl md:text-4xl font-black text-foreground">{kpi.value}</p>
              </div>
              <kpi.icon className={cn("w-5 h-5 md:w-8 md:h-8 opacity-20", kpi.cls)} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3 Donuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {chartData.map((chart) => (
          <Card key={chart.name} className="border-border/40 bg-card/40 backdrop-blur-md shadow-xl p-4 md:p-6">
            <CardHeader className="p-0 pb-4 text-center">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{chart.name}</CardTitle>
            </CardHeader>
            <div className="h-[200px] md:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chart.data} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={5} dataKey="value">
                    {chart.data.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center flex-wrap gap-2 mt-2">
              {chart.data.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[8px] font-black uppercase">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}: <span className="text-foreground">{d.value}</span></span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Area Table */}
      <Card className="border-border/40 bg-card/40 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Desglose por Área
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setView("table")}
              className="text-[10px] font-black uppercase tracking-widest text-primary gap-1 h-7 px-2">
              Ver Todo <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="bg-muted/30">
                  {["Área", "Baterías OK", "Entrevis. OK", "Total", "Progreso"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupMetrics.map((g) => (
                  <tr key={g.id} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-xs text-foreground">{g.name}</td>
                    <td className="px-4 py-2.5 font-bold text-xs text-emerald-600">{g.psychologyStats.completo}</td>
                    <td className="px-4 py-2.5 font-bold text-xs text-blue-600">{g.interviewStats.realizado}</td>
                    <td className="px-4 py-2.5 font-bold text-xs text-muted-foreground">{g.total}</td>
                    <td className="px-4 py-2.5 w-40">
                      <div className="flex items-center gap-2">
                        <Progress value={g.avgScore} className="h-1.5 flex-1" />
                        <span className="text-[10px] font-black w-8">{g.avgScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default DiagnosticPage;
