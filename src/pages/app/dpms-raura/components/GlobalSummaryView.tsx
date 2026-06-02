import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "@/components/dashboard/ChartElements";
import { cn } from "@/lib/utils";
import {
  FINAL_RAURA_BARS,
  FINAL_RAURA_FOLLOW_UP,
  FINAL_RAURA_INTERVENTIONS,
  FINAL_RAURA_KPIS,
  FINAL_RAURA_LOW_ITEMS,
  FINAL_RAURA_REPORT,
  FINAL_RAURA_TRISAFE,
} from "../dpmsRaura.constants";

export const GlobalSummaryView = () => {
  const environmentGauge = [
    {
      name: FINAL_RAURA_REPORT.validatedLevel,
      value: FINAL_RAURA_REPORT.verdictScore,
      fill: "#dc2626",
    },
  ];

  const perceptionGap = Number(
    (FINAL_RAURA_REPORT.perception - FINAL_RAURA_REPORT.unsafeAct).toFixed(2),
  );

  const criticalBehaviorBars = [
    { name: "Acto inseguro", value: FINAL_RAURA_REPORT.unsafeAct, note: "Menos de la mitad interviene", color: "#dc2626" },
    { name: "Gestion riesgo", value: FINAL_RAURA_REPORT.riskManagement, note: "Falla casi en la mitad", color: "#ea580c" },
    { name: "Liderazgo efectivo", value: FINAL_RAURA_REPORT.effectiveLeadership, note: "Discurso no baja a campo", color: "#f59e0b" },
    { name: "Cap. Planta", value: FINAL_RAURA_REPORT.trainingPlanta, note: "Participacion critica", color: "#dc2626" },
    { name: "Cap. Mina", value: FINAL_RAURA_REPORT.trainingMina, note: "Brecha de formacion", color: "#ea580c" },
    { name: "Comunicacion", value: 70.5, note: "Silencio operativo", color: "#f59e0b" },
    { name: "Reconocimiento", value: 71.71, note: "Refuerzo bajo", color: "#f59e0b" },
  ];

  const bradleyPosition = [
    { stage: "Reactivo", value: 48.33, color: "#dc2626", label: "Raura hoy" },
    { stage: "Dependiente", value: 0, color: "#f59e0b", label: "Meta inmediata" },
    { stage: "Independiente", value: 0, color: "#2563eb", label: "No validado" },
    { stage: "Interdependiente", value: 0, color: "#16a34a", label: "No validado" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.8fr)] gap-8">
        <Card className="rounded-[2rem] border-2 border-slate-200 bg-white/90 shadow-2xl overflow-hidden">
          <CardContent className="p-7 lg:p-9 space-y-7">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-md border-0 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-600 shadow-none">
                    Informe ejecutivo gerencial
                  </Badge>
                  <Badge className="rounded-md border-0 bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-none">
                    {FINAL_RAURA_REPORT.transition}
                  </Badge>
                </div>
                <h2 className="mt-5 text-4xl lg:text-6xl font-black italic leading-none text-slate-900">
                  Cultura de seguridad{" "}
                  <span className="text-red-600 not-italic">Reactiva</span>
                </h2>
                <p className="mt-4 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600">
                  La lectura final se sostiene por conducta real ante riesgo. La percepcion
                  favorable no valida madurez cuando la intervencion ante acto inseguro cae
                  por debajo del umbral critico.
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 px-6 py-5 text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                  Brecha percepcion/conducta
                </p>
                <p className="mt-1 text-4xl font-black italic text-red-600 tabular-nums">
                  {perceptionGap}
                </p>
                <p className="text-[10px] font-bold uppercase text-red-400">puntos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {FINAL_RAURA_KPIS.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <span className="text-3xl font-black italic tabular-nums" style={{ color: item.color }}>
                      {item.value}
                    </span>
                    <span className="max-w-[150px] text-right text-[10px] font-bold leading-snug text-slate-400">
                      {item.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6">
              <div className="relative h-[260px] rounded-2xl border border-red-100 bg-red-50/70 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="70%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={30}
                    data={environmentGauge}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar background={{ fill: "#fecaca" }} dataKey="value" cornerRadius={24} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-x-0 bottom-8 text-center">
                  <p className="text-6xl font-black italic leading-none text-red-600 tabular-nums">
                    {FINAL_RAURA_REPORT.verdictScore}%
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.35em] text-red-500">
                    Veredicto Reactivo
                  </p>
                </div>
              </div>

              <div className="h-[260px] rounded-2xl border border-slate-100 bg-white p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FINAL_RAURA_BARS} margin={{ left: 0, right: 18, top: 12, bottom: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="8 8" stroke="rgba(15,23,42,0.08)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b", fontWeight: 800 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={34}>
                      <LabelList dataKey="value" position="top" formatter={(value: number) => `${Math.round(value)}%`} />
                      {FINAL_RAURA_BARS.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-2 border-red-100 bg-white/90 shadow-2xl overflow-hidden">
          <CardHeader className="p-7 pb-0 text-center">
            <Badge variant="outline" className="mx-auto rounded-md border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest">
              Curva de Bradley
            </Badge>
            <CardTitle className="mt-4 text-2xl font-black uppercase italic text-slate-900">
              Raura hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-7 space-y-4">
            {[
              { name: "Reactivo", color: "#dc2626", active: true },
              { name: "Dependiente", color: "#f59e0b", active: false },
              { name: "Independiente", color: "#2563eb", active: false },
              { name: "Interdependiente", color: "#16a34a", active: false },
            ].map((level) => (
              <div key={level.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: level.color }} />
                    <p className="text-sm font-black uppercase text-slate-700">{level.name}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: level.color }}>
                    {level.active ? "Ubicacion actual" : "Meta evolutiva"}
                  </span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full"
                    style={{ width: level.active ? "100%" : "18%", backgroundColor: level.color, opacity: level.active ? 1 : 0.32 }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-8">
        <Card className="rounded-[2rem] border-2 border-red-100 bg-white/95 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400" />
          <CardHeader className="p-7 pb-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge className="rounded-md border-0 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-700 shadow-none">
                  Diagnostico final TXT
                </Badge>
                <CardTitle className="mt-4 text-2xl lg:text-3xl font-black uppercase italic text-slate-900">
                  Brechas conductuales criticas
                </CardTitle>
                <CardDescription className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-red-500/70">
                  Lo que ocurre ante el riesgo real
                </CardDescription>
              </div>
              <div className="rounded-2xl bg-red-600 px-5 py-4 text-right text-white shadow-xl shadow-red-500/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-100">Madurez real</p>
                <p className="text-3xl font-black italic tabular-nums">{FINAL_RAURA_REPORT.reactive}%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.74fr)] gap-6 p-7 pt-2">
            <div className="h-[380px] rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/80 via-white to-amber-50/60 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={criticalBehaviorBars} layout="vertical" margin={{ left: 22, right: 58, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="8 8" horizontal={false} stroke="rgba(220,38,38,0.12)" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 800 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: "#475569" }}
                    tickFormatter={(value) => String(value).slice(0, 16).toUpperCase()}
                    width={118}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(220,38,38,0.06)" }} />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={24}>
                    <LabelList dataKey="value" position="right" formatter={(value: number) => `${Math.round(value)}%`} />
                    {criticalBehaviorBars.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-700">Lectura ejecutiva</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-700">
                  El 79.40% refleja percepcion positiva, pero la conducta observada no sostiene una cultura madura.
                  El resultado final ubica a Raura en etapa reactiva.
                </p>
              </div>
              {criticalBehaviorBars.slice(0, 5).map((item) => (
                <div key={item.name} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-800">{item.name}</p>
                      <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{item.note}</p>
                    </div>
                    <span className="shrink-0 text-2xl font-black italic tabular-nums" style={{ color: item.color }}>
                      {Math.round(item.value)}%
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-2 border-slate-200 bg-white/95 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-slate-300" />
          <CardHeader className="p-7 pb-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 shadow-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 text-2xl lg:text-3xl font-black uppercase italic text-slate-900">
                  Posicionamiento Bradley
                </CardTitle>
                <CardDescription className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-red-500/70">
                  Reactivo como resultado final
                </CardDescription>
              </div>
              <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-700">Conclusion</p>
                <p className="text-lg font-black italic text-red-700">Reactivo</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-7 pt-2 space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Percepcion favorable</p>
                  <p className="mt-1 text-4xl font-black italic text-slate-900 tabular-nums">{FINAL_RAURA_REPORT.perception}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Conducta reactiva</p>
                  <p className="mt-1 text-4xl font-black italic text-red-600 tabular-nums">{FINAL_RAURA_REPORT.reactive}%</p>
                </div>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-red-600" style={{ width: `${FINAL_RAURA_REPORT.reactive}%` }} />
              </div>
              <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500">
                La percepcion no equivale a madurez preventiva; el criterio decisivo es la respuesta ante actos inseguros.
              </p>
            </div>

            <div className="space-y-3">
              {bradleyPosition.map((stage) => (
                <div
                  key={stage.stage}
                  className={cn(
                    "rounded-2xl border p-4",
                    stage.value > 0 ? "border-red-100 bg-red-50" : "border-slate-100 bg-slate-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black uppercase text-slate-800">{stage.stage}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{stage.label}</p>
                    </div>
                    <span className="text-2xl font-black italic tabular-nums" style={{ color: stage.color }}>
                      {stage.value > 0 ? `${stage.value}%` : "--"}
                    </span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(stage.value, stage.value > 0 ? 0 : 8)}%`, backgroundColor: stage.color, opacity: stage.value > 0 ? 1 : 0.22 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8">
        <Card className="rounded-[2rem] border-2 border-slate-200 bg-white/90 shadow-2xl">
          <CardHeader className="p-7 pb-3">
            <CardTitle className="text-xl font-black uppercase italic text-slate-900">
              Modelo TriSafe
            </CardTitle>
            <CardDescription>Poder, saber y querer como condiciones de conducta segura.</CardDescription>
          </CardHeader>
          <CardContent className="p-7 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4">
            {FINAL_RAURA_TRISAFE.map((item) => (
              <div key={item.condition} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm font-black uppercase text-slate-800">{item.condition}</p>
                <p className="mt-1 text-[10px] font-bold uppercase text-slate-400">{item.status}</p>
                <p className="mt-4 text-4xl font-black italic tabular-nums" style={{ color: item.color }}>{item.value}%</p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                </div>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500">{item.evidence}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-2 border-slate-200 bg-white/90 shadow-2xl">
          <CardHeader className="p-7 pb-3">
            <CardTitle className="text-xl font-black uppercase italic text-slate-900">
              Seguimiento 6M / 12M
            </CardTitle>
            <CardDescription>Linea base comparada con metas de avance conductual.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-7 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FINAL_RAURA_FOLLOW_UP} margin={{ left: 0, right: 12, top: 12, bottom: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="8 8" stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar name="Base" dataKey="base" radius={[8, 8, 0, 0]} fill="#dc2626" />
                <Bar name="Meta 6M" dataKey="goal6" radius={[8, 8, 0, 0]} fill="#f59e0b" />
                <Bar name="Meta 12M" dataKey="goal12" radius={[8, 8, 0, 0]} fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8">
        <Card className="rounded-[2rem] border-2 border-slate-200 bg-white/90 shadow-2xl">
          <CardHeader className="p-7 pb-3">
            <CardTitle className="text-xl font-black uppercase italic text-slate-900">
              Items de menor desempeno
            </CardTitle>
            <CardDescription>Senales de silencio operativo y baja participacion.</CardDescription>
          </CardHeader>
          <CardContent className="p-7 pt-0 space-y-4">
            {FINAL_RAURA_LOW_ITEMS.map((item) => (
              <div key={item.name} className="grid grid-cols-[minmax(0,1fr)_64px] items-center gap-4">
                <div>
                  <p className="truncate text-xs font-black uppercase text-slate-600">{item.name}</p>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
                <span className="text-right text-sm font-black italic tabular-nums" style={{ color: item.color }}>
                  {item.value.toFixed(2)}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-2 border-red-100 bg-white/90 shadow-2xl">
          <CardHeader className="p-7 pb-3">
            <CardTitle className="text-xl font-black uppercase italic text-slate-900">
              Ruta critica inmediata
            </CardTitle>
            <CardDescription>Acciones para mover la curva hacia Dependiente.</CardDescription>
          </CardHeader>
          <CardContent className="p-7 pt-0 space-y-3">
            {FINAL_RAURA_INTERVENTIONS.slice(0, 6).map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/70 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-600 text-xs font-black text-white">
                  {index + 1}
                </span>
                <p className="text-xs font-black uppercase leading-relaxed text-red-800">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
