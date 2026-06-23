import { useState } from "react";
import {
  ActivityIcon,
  AlertCircle,
  ArrowRight,
  Brain,
  Building2,
  ChevronDown,
  FileDown,
  Files,
  FileSpreadsheet,
  Filter,
  Globe,
  LayoutDashboard,
  List,
  RefreshCw,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { KpiCard } from "@/components/dashboard/DashboardCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  DRIVER_SAFETY_TABLE_COLUMN_WIDTHS,
  RISK_COLORS,
} from "./constants";
import { DriverSafetyIndividualPanel } from "./components/DriverSafetyIndividualPanel";
import { MultiSelectFilter } from "./components/MultiSelectFilter";
import { useDriverSafetyDashboard } from "./hooks/useDriverSafetyDashboard";
import {
  DRIVER_SAFETY_EXCEL_COLUMNS,
  type DriverSafetyExcelColumnKey,
  downloadExcelDashboard,
  exportBulkExcel,
  printDashboard,
  printFilteredReport,
} from "./services/driverSafetyReports";

const DriverSafetyPage = () => {
  const {
    view,
    setView,
    search,
    setSearch,
    conditionFilters,
    setConditionFilters,
    companyFilters,
    setCompanyFilters,
    areaFilters,
    setAreaFilters,
    levelFilters,
    setLevelFilters,
    positionFilters,
    setPositionFilters,
    statusFilters,
    setStatusFilters,
    selectedEntry,
    setSelectedEntry,
    sortBy,
    setSortBy,
    tableOffsetX,
    setTableOffsetX,
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    filterOptions,
    filteredEntries,
    filteredResultCounts,
    stats,
  } = useDriverSafetyDashboard();
  const [excelColumnKeys, setExcelColumnKeys] = useState<
    DriverSafetyExcelColumnKey[]
  >(DRIVER_SAFETY_EXCEL_COLUMNS.map((column) => column.key));

  const handleDownloadExcelDashboard = () =>
    downloadExcelDashboard(filteredEntries);

  const handlePrintFilteredReport = (mode: "consolidated" | "byCompany") =>
    printFilteredReport({
      filteredEntries,
      companyFilters,
      areaFilters,
      levelFilters,
      positionFilters,
      statusFilters,
      conditionFilters,
      mode,
    });

  const handlePrintDashboard = () => printDashboard();

  const handleExportBulkExcel = () =>
    exportBulkExcel(filteredEntries, excelColumnKeys);

  const toggleExcelColumn = (columnKey: DriverSafetyExcelColumnKey) => {
    setExcelColumnKeys((currentKeys) => {
      if (currentKeys.includes(columnKey)) {
        return currentKeys.length === 1
          ? currentKeys
          : currentKeys.filter((key) => key !== columnKey);
      }

      return [...currentKeys, columnKey];
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse uppercase tracking-widest text-xs">
          Sincronizando Datos Psicometricos...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-xl border border-red-500/20">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Error de Conexión</h2>
          <p className="text-muted-foreground max-w-sm">
            No pudimos obtener los datos de Driver Safety desde el repositorio.
          </p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />{" "}
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col selection:bg-primary/20 overflow-x-hidden">
      <div
        className={cn(
          "flex-1 space-y-12 pb-24 px-4 md:px-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
          selectedEntry ? "pr-0 lg:pr-[450px] xl:pr-[500px]" : "",
        )}
      >
        {/* Header Section */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-6 pt-4 -mx-4 px-4 md:mx-0 md:px-0 transition-all duration-300 shadow-sm">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                <Globe className="w-5 h-5" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground italic flex items-center gap-3">
                Driver <span className="text-primary not-italic">Safety</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-2xl px-1">
              Análisis de la percepción de control sobre eventos críticos y
              seguridad operativa.
            </p>
          </div>

          <div className="flex items-center bg-muted/30 p-1 rounded-2xl border border-border/50 backdrop-blur-md">
            <Button
              variant={view === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("dashboard")}
              className={cn(
                "rounded-xl gap-2 px-4 font-bold text-xs uppercase tracking-wider",
                view === "dashboard" && "shadow-lg shadow-primary/20",
              )}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className={cn(
                "rounded-xl gap-2 px-4 font-bold text-xs uppercase tracking-wider",
                view === "list" && "shadow-lg shadow-primary/20",
              )}
            >
              <List className="w-4 h-4" /> Listado
            </Button>
            <div className="w-px h-6 bg-border/50 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePrintDashboard()}
              className="rounded-xl text-primary hover:bg-primary/10"
            >
              <FileDown className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownloadExcelDashboard()}
              className="rounded-xl text-emerald-600 hover:bg-emerald-500/10"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              className="rounded-xl"
            >
              <RefreshCw
                className={cn("w-4 h-4", isFetching && "animate-spin")}
              />
            </Button>
          </div>
        </div>

        {/* Intro Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-2xl rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <ActivityIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter italic">
                    Locus control
                  </h2>
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl font-medium">
                  Define cómo una persona interpreta las causas de los eventos
                  que le suceden. En el{" "}
                  <span className="font-bold text-white uppercase italic">
                    contexto minero
                  </span>
                  , identificamos si los trabajadores asumen la responsabilidad
                  de lo que ocurre en su trabajo o si tienden a atribuirlo a
                  factores externos (suerte, entorno o terceros), influyendo
                  directamente en la{" "}
                  <span className="font-bold text-white uppercase italic">
                    seguridad operativa
                  </span>
                  .
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-indigo-300">
                    Control Interno
                  </p>
                  <p className="text-xs font-medium">
                    Sus acciones influyen en los resultados. Asociado a
                    proactividad y cumplimiento seguro.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-indigo-300">
                    Control Externo
                  </p>
                  <p className="text-xs font-medium">
                    Depende de factores fuera de su control. Relacionado con
                    mayor riesgo y conductas inseguras.
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">
                  Objetivo
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  "Identificar el nivel de responsabilidad de los operadores
                  para clasificar riesgos, asignar tareas críticas y diseñar
                  programas de capacitación focalizados que reduzcan
                  ostensiblemente la tasa de accidentabilidad."
                </p>
              </div>
              <div className="space-y-2 mt-6">
                {[
                  "Clasificar por Riesgo",
                  "Decisiones de Asignación",
                  "Programas de Capacitación",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Universal Filters */}
        <Card className="border-2 shadow-xl rounded-[2rem] p-6 bg-white/80 backdrop-blur-md border-primary/5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-6">
            {/* Buscador */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                Buscador
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Nombre, DNI, empresa, area..."
                  className="pl-12 h-12 bg-white/50 border-border/40 rounded-xl focus:ring-2 focus:ring-primary/20 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Empresa */}
            <MultiSelectFilter
              label="Empresa"
              options={filterOptions.companies}
              selected={companyFilters}
              onChange={setCompanyFilters}
              placeholder="Todas las Empresas"
            />

            <MultiSelectFilter
              label="Area"
              options={filterOptions.areas}
              selected={areaFilters}
              onChange={setAreaFilters}
              placeholder="Todas las Areas"
            />

            {/* Nivel */}
            <MultiSelectFilter
              label="Trabajo Nivel"
              options={filterOptions.levels}
              selected={levelFilters}
              onChange={setLevelFilters}
              placeholder="Todos los Niveles"
            />

            <MultiSelectFilter
              label="Puesto"
              options={filterOptions.positions}
              selected={positionFilters}
              onChange={setPositionFilters}
              placeholder="Todos los Puestos"
            />

            {/* Condición */}
            <MultiSelectFilter
              label="Condición"
              options={filterOptions.conditions}
              selected={conditionFilters}
              onChange={setConditionFilters}
              placeholder="Todas las Condic."
            />

            {/* Estado */}
            <MultiSelectFilter
              label="Estado"
              options={filterOptions.statuses}
              selected={statusFilters}
              onChange={setStatusFilters}
              placeholder="Todos los Estados"
            />
          </div>

          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mt-6 pt-6 border-t border-border/10 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setCompanyFilters([]);
                  setAreaFilters([]);
                  setLevelFilters([]);
                  setPositionFilters([]);
                  setConditionFilters([]);
                  setStatusFilters([]);
                }}
                className="rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest h-10 border-border/40 hover:bg-muted"
              >
                <RefreshCw className="w-3 h-3" /> Limpiar Filtros
              </Button>
              <div className="h-3 w-px bg-border/40" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {filteredEntries.length} Casos Filtrados
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 shadow-none hover:bg-emerald-50">
                  Bajo {filteredResultCounts.low}
                </Badge>
                <Badge className="rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-amber-700 shadow-none hover:bg-amber-50">
                  Medio {filteredResultCounts.medium}
                </Badge>
                <Badge className="rounded-full border-rose-200 bg-rose-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-rose-700 shadow-none hover:bg-rose-50">
                  Alto {filteredResultCounts.high}
                </Badge>
                <Badge className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-600 shadow-none hover:bg-slate-50">
                  Revisar {filteredResultCounts.review}
                </Badge>
              </div>
            </div>

            {view === "list" && (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      disabled={filteredEntries.length === 0}
                      className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 gap-2 group transition-all active:scale-95 border-0"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span className="text-[10px] font-black tracking-tighter uppercase italic">
                        Excel Grupal
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 rounded-2xl p-2 shadow-2xl"
                  >
                    <DropdownMenuLabel className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Columnas a exportar
                    </DropdownMenuLabel>
                    <div className="max-h-72 overflow-y-auto pr-1">
                      {DRIVER_SAFETY_EXCEL_COLUMNS.map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.key}
                          checked={excelColumnKeys.includes(column.key)}
                          onCheckedChange={() => toggleExcelColumn(column.key)}
                          onSelect={(event) => event.preventDefault()}
                          className="cursor-pointer rounded-xl py-2 text-xs font-bold"
                        >
                          {column.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="grid grid-cols-2 gap-2 p-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExcelColumnKeys(
                            DRIVER_SAFETY_EXCEL_COLUMNS.map(
                              (column) => column.key,
                            ),
                          )
                        }
                        className="h-9 rounded-xl text-[10px] font-black uppercase"
                      >
                        Todas
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleExportBulkExcel}
                        className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase"
                      >
                        Exportar
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={filteredEntries.length === 0}
                      className="h-9 px-4 rounded-xl border-primary/20 hover:bg-primary/5 text-primary shadow-lg shadow-primary/5 gap-2 group transition-all active:scale-95"
                    >
                      <FileDown className="w-4 h-4" />
                      <span className="text-[10px] font-black tracking-tighter uppercase italic">
                        Informe PDF
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-2xl p-2 shadow-2xl"
                  >
                    <DropdownMenuItem
                      onClick={() => handlePrintFilteredReport("consolidated")}
                      className="cursor-pointer gap-3 rounded-xl p-3"
                    >
                      <Files className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-black uppercase">
                          Documento consolidado
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Todas las empresas en un solo PDF
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePrintFilteredReport("byCompany")}
                      className="cursor-pointer gap-3 rounded-xl p-3"
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-black uppercase">
                          Un PDF por empresa
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Genera un archivo independiente por empresa
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </Card>

        {view === "dashboard" ? (
          <div className="space-y-10">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard
                label="Total Evaluados"
                value={stats.totalEvaluated}
                icon={Users}
                color="text-blue-500"
                bg="bg-blue-500/10"
                border="border-blue-500/20"
                info="Cantidad total de personas que han completado la evaluación de Driver Safety hasta la fecha."
              />
              <KpiCard
                label="Promedio Interno"
                value={stats.avgInternal.toFixed(1)}
                icon={Brain}
                color="text-indigo-500"
                bg="bg-indigo-500/10"
                border="border-indigo-500/20"
                info="Puntaje promedio de Locus de Control Interno. Un mayor puntaje indica que el personal asume responsabilidad directa sobre sus acciones y seguridad."
              />
              <KpiCard
                label="Promedio Externo"
                value={stats.avgExternal.toFixed(1)}
                icon={Zap}
                color="text-emerald-500"
                bg="bg-emerald-500/10"
                border="border-emerald-500/20"
                info="Puntaje promedio de Locus de Control Externo. Indica la tendencia a atribuir la seguridad a factores externos como la suerte o el entorno."
              />
              <KpiCard
                label="Índice de Riesgo Bajo"
                value={`${(((stats.riskDistribution.find((d) => d.name === "RIESGO BAJO")?.value || 0) / (stats.totalEvaluated || 1)) * 100).toFixed(0)}%`}
                icon={ShieldCheck}
                color="text-amber-500"
                bg="bg-amber-500/10"
                border="border-amber-500/20"
                info="Porcentaje de la población evaluada que ha calificado como 'RIESGO BAJO', mostrando un nivel óptimo de responsabilidad personal y seguridad."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chart: Risk Distribution */}
              <Card
                id="dashboard-pie-chart"
                className="lg:col-span-4 border-2 shadow-2xl rounded-[2.5rem] overflow-hidden group"
              >
                <CardHeader className="bg-muted/5 border-b border-border/20 p-8">
                  <CardTitle className="text-xl font-black italic tracking-tighter">
                    Distribución de Perfiles
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                    Segmentación por puntaje interno
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {stats.riskDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              RISK_COLORS[
                                entry.name as keyof typeof RISK_COLORS
                              ]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-2xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                  {payload[0].name}
                                </p>
                                <p className="text-xl font-black">
                                  {payload[0].value}{" "}
                                  <span className="text-xs font-medium text-muted-foreground italic">
                                    casos
                                  </span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        content={({ payload }) => (
                          <div className="flex justify-center gap-6 mt-4">
                            {payload?.map((entry, index: number) => {
                              const count =
                                stats.riskDistribution.find(
                                  (d) => d.name === entry.value,
                                )?.value || 0;
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-[10px] font-black uppercase tracking-tighter">
                                    {entry.value}:{" "}
                                    <span className="text-primary italic">
                                      {count}
                                    </span>
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Chart: Level Line Comparison */}
              <Card
                id="dashboard-comparison-chart"
                className="lg:col-span-8 border-2 shadow-2xl rounded-[2.5rem] overflow-hidden group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
                <CardHeader className="bg-muted/5 border-b border-border/20 p-8">
                  <CardTitle className="text-xl font-black italic tracking-tighter">
                    Comparativa Driver Safety Interno vs Externo
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                    Balance promedio del grupo evaluado
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 lg:p-12 space-y-16">
                  <div className="space-y-10 relative">
                    <div className="flex justify-between items-end mb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-indigo-500 uppercase tracking-tighter">
                          Control Interno
                        </p>
                        <p className="text-4xl font-black tabular-nums italic text-indigo-600">
                          {((stats.avgInternal / 23) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-black text-emerald-500 uppercase tracking-tighter">
                          Control Externo
                        </p>
                        <p className="text-4xl font-black tabular-nums italic text-emerald-600">
                          {((stats.avgExternal / 23) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="relative h-6 w-full bg-muted/20 rounded-full border border-border/50 overflow-hidden shadow-inner">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000"
                        style={{ width: `${(stats.avgInternal / 23) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-1 h-10 bg-white shadow-xl z-10 border border-border/20 rounded-full"
                          style={{
                            left: `${(stats.avgInternal / 23) * 100}%`,
                            position: "absolute",
                            transform: "translateX(-50%)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 bg-indigo-50/10 rounded-3xl border border-indigo-200/20">
                        <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />{" "}
                          Significado
                        </h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                          Proporción de individuos que atribuyen sus éxitos a su
                          esfuerzo propio.
                        </p>
                      </div>
                      <div className="p-6 bg-emerald-50/10 rounded-3xl border border-emerald-200/20">
                        <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />{" "}
                          Significado
                        </h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                          Proporción de individuos que perciben que agentes
                          externos determinan su seguridad.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] p-8 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter">
                    Regla de Negocio
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Riesgo Bajo
                      </span>
                      <span className="text-xs font-black text-emerald-500 tracking-tighter italic">
                        19 - 23 pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Riesgo Medio
                      </span>
                      <span className="text-xs font-black text-amber-500 tracking-tighter italic">
                        13 - 18 pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Riesgo Alto
                      </span>
                      <span className="text-xs font-black text-red-500 tracking-tighter italic">
                        0 - 12 pts
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="md:col-span-2 border-2 border-dashed rounded-[2.5rem] p-8 bg-muted/5 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground italic uppercase">
                    Análisis Ejecutivo del Grupo
                  </h4>
                  <p className="text-muted-foreground text-sm max-w-lg mt-1 italic">
                    "La gran mayoría de trabajadores no presenta un nivel óptimo
                    de responsabilidad personal. El grupo de riesgo alto
                    representa el mayor peligro, requiriendo intervención
                    inmediata."
                  </p>
                  <div className="mt-4 p-4 bg-muted/40 rounded-2xl text-[10px] font-black uppercase text-indigo-600 tracking-widest animate-pulse">
                    Se utilizó la Escala I-E de Rotter (23 ítems)
                  </div>
                </div>
              </Card>
            </div>

          </div>
        ) : (
          /* List View */
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/10 p-4 rounded-[2rem] border border-border/20 backdrop-blur-sm">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground/80 px-1">
                  Criterio de Ordenamiento
                </h3>
                <p className="text-[10px] font-semibold text-muted-foreground px-1">
                  Selecciona cómo organizar la tabla de evaluados en el listado.
                </p>
              </div>
              <div className="flex items-center bg-muted/30 p-1 rounded-2xl border border-border/50 backdrop-blur-md">
                <Button
                  variant={sortBy === "id" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("id")}
                  className={cn(
                    "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest h-8 transition-all duration-300",
                    sortBy === "id" && "shadow-lg shadow-primary/20",
                  )}
                >
                  Nº de Orden
                </Button>
                <Button
                  variant={sortBy === "risk" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("risk")}
                  className={cn(
                    "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest h-8 transition-all duration-300",
                    sortBy === "risk" && "shadow-lg shadow-primary/20",
                  )}
                >
                  Nivel de Riesgo
                </Button>
                <Button
                  variant={sortBy === "name" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("name")}
                  className={cn(
                    "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest h-8 transition-all duration-300",
                    sortBy === "name" && "shadow-lg shadow-primary/20",
                  )}
                >
                  Nombre (A-Z)
                </Button>
              </div>
            </div>

            <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-visible">
              <div className="sticky top-0 z-30 overflow-hidden rounded-t-[2.5rem] border-b border-border/30 bg-slate-100/95 shadow-lg backdrop-blur-md">
                <div
                  className="w-[2010px]"
                  style={{ marginLeft: `-${tableOffsetX}px` }}
                >
                  <Table className="w-full table-fixed">
                    <colgroup>
                      {DRIVER_SAFETY_TABLE_COLUMN_WIDTHS.map((width, index) => (
                        <col key={index} style={{ width }} />
                      ))}
                    </colgroup>
                    <TableHeader className="bg-slate-100/95">
                      <TableRow className="hover:bg-transparent border-b-2">
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 px-8 bg-slate-100/95 shadow-sm">
                          ID
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Evaluado
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          DNI
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Empresa
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Área
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Trabajo Nivel
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Puesto
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Linea
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Fecha
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Estado
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Interno
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Externo
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Total
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Validación
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Condición
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>
              </div>
              <div className="h-[48vh] min-h-[320px] max-h-[560px] overflow-y-scroll overflow-x-hidden custom-scrollbar relative">
                <div
                  className="w-[2010px]"
                  style={{ marginLeft: `-${tableOffsetX}px` }}
                >
                  <Table className="w-full table-fixed">
                  <colgroup>
                    {DRIVER_SAFETY_TABLE_COLUMN_WIDTHS.map((width, index) => (
                      <col key={index} style={{ width }} />
                    ))}
                  </colgroup>
                  <TableHeader className="hidden">
                    <TableRow className="hover:bg-transparent border-b-2">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 px-8 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        ID
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Evaluado
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        DNI
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Empresa
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Área
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Trabajo Nivel
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Puesto
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">
                        Linea
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm text-center">
                        Fecha
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm text-center">
                        Estado
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm text-center">
                        Interno
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm text-center">
                        Externo
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm text-center">
                        Total
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm text-center">
                        Validación
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm text-center">
                        Condición
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className={cn(
                          "group hover:bg-muted/30 transition-colors border-b-border/10 cursor-pointer",
                          selectedEntry?.id === entry.id ? "bg-primary/5" : "",
                        )}
                      >
                        <TableCell className="font-mono text-[10px] font-bold text-muted-foreground/40 px-8 py-5">
                          #{entry.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-black italic uppercase text-xs tracking-tight group-hover:translate-x-1 transition-transform">
                              {entry.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-[11px] font-black tabular-nums text-slate-500 uppercase">
                            {entry.dni}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase">
                            {entry.company}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase">
                            {entry.area}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-[9px] font-black bg-primary/5 text-primary border-primary/10 uppercase italic"
                          >
                            {entry.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-[10px] font-black uppercase tracking-tight">
                            {entry.position}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[10px] font-black uppercase tracking-tight">
                            {entry.line}
                          </p>
                        </TableCell>
                        <TableCell className="text-[10px] font-black uppercase text-muted-foreground italic text-center whitespace-nowrap">
                          {entry.date}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="text-[9px] border-primary/20 bg-primary/5 text-primary whitespace-nowrap"
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-black tabular-nums text-indigo-600">
                          {entry.internalScore}
                        </TableCell>
                        <TableCell className="text-center font-black tabular-nums text-emerald-600">
                          {entry.externalScore}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] font-bold",
                              entry.totalScore === 23
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse",
                            )}
                          >
                            {entry.totalScore}/23
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              "text-[9px] font-bold",
                              entry.validation === "OK"
                                ? "text-emerald-600"
                                : "text-red-600 font-black underline underline-offset-2",
                            )}
                          >
                            {entry.validation}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] font-black italic border-0 shadow-lg shadow-black/5",
                              entry.result === "RIESGO BAJO"
                                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                : entry.result === "RIESGO MEDIO"
                                  ? "bg-amber-500 text-white shadow-amber-500/20"
                                  : entry.result === "ERROR"
                                    ? "bg-slate-500 text-white shadow-slate-500/20"
                                    : "bg-red-500 text-white shadow-red-500/20",
                            )}
                          >
                            {entry.result}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
              </div>
              <div className="border-t border-border/30 bg-white/95 px-4 py-3">
                <div
                  className="driver-safety-scrollbar overflow-x-scroll overflow-y-hidden rounded-full bg-slate-100/80 border border-slate-200/80 shadow-inner"
                  aria-label="Desplazamiento horizontal de la tabla Driver Safety"
                  onScroll={(event) => setTableOffsetX(event.currentTarget.scrollLeft)}
                >
                  <div className="h-3 w-[2010px]" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Sliding Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen z-50 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
          selectedEntry
            ? "w-full md:w-[450px] lg:w-[500px] xl:w-[550px] translate-x-0"
            : "w-0 translate-x-full pointer-events-none",
        )}
      >
        {selectedEntry && (
          <DriverSafetyIndividualPanel
            entry={selectedEntry}
            distribution={data.riskDistribution}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </div>

      {/* Backdrop */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-in fade-in duration-700"
          onClick={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
};

export default DriverSafetyPage;
