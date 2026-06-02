import { useMemo } from "react";
import { Brain, MessageSquare, User, X, Zap } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RauraEntry } from "@/lib/sheets-adapter";
import { CAT_COLORS, DIMENSION_DEFINITIONS } from "../dpmsRaura.constants";
import { buildEntryAnalysis, getInterpretation } from "../dpmsRaura.utils";

export const EntryPanel = ({
  entry,
  onClose,
}: {
  entry: RauraEntry;
  onClose: () => void;
}) => {
  const aiResult = useMemo(() => buildEntryAnalysis(entry), [entry]);

  const radarData = useMemo(
    () => [
      { subject: "LIDERAZGO", A: entry.dimensions.liderazgo.score, fullMark: 100 },
      { subject: "PERCEPCION", A: entry.dimensions.percepcion.score, fullMark: 100 },
      { subject: "COMUNICACION", A: entry.dimensions.comunicacion.score, fullMark: 100 },
      { subject: "ROL EQUIPO", A: entry.dimensions.rolEquipo.score, fullMark: 100 },
      { subject: "CULTURA", A: entry.dimensions.cultura.score, fullMark: 100 },
      { subject: "MOTIVACION", A: entry.dimensions.motivacion.score, fullMark: 100 },
    ],
    [entry],
  );

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-full duration-700 cubic-bezier(0.23, 1, 0.32, 1) border-l border-white/10 bg-white/40 backdrop-blur-3xl shadow-[-20px_0_80px_rgba(0,0,0,0.1)]">
      <div className="px-8 py-8 border-b border-black/5 shrink-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl animate-pulse group-hover:bg-primary/30 transition-all" />
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
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Area", entry.area],
            ["Fecha", entry.fecha],
            ["Personal de direccion", entry.name],
            ["Empresa", entry.empresa],
          ].map(([label, value]) => (
            <div key={label} className="p-4 rounded-[1.5rem] bg-white/60 border border-white/20 shadow-sm transition-all hover:shadow-md">
              <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
                {label}
              </p>
              <p className="text-xs font-bold text-foreground truncate uppercase">
                {value}
              </p>
            </div>
          ))}
          <div className="p-4 rounded-[1.5rem] bg-white/60 border border-white/20 shadow-sm transition-all hover:shadow-md col-span-2">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Nombre de Empresa o Contrata
            </p>
            <p className="text-xs font-bold text-foreground truncate uppercase">
              {entry.contrata || "No especificado"}
            </p>
          </div>
        </div>

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
                  dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {Object.entries(entry.dimensions).map(([key, dim], idx) => {
            const label =
              key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1");
            const color = Object.values(CAT_COLORS)[idx];
            const val = (dim.valor || dim.perfil || "").toUpperCase().trim();
            let definition = "";
            for (const cat in DIMENSION_DEFINITIONS) {
              if (DIMENSION_DEFINITIONS[cat][val]) {
                definition = DIMENSION_DEFINITIONS[cat][val];
                break;
              }
            }
            if (!definition) {
              for (const cat in DIMENSION_DEFINITIONS) {
                for (const definitionKey in DIMENSION_DEFINITIONS[cat]) {
                  if (val.includes(definitionKey)) {
                    definition = DIMENSION_DEFINITIONS[cat][definitionKey];
                    break;
                  }
                }
                if (definition) break;
              }
            }

            return (
              <div key={key} className="relative group cursor-default">
                <div
                  className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-40 transition-opacity rounded-3xl"
                  style={{ backgroundColor: color }}
                />
                <Card className="rounded-[2rem] border-border/40 bg-white/80 shadow-sm relative z-10 overflow-hidden group-hover:-translate-y-1 transition-transform h-full">
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: color }} />
                  <CardHeader className="p-5 pb-1">
                    <CardTitle className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-2xl font-black tabular-nums tracking-tighter" style={{ color }}>
                        {Math.round(dim.score)}%
                      </p>
                      <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-tighter border-muted-foreground/20 text-muted-foreground">
                        {dim.valor || dim.perfil}
                      </Badge>
                    </div>
                    {definition && (
                      <p className="text-[9px] text-muted-foreground leading-relaxed italic border-l border-muted-foreground/20 pl-2">
                        {definition}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="relative p-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] border border-indigo-500/30 shadow-3xl group overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.4em] italic mb-1">
                  Diagnostico IA Psicologia Expert
                </h4>
                <p className="text-xs font-bold text-indigo-100/60">
                  Analisis Conductual y Predictivo
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
                  Basado en el perfil cualitativo, se recomienda priorizar el desarrollo de competencias en las areas de menor puntuacion para equilibrar la cultura organizacional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {entry.comentarios && (
          <div className="relative p-7 bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-3xl group overflow-hidden">
            <div className="absolute top-0 right-0 p-5 opacity-10">
              <MessageSquare className="w-16 h-16 text-primary" />
            </div>
            <h4 className="text-[10px] font-black uppercase text-primary mb-4 flex items-center gap-3 tracking-[0.4em] italic">
              <Zap className="w-4 h-4 fill-primary" /> Transcripcion Critica
            </h4>
            <p className="text-sm font-medium text-slate-200 leading-relaxed italic relative z-10 selection:bg-primary/30">
              "{getInterpretation(entry.comentarios)}"
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/80 px-2 italic">
            Columnas de Encuesta
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(entry.responses || {}).map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-border/40 bg-white/80 p-4 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/70 leading-snug">
                  {label}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground leading-relaxed">
                  {value || "No especificado"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
