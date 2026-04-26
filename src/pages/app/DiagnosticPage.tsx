import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSheetData, fetchRawRows, SheetRow } from "@/lib/sheets-adapter";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Loader2, RefreshCw, AlertCircle, ClipboardCheck, Users, Activity,
  BarChart3, TableIcon, Search, X, Eye, EyeOff, User,
  Calendar, Building2, Briefcase, GraduationCap, ArrowLeft, ChevronRight,
  Pencil, Trash2, Filter, Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
            {(row.AREA || row.ÁREA) || "Sin Área"} · N° {row.N}
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
    const areas = [...new Set(rawRows.map((r) => r.AREA || r.ÁREA || "Sin Área"))];
    return ["TODOS", ...areas];
  }, [rawRows]);

  const filteredRows = useMemo(() => rawRows.filter((row) => {
    const matchArea = areaFilter === "TODOS" || (row.AREA || row.ÁREA || "Sin Área") === areaFilter;
    const term = search.toLowerCase();
    return matchArea && (!term
      || (row["APELLIDOS Y NOMBRES"] || "").toLowerCase().includes(term)
      || (row.DNI || "").toLowerCase().includes(term)
      || (row.EMPRESA || "").toLowerCase().includes(term)
      || (row.PUESTO || "").toLowerCase().includes(term));
  }), [rawRows, search, areaFilter]);

  return (
    /* Escape the container padding to fill all available width/height */
    <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 -mb-4 md:-mb-8 flex flex-col animate-in fade-in slide-in-from-right-3 duration-400 bg-background/50"
      style={{ height: "calc(100vh - 5rem)" }}>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4 px-4 md:px-8 py-4 border-b border-border/40 bg-card/80 backdrop-blur-md shrink-0">
        
        {/* Nivel 1: Título y Navegación */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" onClick={onBack}
              className="gap-2 font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:text-primary p-0 h-auto shrink-0 group/back">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover/back:bg-primary/10 group-hover/back:text-primary transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Volver</span>
            </Button>
            <div className="h-5 w-px bg-border/50 shrink-0" />
            <div className="flex flex-col">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">
                Seguimiento de Aplicación
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <TableIcon className="w-3.5 h-3.5 text-primary" />
                <h1 className="text-sm font-black uppercase tracking-tight text-foreground truncate">
                  Visualización de Datos
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold py-0.5">
                  {filteredRows.length} {filteredRows.length === 1 ? 'Registro' : 'Registros'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
             <button
              onClick={handleRevealAll}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-all shadow-sm",
                allRevealed
                  ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                  : "bg-background text-foreground border-border/40 hover:bg-muted"
              )}
            >
              {allRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{allRevealed ? "Ocultar" : "Revelar Todo"}</span>
            </button>
          </div>
        </div>

        {/* Nivel 2: Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Filter Group */}
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 rounded-xl border border-border/20 flex-1 md:flex-none">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Área:</span>
              
              {uniqueAreas.length <= 5 ? (
                <div className="flex gap-1">
                  {uniqueAreas.map((area) => (
                    <button 
                      key={area} 
                      onClick={() => setAreaFilter(area)}
                      className={cn(
                        "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase transition-all whitespace-nowrap",
                        areaFilter === area
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              ) : (
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="h-6 border-none bg-transparent p-0 text-[10px] font-bold uppercase tracking-wide focus:ring-0 w-auto min-w-[120px]">
                    <SelectValue placeholder="Seleccionar área" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 shadow-2xl">
                    {uniqueAreas.map((area) => (
                      <SelectItem key={area} value={area} className="text-[10px] font-bold uppercase tracking-wide">
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Clear Filters (if any) */}
            {(areaFilter !== "TODOS" || search) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setAreaFilter("TODOS"); setSearch(""); }}
                className="h-8 px-2 text-[9px] font-bold uppercase text-muted-foreground hover:text-destructive gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Limpiar
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <Input
              placeholder="Buscar por nombre, DNI o cargo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs rounded-xl bg-background border-border/60 focus:border-primary/40 focus:ring-primary/20 transition-all shadow-inner"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
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
                    { label: "N°",     w: "w-16"  },
                    { label: "Apellidos y Nombres", w: "min-w-[280px]" },
                    { label: "DNI",    w: "w-32"       },
                    { label: "Empresa",w: "w-32"       },
                    { label: "Área",   w: "w-40"       },
                    { label: "Puesto", w: "min-w-[180px]" },
                    { label: "Grado",  w: "min-w-[140px]" },
                    { label: "Batería Psic.", w: "w-32" },
                    { label: "Entrevista",   w: "w-32" },
                    { label: "Estado",       w: "w-32" },
                    { label: "Fecha Eval.",  w: "w-32" },
                    { label: "Acciones",     w: "w-32 text-right" },
                  ].map(({ label, w }) => (
                    <th key={label}
                      className={cn("px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap bg-muted/60 backdrop-blur-xl border-b border-border/40", w)}>
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
                        "border-b border-border/5 transition-all duration-200 cursor-pointer group",
                        isSelected
                          ? "bg-primary/5 border-l-[4px] border-l-primary"
                          : idx % 2 === 0
                            ? "hover:bg-primary/5"
                            : "bg-muted/5 hover:bg-primary/5"
                      )}
                    >
                      <td className="px-6 py-3.5 text-xs font-bold text-muted-foreground/40 whitespace-nowrap">{row.N || idx + 1}</td>

                      {/* Name — blurred / revealed */}
                      <td className="px-6 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-sm font-bold transition-all duration-300 block max-w-[240px] truncate",
                            revealedRows.has(idx)
                              ? "text-foreground"
                              : "blur-[4px] text-muted-foreground/30 pointer-events-none select-none"
                          )}>
                            {row["APELLIDOS Y NOMBRES"] || "—"}
                          </span>
                          <button
                            onClick={(e) => toggleReveal(idx, e)}
                            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground/30 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                          >
                            {revealedRows.has(idx) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-xs font-medium text-muted-foreground/60 whitespace-nowrap">{row.DNI || "—"}</td>
                      <td className="px-6 py-3.5 text-xs font-medium text-muted-foreground/60 whitespace-nowrap">{row.EMPRESA || "—"}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10">{row.AREA || row.ÁREA || "—"}</span>
                      </td>
                      <td className="px-6 py-3.5 text-xs font-medium text-muted-foreground/60 whitespace-nowrap">{row.PUESTO || "—"}</td>
                      <td className="px-6 py-3.5 text-xs font-medium text-muted-foreground/60 whitespace-nowrap">{row["GRADO DE INSTRUCCIÓN"] || "—"}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">{statusBadge(row["BATERIAS PSICOLOGICAS"])}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">{statusBadge(row["ENTREVISTA POR COMPETENCIAS"])}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">{statusBadge(row.ESTADO)}</td>
                      <td className="px-6 py-3.5 text-xs font-medium text-muted-foreground/60 whitespace-nowrap">
                        {(row as any)["FECHA DE EVALUACION"] || "—"}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
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
              <p className="text-xs text-muted-foreground">{(deleteTarget.AREA || deleteTarget.ÁREA)} · {deleteTarget.PUESTO}</p>
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
    <div className="space-y-6 md:space-y-10 pb-16 animate-in fade-in duration-700 max-w-none mx-auto">

      {/* Header Centralizado */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1e293b] uppercase">
          AVANCE DE APLICACIÓN DE EVALUACIONES
        </h1>
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-full mb-2" />
          <p className="text-muted-foreground text-sm md:text-lg font-bold">
            Total de personal objetivo a evaluar: <span className="text-foreground">{globalStats.total} colaboradores (100%)</span>
          </p>
        </div>
      </div>

      {/* Top row: 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* EVALUACIONES APLICADAS */}
        <div className="bg-white border-2 border-green-500/20 rounded-[32px] p-6 flex items-center gap-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 translate-y-0 hover:-translate-y-1">
           <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shrink-0">
             <Users className="w-10 h-10" />
             <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000" />
           </div>
           <div className="flex-1 text-center">
             <p className="text-[14px] font-black leading-tight text-green-700 uppercase tracking-tight">EVALUACIONES<br/>APLICADAS</p>
             <p className="text-6xl font-black text-green-600 mt-1">{globalStats.status.completo}</p>
             <div className="mt-2 bg-green-500 text-white font-black text-xl px-6 py-1 rounded-full inline-block shadow-md">
               {Math.round((globalStats.status.completo / globalStats.total) * 100)}%
             </div>
           </div>
        </div>

        {/* EN PROCESO */}
        <div className="bg-white border-2 border-amber-500/20 rounded-[32px] p-6 flex items-center gap-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 translate-y-0 hover:-translate-y-1">
           <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shrink-0">
             <Loader2 className="w-10 h-10 animate-[spin_3s_linear_infinite]" />
           </div>
           <div className="flex-1 text-center">
             <p className="text-[14px] font-black leading-tight text-amber-700 uppercase tracking-tight">EN PROCESO<br/>DE APLICACIÓN<br/>Y ENTREVISTAS</p>
             <p className="text-6xl font-black text-amber-500 mt-1">{globalStats.status.proceso}</p>
             <div className="mt-2 bg-amber-500 text-white font-black text-xl px-6 py-1 rounded-full inline-block shadow-md">
               {Math.round((globalStats.status.proceso / globalStats.total) * 100)}%
             </div>
           </div>
        </div>

        {/* PENDIENTES */}
        <div className="bg-white border-2 border-red-500/20 rounded-[32px] p-6 flex items-center gap-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 translate-y-0 hover:-translate-y-1">
           <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shrink-0">
             <ClipboardCheck className="w-10 h-10" />
           </div>
           <div className="flex-1 text-center">
             <p className="text-[14px] font-black leading-tight text-red-700 uppercase tracking-tight">PENDIENTES<br/>DE APLICACIÓN</p>
             <p className="text-6xl font-black text-red-500 mt-1">{globalStats.status.falta}</p>
             <div className="mt-2 bg-red-500 text-white font-black text-xl px-6 py-1 rounded-full inline-block shadow-md">
               {Math.round((globalStats.status.falta / globalStats.total) * 100)}%
             </div>
           </div>
        </div>
      </div>

      {/* Middle Grid: Donut + Horizontal Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* DISTRIBUCIÓN POR ESTADO (Donut) */}
        <div className="bg-white rounded-[32px] p-8 border border-border/40 shadow-xl relative min-h-[450px]">
          <div className="bg-[#1e293b] text-white py-2 px-8 rounded-full text-center mb-10 w-fit mx-auto">
            <h3 className="text-sm font-black uppercase tracking-widest">DISTRIBUCIÓN POR ESTADO</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full">
            <div className="relative w-[300px] h-[300px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Aplicadas', value: globalStats.status.completo, color: COLORS_STATUS.completo },
                      { name: 'En Proceso', value: globalStats.status.proceso, color: COLORS_STATUS.proceso },
                      { name: 'Pendientes', value: globalStats.status.falta, color: COLORS_STATUS.falta },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius={80}
                    outerRadius={135}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {[
                      { color: COLORS_STATUS.completo },
                      { color: COLORS_STATUS.proceso },
                      { color: COLORS_STATUS.falta },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <p className="text-5xl font-black text-[#1e293b] leading-none">{globalStats.total}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1e293b]/60 mt-1">TOTAL</p>
                <p className="text-[10px] font-black text-[#1e293b]/60">(100%)</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {[
                { label: 'Evaluaciones aplicadas', value: globalStats.status.completo, color: '#22c55e', pct: Math.round((globalStats.status.completo / globalStats.total) * 100) },
                { label: 'En proceso de aplicación y entrevistas', value: globalStats.status.proceso, color: '#f59e0b', pct: Math.round((globalStats.status.proceso / globalStats.total) * 100) },
                { label: 'Pendientes de aplicación', value: globalStats.status.falta, color: '#ef4444', pct: Math.round((globalStats.status.falta / globalStats.total) * 100) },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full shrink-0 mt-1" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-bold text-muted-foreground leading-tight">{item.label}</p>
                    <p className="text-xl font-black transition-all hover:scale-110 origin-left" style={{ color: item.color }}>
                      {item.value} <span className="text-sm font-medium text-muted-foreground/60 ml-1">({item.pct}%)</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CANTIDAD DE PERSONAS POR ESTADO (Bar) */}
        <div className="bg-white rounded-[32px] p-8 border border-border/40 shadow-xl min-h-[450px] flex flex-col">
          <div className="bg-[#1e293b] text-white py-2 px-8 rounded-full text-center mb-10 w-fit mx-auto">
            <h3 className="text-sm font-black uppercase tracking-widest">CANTIDAD DE PERSONAS POR ESTADO</h3>
          </div>

          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { name: 'EVALUACIONES APLICADAS', value: globalStats.status.completo, color: COLORS_STATUS.completo },
                  { name: 'EN PROCESO DE APLICACIÓN Y ENTREVISTAS', value: globalStats.status.proceso, color: COLORS_STATUS.proceso },
                  { name: 'PENDIENTES DE APLICACIÓN', value: globalStats.status.falta, color: COLORS_STATUS.falta },
                ]}
                margin={{ top: 20, right: 60, left: 10, bottom: 20 }}
              >
                <XAxis type="number" hide domain={[0, globalStats.total * 1.1]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#1e293b', width: 200 }} 
                  width={180}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                  {[
                    { color: COLORS_STATUS.completo },
                    { color: COLORS_STATUS.proceso },
                    { color: COLORS_STATUS.falta },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    style={{ fill: '#1e293b', fontWeight: 900, fontSize: '24px' }}
                    offset={20}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between px-10 text-[10px] font-black text-muted-foreground/40 mt-4 italic uppercase tracking-widest border-t border-border/10 pt-4">
            {[0, 20, 40, 60, 80, 100, 120, 140, 160].map(v => <span key={v}>{v}</span>)}
          </div>
          <p className="text-center text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mt-2">Cantidad de personas</p>
        </div>
      </div>

      {/* Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* KPI PRINCIPAL */}
        <div className="bg-white border-2 border-[#1e293b]/10 rounded-[32px] overflow-hidden flex items-stretch shadow-xl group hover:shadow-2xl transition-all duration-500">
          <div className="bg-[#1e293b] p-8 flex items-center justify-center shrink-0 group-hover:bg-[#334155] transition-colors duration-500">
            <Target className="w-14 h-14 text-white animate-pulse" />
          </div>
          <div className="p-8 flex items-center gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1e293b]/60 mb-1">KPI PRINCIPAL</p>
              <h4 className="text-6xl font-black text-green-600 tracking-tighter shadow-green-500/20 drop-shadow-sm">
                {Math.round((globalStats.status.completo / globalStats.total) * 100)}%
              </h4>
            </div>
            <div className="h-12 w-px bg-border/40" />
            <p className="text-sm font-black uppercase tracking-widest text-[#1e293b] leading-tight">
              AVANCE TOTAL<br/>DE EVALUACIONES
            </p>
          </div>
        </div>

        {/* OBJETIVO */}
        <div className="bg-green-50/50 border-2 border-green-500/10 rounded-[32px] overflow-hidden flex items-stretch shadow-xl group hover:shadow-2xl transition-all duration-500">
          <div className="bg-green-500 p-8 flex items-center justify-center shrink-0 group-hover:bg-green-600 transition-colors duration-500">
            <Calendar className="w-12 h-12 text-white" />
          </div>
          <div className="p-8 flex-1 flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700 mb-2">OBJETIVO</p>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                Asegurar la cobertura total del personal objetivo, completando el 100% de las evaluaciones de acuerdo con la planificación y la dinámica operativa de turnos.
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/50 border border-green-500/10 flex items-center justify-center shrink-0">
               <Users className="w-8 h-8 text-[#1e293b]" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button to see table */}
      <div className="fixed bottom-10 right-10 flex gap-4 print:hidden">
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          className="rounded-full w-14 h-14 shadow-2xl bg-white border-border/40 hover:bg-muted"
        >
          <RefreshCw className={cn("w-6 h-6", isFetching && "animate-spin")} />
        </Button>
        <Button 
          onClick={() => setView("table")} 
          className="rounded-full px-8 h-14 shadow-2xl gap-3 text-sm font-black uppercase tracking-widest"
        >
          <TableIcon className="w-5 h-5" /> Ver registros detellados
        </Button>
      </div>

    </div>
  );
};

export default DiagnosticPage;
