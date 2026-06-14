import {
  FileDown,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DriverSafetyEntry } from "@/lib/sheets-adapter";
import { RECOMMENDATIONS, RISK_COLORS } from "../constants";
import { getAnalysis } from "../utils";

type Html2Canvas = (
  element: HTMLElement | null,
  options: Record<string, unknown>,
) => Promise<HTMLCanvasElement>;

// Panel Lateral de Detalle Individual
export const DriverSafetyIndividualPanel = ({
  entry,
  distribution,
  onClose,
}: {
  entry: DriverSafetyEntry;
  distribution: { name: string; value: number }[];
  onClose: () => void;
}) => {
  const internalPct = (entry.internalScore / 23) * 100;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const analysis = getAnalysis(entry.result, entry.internalScore);
    const date = entry.date;
    const isApto = entry.result === "RIESGO BAJO";
    const isMedio = entry.result === "RIESGO MEDIO";
    const resultColor = isApto ? "#10b981" : isMedio ? "#f59e0b" : "#ef4444";
    const currentRecs =
      RECOMMENDATIONS[entry.result as keyof typeof RECOMMENDATIONS];

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Informe Driver Safety - ${entry.name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            body { background: #f1f5f9; font-family: 'Inter', sans-serif; color: #0f172a; margin: 0; padding: 40px; display: flex; justify-content: center; }
            .page { background: white; width: 210mm; min-height: 297mm; box-shadow: 0 20px 50px rgba(0,0,0,0.1); padding: 20mm; box-sizing: border-box; border-radius: 10px; position: relative; }
            .header { border-bottom: 4px solid #6366f1; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { color: #6366f1; font-weight: 900; font-size: 24px; letter-spacing: -1px; italics: true; }
            .title-box h1 { font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -1px; }
            .section { margin-bottom: 40px; }
            .section-title { font-size: 14px; font-weight: 900; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-left: 4px solid #6366f1; padding-left: 10px; }
            .scale-container { background: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; position: relative; margin-top: 20px; }
            .ruler { height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden; display: flex; margin: 20px 0; }
            .pointer { position: absolute; top: 45px; transform: translateX(-50%); text-align: center; }
            .pointer-line { width: 3px; height: 35px; background: ${resultColor}; margin: 0 auto; border-radius: 2px; }
            .pointer-val { background: ${resultColor}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 900; margin-top: 5px; }
            .analysis-box { background: #0f172a; color: white; padding: 30px; border-radius: 20px; line-height: 1.6; font-style: italic; font-size: 15px; }
            .footer { position: absolute; bottom: 20mm; left: 20mm; right: 20mm; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div id="report-content" class="page">
            <div class="header">
              <div class="title-box">
                <p style="font-size: 10px; font-weight: 900; color: #64748b; margin-bottom: 5px; text-transform: uppercase;">Informe de Evaluación Neural</p>
                <h1>${entry.name}</h1>
              </div>
              <div style="text-align: right">
                <div class="brand">Driver<i>Safety</i></div>
                <p style="font-size: 10px; font-weight: 700; color: #94a3b8;">${date}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">I. Datos del Evaluado</div>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">EMPRESA:</td>
                  <td style="font-weight: 900;">${entry.company}</td>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">ÁREA:</td>
                  <td style="font-weight: 900;">${entry.area}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">FECHA EVALUACIÓN:</td>
                  <td style="font-weight: 900;">${entry.date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">PUESTO:</td>
                  <td style="font-weight: 900;">${entry.position}</td>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">NIVEL DE TRABAJO:</td>
                  <td style="font-weight: 900;">${entry.level}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">ESTADO:</td>
                  <td style="font-weight: 900;">${entry.status}</td>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">RESULTADO FINAL:</td>
                  <td style="font-weight: 900; color: ${resultColor}">${entry.result}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">LINEA:</td>
                  <td style="font-weight: 900;">${entry.line}</td>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">ID EVALUACIÓN:</td>
                  <td style="font-weight: 900;">LOC-${entry.id}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">II. Balance de Control Operativo</div>
              <div class="scale-container">
                <div style="display: flex; justify-content: space-between; font-size: 9px; font-weight: 900; color: #64748b; margin-bottom: 15px;">
                  <span>DOMINANCIA EXTERNA (ALTO RIESGO)</span>
                  <span>CENTRO</span>
                  <span>DOMINANCIA INTERNA (CUMPLIMIENTO)</span>
                </div>
                <div class="ruler">
                  <div style="width: 54.3%; background: #ef4444; opacity: 0.3;"></div>
                  <div style="width: 26.1%; background: #f59e0b; opacity: 0.3;"></div>
                  <div style="width: 19.6%; background: #10b981; opacity: 0.3;"></div>
                </div>
                <div class="pointer" style="left: ${(entry.internalScore / 23) * 100}%">
                  <div class="pointer-line" style="background: ${resultColor}"></div>
                  <div class="pointer-val" style="background: ${resultColor}">${entry.result} (${entry.internalScore} pts)</div>
                </div>
              </div>
            </div>

            <div class="section" id="individual-diagnosis">
              <div class="section-title">III. Diagnóstico y Recomendaciones</div>
              <div class="analysis-box" style="background: #0f172a; color: #e2e8f0; padding: 30px; border-radius: 20px; font-style: italic; line-height: 1.6;">
                ${entry.result === "RIESGO ALTO" ? "" : `<p style="margin-bottom: 20px;">"${analysis}"</p>`}
                <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; border-left: 6px solid ${resultColor}; font-style: normal;">
                  <h4 style="color: ${resultColor}; margin-top: 0; font-size: 16px; text-transform: uppercase; font-weight: 900;">${entry.result === "RIESGO ALTO" ? "INSTRUCCIÓN GERENCIAL OBLIGATORIA" : currentRecs.title}</h4>
                  ${
                    entry.result === "RIESGO ALTO"
                      ? `
                    <p style="font-size: 15px; font-weight: 700; color: #f87171; line-height: 1.6; margin: 20px 0;">
                      Estimado(a) <span style="text-transform: uppercase; border-bottom: 2px solid #ef4444;">${entry.name}</span>, se le solicita formalmente apersonarse al área de <strong>Gerencia</strong> de la empresa <strong>${entry.company}</strong> para recibir las instrucciones y directrices correspondientes a su perfil de riesgo.
                    </p>
                  `
                      : `
                    <p style="font-size: 13px; margin-bottom: 12px; font-weight: 700;">${currentRecs.desc}</p>
                    <ul style="font-size: 12px; padding-left: 20px; margin-bottom: 20px; column-count: 1;">
                      ${currentRecs.rec.map((r) => `<li style="margin-bottom: 8px;">${r}</li>`).join("")}
                    </ul>
                  `
                  }
                  ${
                    entry.result === "RIESGO ALTO"
                      ? ""
                      : `
                    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; font-size: 11px;">
                      <span style="font-weight: 900; color: ${resultColor}; text-transform: uppercase;">PLAN DE SEGUIMIENTO:</span> ${currentRecs.followUp}
                    </div>
                  `
                  }
                </div>
              </div>
            </div>

            <div class="footer">
              Este informe es confidencial y para uso exclusivo de Seguridad Industrial • Lidera Psicología
            </div>
          </div>

          <script>
            window.onload = () => {
              const element = document.getElementById('report-content');
              html2pdf().from(element).set({
                margin: 0,
                filename: 'Resultado_Driver_Safety_${entry.name.replace(/\s+/g, "_")}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
              }).save().then(() => {
                setTimeout(() => window.close(), 1000);
              });
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
  };

  const indScore = entry.internalScore;
  const indResult = entry.result;
  const indIsApto = indResult === "RIESGO BAJO";

  return (
    <div
      className={cn(
        "h-full flex flex-col animate-in slide-in-from-right-full duration-700 cubic-bezier(0.4, 0, 0.2, 1) border-l border-border/40 bg-card/60 backdrop-blur-3xl shadow-[-20px_0_80px_rgba(0,0,0,0.2)]",
      )}
    >
      {/* Header */}
      <div className="px-6 py-6 border-b border-border/20 shrink-0 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl animate-pulse"></div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner relative z-10">
                <User className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70 mb-0.5">
                Diagnóstico Individual
              </p>
              <h3 className="text-xl font-black text-foreground leading-tight tracking-tighter uppercase italic">
                {entry.name}
              </h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-muted/5">
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Empresa
            </p>
            <p className="text-sm font-black italic">{entry.company}</p>
          </Card>
          <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Área
            </p>
            <p className="text-sm font-black italic">{entry.area}</p>
          </Card>
          <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Fecha de Evaluación
            </p>
            <p className="text-sm font-black italic">{entry.date}</p>
          </Card>
          <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Nivel de Trabajo
            </p>
            <p className="text-sm font-black italic">{entry.level}</p>
          </Card>
          <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Estado / Dictamen
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] border-primary/20 bg-primary/5 text-primary"
              >
                {entry.status}
              </Badge>
              <span
                className={cn(
                  "text-sm font-black italic uppercase",
                  indResult === "RIESGO BAJO"
                    ? "text-emerald-500"
                    : indResult === "RIESGO MEDIO"
                      ? "text-amber-500"
                      : "text-red-500",
                )}
              >
                {indResult}
              </span>
            </div>
          </Card>
          <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Puesto / Cargo
            </p>
            <p className="text-sm font-black italic">{entry.position}</p>
          </Card>
          <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
              Línea
            </p>
            <p className="text-sm font-black italic">{entry.line}</p>
          </Card>
        </div>

        {/* Aptitude Ruler Scale (Regla de Balance Binario) */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 px-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Regla de Dictamen
            Directo
          </h4>
          <div
            id="individual-ruler"
            className="bg-background/40 rounded-[2.5rem] p-8 border border-border/10 shadow-xl space-y-10 relative overflow-hidden"
          >
            <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground/40 px-1 italic">
              <span>Riesgo Alto (0-12)</span>
              <span>Riesgo Medio (13-18)</span>
              <span>Riesgo Bajo (19-23)</span>
            </div>

            <div className="relative h-12 w-full flex items-center">
              {/* The Ruler Background - Three Regions */}
              <div className="absolute inset-x-0 h-3 bg-muted/20 rounded-full flex overflow-hidden border border-border/10">
                <div
                  className="h-full bg-red-500/40 border-r border-white/10"
                  style={{ width: `${(12 / 23) * 100}%` }}
                />
                <div
                  className="h-full bg-amber-500/40 border-r border-white/10"
                  style={{ width: `${(6 / 23) * 100}%` }}
                />
                <div
                  className="h-full bg-emerald-500/40"
                  style={{ width: `${(5 / 23) * 100}%` }}
                />
              </div>

              {/* Ticks */}
              <div className="absolute inset-x-0 h-8 flex justify-between px-0.5 pointer-events-none">
                {[0, 6, 12, 18, 23].map((tick) => (
                  <div
                    key={tick}
                    className="flex flex-col items-center"
                    style={{
                      left: `${(tick / 23) * 100}%`,
                      position: "absolute",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="w-px h-2 bg-border/40 mb-1" />
                    <span className="text-[7px] font-bold text-muted-foreground/30">
                      {tick}
                    </span>
                  </div>
                ))}
              </div>

              {/* Balance Pointer */}
              <div
                className="absolute z-20 transition-all duration-1000 ease-out"
                style={{ left: `${(indScore / 23) * 100}%` }}
              >
                <div className="relative -translate-x-1/2 flex flex-col items-center">
                  <div
                    className={cn(
                      "w-1.5 h-16 -mt-2 shadow-xl rounded-full",
                      indResult === "RIESGO BAJO"
                        ? "bg-emerald-500"
                        : indResult === "RIESGO MEDIO"
                          ? "bg-amber-500"
                          : "bg-red-500",
                    )}
                  />
                  <div
                    className={cn(
                      "mt-1 px-3 py-1 rounded-full text-[10px] font-black shadow-2xl border border-white/20 whitespace-nowrap",
                      indResult === "RIESGO BAJO"
                        ? "bg-emerald-500 text-white"
                        : indResult === "RIESGO MEDIO"
                          ? "bg-amber-500 text-white"
                          : "bg-red-500 text-white",
                    )}
                  >
                    {indResult} ({indScore} pts)
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4">
              <div
                className={cn(
                  "text-center p-3 rounded-2xl border border-dashed transition-all",
                  indResult === "RIESGO ALTO"
                    ? "bg-red-500/10 border-red-500/30 ring-1 ring-red-500/20 shadow-lg shadow-red-500/10 scale-105"
                    : "opacity-30",
                )}
              >
                <p className="text-[9px] font-black uppercase text-red-600">
                  Riesgo Alto
                </p>
              </div>
              <div
                className={cn(
                  "text-center p-3 rounded-2xl border border-dashed transition-all",
                  indResult === "RIESGO MEDIO"
                    ? "bg-amber-500/10 border-amber-500/30 ring-1 border-amber-500/20 shadow-lg shadow-amber-500/10 scale-105"
                    : "opacity-30",
                )}
              >
                <p className="text-[9px] font-black uppercase text-amber-600">
                  Riesgo Medio
                </p>
              </div>
              <div
                className={cn(
                  "text-center p-3 rounded-2xl border border-dashed transition-all",
                  indResult === "RIESGO BAJO"
                    ? "bg-emerald-500/10 border-emerald-500/30 ring-1 border-emerald-500/20 shadow-lg shadow-emerald-500/10 scale-105"
                    : "opacity-30",
                )}
              >
                <p className="text-[9px] font-black uppercase text-emerald-600">
                  Riesgo Bajo
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          id="individual-diagnosis"
          className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-50" />
          <h4 className="text-[11px] font-black uppercase mb-6 text-primary flex items-center gap-2 tracking-widest">
            <Sparkles className="w-4 h-4" /> Diagnóstico & Plan de Acción
          </h4>

          <div className="space-y-6 relative z-10">
            {entry.result !== "RIESGO ALTO" && entry.result !== "ERROR" && (
              <p className="text-sm font-medium text-slate-300 leading-relaxed italic border-b border-white/5 pb-6">
                "{getAnalysis(entry.result, entry.internalScore)}"
              </p>
            )}
            {entry.result === "ERROR" && (
              <p className="text-sm font-medium text-red-400 leading-relaxed italic border-b border-white/5 pb-6">
                "{getAnalysis(entry.result, entry.internalScore)}"
              </p>
            )}

            <div className="space-y-4">
              <div
                className={cn(
                  "p-6 rounded-2xl border flex flex-col gap-3",
                  entry.result === "RIESGO BAJO"
                    ? "bg-emerald-500/5 border-emerald-500/10"
                    : entry.result === "RIESGO MEDIO"
                      ? "bg-amber-500/5 border-amber-500/10"
                      : "bg-red-500/5 border-red-500/10",
                )}
              >
                <p
                  className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                  style={{
                    color:
                      RISK_COLORS[entry.result as keyof typeof RISK_COLORS],
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor:
                        RISK_COLORS[entry.result as keyof typeof RISK_COLORS],
                    }}
                  />
                  {entry.result === "RIESGO ALTO"
                    ? "Instrucción Gerencial Obligatoria"
                    : "Recomendaciones Críticas"}
                </p>
                {entry.result === "RIESGO ALTO" ? (
                  <div className="p-4 bg-red-950/20 rounded-xl border border-red-500/20 space-y-3">
                    <p className="text-xs font-bold text-red-400 leading-relaxed italic">
                      Estimado(a){" "}
                      <span className="font-black uppercase not-italic text-red-200 underline decoration-red-500/50 decoration-2 underline-offset-4">
                        {entry.name}
                      </span>
                      , se le solicita formalmente apersonarse al área de{" "}
                      <span className="text-white font-black uppercase">
                        Gerencia
                      </span>{" "}
                      de la empresa{" "}
                      <span className="text-white font-black uppercase">
                        {entry.company}
                      </span>{" "}
                      para recibir las instrucciones y directrices
                      correspondientes a su perfil de riesgo.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {RECOMMENDATIONS[
                      entry.result as keyof typeof RECOMMENDATIONS
                    ].rec.map((r, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-slate-400 leading-snug flex gap-2"
                      >
                        <span className="text-primary font-bold">»</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {entry.result !== "RIESGO ALTO" && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Plan de Seguimiento
                  </p>
                  <p className="text-[11px] font-bold text-slate-300 leading-snug italic">
                    {
                      RECOMMENDATIONS[
                        entry.result as keyof typeof RECOMMENDATIONS
                      ].followUp
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handlePrint}
          className="w-full h-14 rounded-2xl gap-3 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
        >
          <FileDown className="w-5 h-5" /> Descargar Informe PDF
        </Button>
        <Button
          onClick={async () => {
            const excelWindow = window.open("", "_blank");
            if (!excelWindow) return;

            const analysis = getAnalysis(entry.result, entry.internalScore);
            const diff = entry.internalScore - entry.externalScore;
            const resultText = entry.result;
            const isMedio = entry.result === "RIESGO MEDIO";
            const resultColor =
              entry.result === "RIESGO BAJO"
                ? "FFD1FAE5"
                : isMedio
                  ? "FFFEF3C7"
                  : "FFFEE2E2";
            const resultTextCol =
              entry.result === "RIESGO BAJO"
                ? "FF059669"
                : isMedio
                  ? "FFD97706"
                  : "FFDC2626";

            const browserWindow = window as Window & {
              html2canvas?: Html2Canvas;
            };
            const h2c =
              browserWindow.html2canvas ||
              (await new Promise<Html2Canvas>((resolve) => {
                const script = document.createElement("script");
                script.src =
                  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                script.onload = () => resolve(browserWindow.html2canvas as Html2Canvas);
                document.head.appendChild(script);
              }));

            const rulerElement = document.getElementById("individual-ruler");
            const diagnosisElement = document.getElementById(
              "individual-diagnosis",
            );
            const pieElement = document.getElementById("dashboard-pie-chart");

            const [rulerCanvas, diagCanvas, pieCanvas] = await Promise.all([
              h2c(rulerElement, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
              }),
              h2c(diagnosisElement, {
                scale: 2,
                backgroundColor: "#0f172a",
                useCORS: true,
              }),
              pieElement
                ? h2c(pieElement, { scale: 2, useCORS: true })
                : Promise.resolve(null),
            ]);

            const rulerImg = rulerCanvas.toDataURL("image/png");
            const diagImg = diagCanvas.toDataURL("image/png");
            const pieImg = pieCanvas
              ? pieCanvas.toDataURL("image/png")
              : null;

            const script = `
              <script src="https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
              <script>
                window.onload = async () => {
                  const workbook = new ExcelJS.Workbook();
                  const worksheet = workbook.addWorksheet('Informe Individual');
                  
                  const headerStyle = {
                    font: { bold: true, color: { argb: 'FFFFFFFF' } },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } },
                    alignment: { horizontal: 'center' },
                    border: { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}}
                  };

                  const cellStyle = {
                    border: { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}},
                    alignment: { horizontal: 'center' }
                  };

                  // APELLIDOS Y NOMBRES
                  worksheet.getCell('A1').value = 'APELLIDOS Y NOMBRES';
                  worksheet.getCell('A1').style = headerStyle;
                  worksheet.getCell('A2').value = ${JSON.stringify(entry.name)};
                  worksheet.getCell('A2').font = { bold: true };
                  worksheet.getCell('A2').border = cellStyle.border;

                  // EMPRESA / PUESTO
                  worksheet.getCell('A3').value = 'EMPRESA / PUESTO';
                  worksheet.getCell('A3').style = headerStyle;
                  worksheet.getCell('A4').value = ${JSON.stringify(entry.company + " / " + entry.position)};
                  worksheet.getCell('A4').font = { bold: true };
                  worksheet.getCell('A4').border = cellStyle.border;

                  // FECHA DE EVALUACIÓN
                  worksheet.getCell('A5').value = 'FECHA DE EVALUACIÓN';
                  worksheet.getCell('A5').style = headerStyle;
                  worksheet.getCell('A6').value = ${JSON.stringify(entry.date)};
                  worksheet.getCell('A6').font = { bold: true };
                  worksheet.getCell('A6').border = cellStyle.border;

                  worksheet.getCell('A7').value = 'NIVEL DE TRABAJO';
                  worksheet.getCell('A7').style = headerStyle;
                  worksheet.getCell('A8').value = ${JSON.stringify(entry.level)};
                  worksheet.getCell('A8').font = { bold: true };
                  worksheet.getCell('A8').border = cellStyle.border;

                  worksheet.getCell('A9').value = 'ESTADO';
                  worksheet.getCell('A9').style = headerStyle;
                  worksheet.getCell('A10').value = ${JSON.stringify(entry.status)};
                  worksheet.getCell('A10').font = { bold: true };
                  worksheet.getCell('A10').border = cellStyle.border;

                  // TABLA RESULTADOS
                  worksheet.mergeCells('C1:D1');
                  worksheet.getCell('C1').value = 'RESULTADOS';
                  worksheet.getCell('C1').style = headerStyle;

                  const resultsData = [
                    ['INTERNO', ${entry.internalScore}],
                    ['EXTERNO', ${entry.externalScore}],
                    ['DRIVER SAFETY', ${JSON.stringify(resultText)}]
                  ];

                  resultsData.forEach((row, i) => {
                    const rowNum = i + 2;
                    worksheet.getCell('C' + rowNum).value = row[0];
                    worksheet.getCell('D' + rowNum).value = row[1];
                    worksheet.getCell('C' + rowNum).style = {...cellStyle, font: {bold: true}};
                    worksheet.getCell('D' + rowNum).style = cellStyle;
                    
                    if (row[0] === 'DRIVER SAFETY') {
                       worksheet.getCell('D' + rowNum).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ${JSON.stringify(resultColor.replace("#", ""))} } };
                       worksheet.getCell('D' + rowNum).font = { bold: true, color: { argb: ${JSON.stringify(resultTextCol.replace("#", ""))} } };
                    }
                  });

                  // REGLAS
                  const rules = [
                    ['<=12', 'RIESGO ALTO'],
                    ['13 a 18', 'RIESGO MEDIO'],
                    ['19 a 23', 'RIESGO BAJO']
                  ];
                  let ruleRow = 8;
                  worksheet.mergeCells('C' + ruleRow + ':D' + ruleRow);
                  worksheet.getCell('C' + ruleRow).value = 'ESCALA DE CALIFICACION';
                  worksheet.getCell('C' + ruleRow).style = headerStyle;
                  ruleRow++;
                  rules.forEach((rule, i) => {
                    worksheet.getCell('C' + (ruleRow + i)).value = rule[0];
                    worksheet.getCell('D' + (ruleRow + i)).value = rule[1];
                    worksheet.getCell('C' + (ruleRow + i)).style = cellStyle;
                    worksheet.getCell('D' + (ruleRow + i)).style = cellStyle;
                  });

                  // RECOMENDACIONES EN EXCEL (A la izquierda debajo del nombre)
                  let recRow = 12;
                  worksheet.mergeCells('A' + recRow + ':B' + recRow);
                  worksheet.getCell('A' + recRow).value = 'DIAGNÓSTICO Y RECOMENDACIONES';
                  worksheet.getCell('A' + recRow).style = headerStyle;
                  recRow++;
                  
                  const recs = ${JSON.stringify(RECOMMENDATIONS)}[${JSON.stringify(resultText)}];
                  
                  if (entry.result !== 'RIESGO ALTO') {
                    worksheet.getCell('A' + recRow).value = 'Situación:';
                    worksheet.getCell('B' + recRow).value = ${JSON.stringify(analysis)};
                    worksheet.getCell('A' + recRow).font = { bold: true };
                    worksheet.getCell('B' + recRow).alignment = { wrapText: true, vertical: 'middle' };
                    recRow += 2;
                  }

                  worksheet.getCell('A' + recRow).value = entry.result === 'RIESGO ALTO' ? 'Instrucción Gerencial:' : 'Acciones Correctivas:';
                  worksheet.getCell('A' + recRow).font = { bold: true };
                  recRow++;
                  if (entry.result === 'RIESGO ALTO') {
                    worksheet.getCell('A' + recRow).value = 'Estimado(a) ' + entry.name.toUpperCase() + ', se le solicita formalmente apersonarse al área de Gerencia de la empresa ' + entry.company.toUpperCase() + ' para recibir las instrucciones y directrices correspondientes.';
                    worksheet.mergeCells('A' + recRow + ':B' + recRow);
                    worksheet.getCell('A' + recRow).font = { bold: true, color: { argb: 'FFFF0000' } };
                    worksheet.getCell('A' + recRow).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
                    recRow++;
                  } else {
                    recs.rec.forEach(r => {
                      worksheet.getCell('A' + recRow).value = '• ' + r;
                      worksheet.mergeCells('A' + recRow + ':B' + recRow);
                      worksheet.getCell('A' + recRow).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
                      recRow++;
                    });
                  }
                  if (entry.result !== 'RIESGO ALTO') {
                    recRow++;
                    worksheet.getCell('A' + recRow).value = 'Plan de Seguimiento:';
                    worksheet.getCell('B' + recRow).value = recs.followUp;
                    worksheet.getCell('A' + recRow).font = { bold: true };
                    worksheet.getCell('B' + recRow).alignment = { wrapText: true, vertical: 'middle' };
                    worksheet.getCell('B' + recRow).font = { bold: true, color: { argb: ${JSON.stringify(resultTextCol.replace("#", ""))} } };
                  }


                  // TABLA DISTRIBUCIÓN
                  let distRow = 13;
                  worksheet.mergeCells('C' + distRow + ':D' + distRow);
                  worksheet.getCell('C' + distRow).value = 'RESUMEN GRUPAL';
                  worksheet.getCell('C' + distRow).style = headerStyle;
                  distRow++;
                  const distributionData = ${JSON.stringify(distribution)};
                  distributionData.forEach((item, i) => {
                    worksheet.getCell('C' + (distRow + i)).value = item.name;
                    worksheet.getCell('D' + (distRow + i)).value = item.value;
                    worksheet.getCell('C' + (distRow + i)).style = cellStyle;
                    worksheet.getCell('D' + (distRow + i)).style = cellStyle;
                  });

                  // IMAGENES (A LA DERECHA)
                  const rulerImgSource = "${rulerImg}";
                  if (rulerImgSource && rulerImgSource !== "null") {
                    const imgId = workbook.addImage({ base64: rulerImgSource, extension: 'png' });
                    worksheet.addImage(imgId, {
                      tl: { col: 5, row: 1 },
                      ext: { width: 500, height: 280 }
                    });
                  }

                  const pieImgSource = "${pieImg}";
                  if (pieImgSource && pieImgSource !== "null") {
                    const imgId = workbook.addImage({ base64: pieImgSource, extension: 'png' });
                    worksheet.addImage(imgId, {
                      tl: { col: 5, row: 18 },
                      ext: { width: 400, height: 350 }
                    });
                  }

                  const diagImgSource = "${diagImg}";
                  if (diagImgSource && diagImgSource !== "null") {
                    const imgId = workbook.addImage({ base64: diagImgSource, extension: 'png' });
                    worksheet.addImage(imgId, {
                      tl: { col: 5, row: 40 },
                      ext: { width: 500, height: 120 }
                    });
                  }

                  worksheet.getColumn(1).width = 30;
                  worksheet.getColumn(2).width = 90; // Much wider for recommendations
                  worksheet.getColumn(3).width = 25;
                  worksheet.getColumn(4).width = 25;
                  worksheet.getColumn(5).width = 5; // Space
                  worksheet.getColumn(6).width = 80; // Chart column

                  const buffer = await workbook.xlsx.writeBuffer();
                  saveAs(new Blob([buffer]), "Informe_Driver_Safety_${entry.name.replace(/\s+/g, "_")}.xlsx");
                  setTimeout(() => window.close(), 1000);
                };
              </script>
            `;
            excelWindow.document.write(script);
            excelWindow.document.close();
          }}
          variant="outline"
          className="w-full h-14 rounded-2xl gap-3 border-primary/20 hover:bg-primary/5 text-primary font-black uppercase tracking-widest text-xs"
        >
          <FileSpreadsheet className="w-5 h-5" /> Descargar Excel
        </Button>
      </div>
    </div>
  );
};
