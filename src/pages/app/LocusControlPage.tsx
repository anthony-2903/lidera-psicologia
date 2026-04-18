import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLocusControlData, LocusControlEntry } from "@/lib/sheets-adapter";
import { 
  Target, Brain, Zap, ShieldCheck, Users, Search, RefreshCw, AlertCircle,
  TrendingUp, ArrowRight, User, Filter, Globe, ChevronRight, LayoutDashboard, List,
  X, FileDown, Sparkles, ActivityIcon, FileSpreadsheet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/dashboard/DashboardCards";
import { cn } from "@/lib/utils";

const SHEET_ID = "1nrHMcI8fWlBKIWIv9aprjElPhY-ccmXX";

const RISK_COLORS = {
  'RIESGO ALTO': '#ef4444',   // Red-500
  'RIESGO MEDIO': '#f59e0b',  // Amber-500
  'APTO': '#10b981'           // Emerald-500
};

const RECOMMENDATIONS = {
  'APTO': {
    title: '🟢 RECOMENDACIÓN: APTO (Bajo Riesgo)',
    desc: 'Trabajadores con alto nivel de responsabilidad (control interno).',
    rec: [
      'Mantener en tareas críticas, asegurando continuidad del desempeño.',
      'Designar como modelo de conducta segura dentro del equipo.',
      'Refuerzo mediante reconocimiento conductual (feedback positivo).',
      'Involucrar en inducciones o charlas de seguridad como referente.',
      'Seguimiento periódico (no intensivo) para asegurar sostenibilidad.',
      'Considerar en procesos de liderazgo.'
    ],
    followUp: 'Reevaluación cada 12 meses'
  },
  'RIESGO MEDIO': {
    title: '🟡 RECOMENDACIÓN: RIESGO MEDIO (Riesgo Moderado)',
    desc: 'Trabajadores con responsabilidad parcial, pero con tendencia a justificar errores.',
    rec: [
      'Realizar charlas cortas focalizadas en responsabilidad personal, toma de decisiones, condiciones personales y fallos graves.',
      'Supervisión más cercana en tareas críticas.',
      'Retroalimentación directa del supervisor sea inmediata y específica.',
      'Establecer sensibilización con los compromisos conductuales de seguridad.',
      'Brindar retroalimentación individual.'
    ],
    followUp: 'Reevaluación cada 6 meses. Monitoreo trimestral de incidentes.'
  },
  'RIESGO ALTO': {
    title: '🔴 RECOMENDACIÓN: RIESGO ALTO (Alto Riesgo)',
    desc: 'Trabajadores con tendencia fuerte a no asumir responsabilidad.',
    rec: [
      'Implementar plan de intervención conductual individual.',
      'Seguimiento por la supervisión en campo estricto y continuo.',
      'Participación obligatoria en programas de sensibilización en seguridad.',
      'Retroalimentación directa e inmediata ante desviaciones comportamentales.',
      'Evaluar antecedentes (incidentes, incumplimientos, reportes).',
      'Reasignación temporal a funciones de menor exposición al riesgo.',
      'Reevaluación obligatoria antes de reincorporación a tareas críticas.'
    ],
    followUp: 'Evaluación cada 3 meses. Seguimiento mensual. Levantar restricciones solo si mejora su nivel.'
  }
};
si mejora su nivel.'
  }
};

const getAnalysis = (internal: number) => {
  if (internal >= 19) return "Perfil con dominancia interna sólida (Apto). El evaluado asume responsabilidad directa sobre sus acciones y resultados, mostrando un alto compromiso con la seguridad operativa y el cumplimiento de normas.";
  if (internal >= 13) return "Perfil con control de riesgo medio. Si bien asume responsabilidad, aún existe una tendencia parcial a atribuir eventos a factores externos. Se recomienda reforzamiento en cultura de seguridad.";
  return "Perfil con dominancia externa (Riesgo Alto). Existe una marcada tendencia a atribuir los resultados a factores ajenos a su voluntad, lo que aumenta la probabilidad de conductas inseguras por falta de responsabilidad personal.";
};

// Panel Lateral de Detalle Individual
const LocusIndividualPanel = ({ entry, distribution, onClose }: { 
  entry: LocusControlEntry, 
  distribution: { name: string, value: number }[],
  onClose: () => void 
}) => {
  const internalPct = (entry.internalScore / 23) * 100;
  

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const analysis = getAnalysis(entry.internalScore);
    const date = new Date().toLocaleDateString();
    const isApto = entry.result === 'APTO';
    const isMedio = entry.result === 'RIESGO MEDIO';
    const resultColor = isApto ? "#10b981" : (isMedio ? "#f59e0b" : "#ef4444");
    const currentRecs = RECOMMENDATIONS[entry.result as keyof typeof RECOMMENDATIONS];

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Informe Locus - ${entry.name}</title>
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
            .pointer-line { width: 3px; height: 35px; background: ${isApto ? "#10b981" : "#ef4444"}; margin: 0 auto; border-radius: 2px; }
            .pointer-val { background: ${isApto ? "#10b981" : "#ef4444"}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 900; margin-top: 5px; }
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
                <div class="brand">Locus<i>Control</i></div>
                <p style="font-size: 10px; font-weight: 700; color: #94a3b8;">${date}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">I. Datos del Evaluado</div>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">EMPRESA:</td>
                  <td style="font-weight: 900;">${entry.company}</td>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">ID EVALUACIÓN:</td>
                  <td style="font-weight: 900;">LOC-${entry.id}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">PUESTO:</td>
                  <td style="font-weight: 900;">${entry.position}</td>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 700;">RESULTADO FINAL:</td>
                  <td style="font-weight: 900; color: ${resultColor}">${entry.result}</td>
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
                <p style="margin-bottom: 20px;">"${analysis}"</p>
                <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; border-left: 6px solid ${resultColor}; font-style: normal;">
                  <h4 style="color: ${resultColor}; margin-top: 0; font-size: 16px; text-transform: uppercase; font-weight: 900;">${currentRecs.title}</h4>
                  <p style="font-size: 13px; margin-bottom: 12px; font-weight: 700;">${currentRecs.desc}</p>
                  <ul style="font-size: 12px; padding-left: 20px; margin-bottom: 20px; column-count: 1;">
                    ${currentRecs.rec.map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('')}
                  </ul>
                  <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; font-size: 11px;">
                    <span style="font-weight: 900; color: ${resultColor}; text-transform: uppercase;">PLAN DE SEGUIMIENTO:</span> ${currentRecs.followUp}
                  </div>
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
                filename: 'Resultado_Locus_${entry.name.replace(/\s+/g, '_')}.pdf',
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
  const indIsApto = indResult === 'APTO';

  return (
    <div className={cn(
      "h-full flex flex-col animate-in slide-in-from-right-full duration-700 cubic-bezier(0.4, 0, 0.2, 1) border-l border-border/40 bg-card/60 backdrop-blur-3xl shadow-[-20px_0_80px_rgba(0,0,0,0.2)]"
    )}>
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
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70 mb-0.5">Diagnóstico Individual</p>
              <h3 className="text-xl font-black text-foreground leading-tight tracking-tighter uppercase italic">{entry.name}</h3>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-red-500/10 hover:text-red-500 transition-all">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-muted/5">
        <div className="grid grid-cols-2 gap-4">
           <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
              <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Empresa</p>
              <p className="text-sm font-black italic">{entry.company}</p>
           </Card>
           <Card className="rounded-3xl border-border/20 bg-background/50 p-4">
              <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Dictamen Individual</p>
              <p className={cn(
                "text-sm font-black italic uppercase",
                indResult === 'APTO' ? "text-emerald-500" : (indResult === 'RIESGO MEDIO' ? "text-amber-500" : "text-red-500")
              )}>
                {indResult}
              </p>
            </Card>
        </div>

        {/* Aptitude Ruler Scale (Regla de Balance Binario) */}
        <div className="space-y-4">
           <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 px-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Regla de Dictamen Directo
           </h4>
           <div id="individual-ruler" className="bg-background/40 rounded-[2.5rem] p-8 border border-border/10 shadow-xl space-y-10 relative overflow-hidden">
              <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground/40 px-1 italic">
                 <span>Riesgo Alto (0-12)</span>
                 <span>Riesgo Medio (13-18)</span>
                 <span>Apto (19-23)</span>
              </div>
              
              <div className="relative h-12 w-full flex items-center">
                 {/* The Ruler Background - Three Regions */}
                 <div className="absolute inset-x-0 h-3 bg-muted/20 rounded-full flex overflow-hidden border border-border/10">
                    <div className="h-full bg-red-500/40 border-r border-white/10" style={{ width: `${(12/23)*100}%` }} />
                    <div className="h-full bg-amber-500/40 border-r border-white/10" style={{ width: `${(6/23)*100}%` }} />
                    <div className="h-full bg-emerald-500/40" style={{ width: `${(5/23)*100}%` }} />
                 </div>

                 {/* Ticks */}
                 <div className="absolute inset-x-0 h-8 flex justify-between px-0.5 pointer-events-none">
                    {[0, 6, 12, 18, 23].map((tick) => (
                      <div key={tick} className="flex flex-col items-center" style={{ left: `${(tick/23)*100}%`, position: 'absolute', transform: 'translateX(-50%)' }}>
                        <div className="w-px h-2 bg-border/40 mb-1" />
                        <span className="text-[7px] font-bold text-muted-foreground/30">{tick}</span>
                      </div>
                    ))}
                 </div>

                 {/* Balance Pointer */}
                 <div 
                    className="absolute z-20 transition-all duration-1000 ease-out"
                    style={{ left: `${(indScore / 23) * 100}%` }}
                 >
                    <div className="relative -translate-x-1/2 flex flex-col items-center">
                       <div className={cn(
                         "w-1.5 h-16 -mt-2 shadow-xl rounded-full",
                         indResult === 'APTO' ? "bg-emerald-500" : (indResult === 'RIESGO MEDIO' ? "bg-amber-500" : "bg-red-500")
                       )} />
                       <div className={cn(
                         "mt-1 px-3 py-1 rounded-full text-[10px] font-black shadow-2xl border border-white/20 whitespace-nowrap",
                         indResult === 'APTO' ? "bg-emerald-500 text-white" : (indResult === 'RIESGO MEDIO' ? "bg-amber-500 text-white" : "bg-red-500 text-white")
                       )}>
                         {indResult} ({indScore} pts)
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4">
                 <div className={cn("text-center p-3 rounded-2xl border border-dashed transition-all", indResult === 'RIESGO ALTO' ? "bg-red-500/10 border-red-500/30 ring-1 ring-red-500/20 shadow-lg shadow-red-500/10 scale-105" : "opacity-30")}>
                    <p className="text-[9px] font-black uppercase text-red-600">Riesgo Alto</p>
                 </div>
                 <div className={cn("text-center p-3 rounded-2xl border border-dashed transition-all", indResult === 'RIESGO MEDIO' ? "bg-amber-500/10 border-amber-500/30 ring-1 border-amber-500/20 shadow-lg shadow-amber-500/10 scale-105" : "opacity-30")}>
                    <p className="text-[9px] font-black uppercase text-amber-600">Riesgo Medio</p>
                 </div>
                 <div className={cn("text-center p-3 rounded-2xl border border-dashed transition-all", indResult === 'APTO' ? "bg-emerald-500/10 border-emerald-500/30 ring-1 border-emerald-500/20 shadow-lg shadow-emerald-500/10 scale-105" : "opacity-30")}>
                    <p className="text-[9px] font-black uppercase text-emerald-600">Apto</p>
                 </div>
              </div>
           </div>
        </div>

        <div id="individual-diagnosis" className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-50" />
          <h4 className="text-[11px] font-black uppercase mb-6 text-primary flex items-center gap-2 tracking-widest">
             <Sparkles className="w-4 h-4" /> Diagnóstico & Plan de Acción
          </h4>
          
          <div className="space-y-6 relative z-10">
            <p className="text-sm font-medium text-slate-300 leading-relaxed italic border-b border-white/5 pb-6">"{getAnalysis(entry.internalScore)}"</p>
            
            <div className="space-y-4">
               <div className={cn(
                 "p-6 rounded-2xl border flex flex-col gap-3",
                 entry.result === 'APTO' ? "bg-emerald-500/5 border-emerald-500/10" : (entry.result === 'RIESGO MEDIO' ? "bg-amber-500/5 border-amber-500/10" : "bg-red-500/5 border-red-500/10")
               )}>
                  <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: RISK_COLORS[entry.result as keyof typeof RISK_COLORS] }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: RISK_COLORS[entry.result as keyof typeof RISK_COLORS] }} />
                    Recomendaciones Críticas
                  </p>
                  <ul className="space-y-3">
                     {RECOMMENDATIONS[entry.result as keyof typeof RECOMMENDATIONS].rec.map((r, i) => (
                       <li key={i} className="text-[11px] text-slate-400 leading-snug flex gap-2">
                         <span className="text-primary font-bold">»</span>
                         {r}
                       </li>
                     ))}
                  </ul>
               </div>

               <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Plan de Seguimiento</p>
                  <p className="text-[11px] font-bold text-slate-300 leading-snug italic">
                     {RECOMMENDATIONS[entry.result as keyof typeof RECOMMENDATIONS].followUp}
                  </p>
               </div>
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
            const excelWindow = window.open('', '_blank');
            if (!excelWindow) return;
            
            const analysis = getAnalysis(entry.internalScore);
            const diff = entry.internalScore - entry.externalScore;
            const resultText = entry.result;
            const isMedio = entry.result === 'RIESGO MEDIO';
            const resultColor = entry.result === 'APTO' ? 'FFD1FAE5' : (isMedio ? 'FFFEF3C7' : 'FFFEE2E2'); 
            const resultTextCol = entry.result === 'APTO' ? 'FF059669' : (isMedio ? 'FFD97706' : 'FFDC2626'); 

            // @ts-ignore
            const h2c = window.html2canvas || await new Promise((resolve) => {
              const script = document.createElement('script');
              script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
              script.onload = () => resolve((window as any).html2canvas);
              document.head.appendChild(script);
            });

            const rulerElement = document.getElementById('individual-ruler');
            const diagnosisElement = document.getElementById('individual-diagnosis');
            const pieElement = document.getElementById('dashboard-pie-chart');
            
            const [rulerCanvas, diagCanvas, pieCanvas] = await Promise.all([
              h2c(rulerElement, { scale: 2, backgroundColor: null, useCORS: true }),
              h2c(diagnosisElement, { scale: 2, backgroundColor: '#0f172a', useCORS: true }),
              pieElement ? h2c(pieElement, { scale: 2, useCORS: true }) : Promise.resolve(null)
            ]);

            const rulerImg = (rulerCanvas as any).toDataURL('image/png');
            const diagImg = (diagCanvas as any).toDataURL('image/png');
            const pieImg = pieCanvas ? (pieCanvas as any).toDataURL('image/png') : null;

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

                  // TABLA RESULTADOS
                  worksheet.mergeCells('C1:D1');
                  worksheet.getCell('C1').value = 'RESULTADOS';
                  worksheet.getCell('C1').style = headerStyle;

                  const resultsData = [
                    ['INTERNO', ${entry.internalScore}],
                    ['EXTERNO', ${entry.externalScore}],
                    ['LOCUS DE CONTR', ${JSON.stringify(resultText)}]
                  ];

                  resultsData.forEach((row, i) => {
                    const rowNum = i + 2;
                    worksheet.getCell('C' + rowNum).value = row[0];
                    worksheet.getCell('D' + rowNum).value = row[1];
                    worksheet.getCell('C' + rowNum).style = {...cellStyle, font: {bold: true}};
                    worksheet.getCell('D' + rowNum).style = cellStyle;
                    
                    if (row[0] === 'LOCUS DE CONTR') {
                       worksheet.getCell('D' + rowNum).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ${JSON.stringify(resultColor.replace('#', ''))} } };
                       worksheet.getCell('D' + rowNum).font = { bold: true, color: { argb: ${JSON.stringify(resultTextCol.replace('#', ''))} } };
                    }
                  });

                  // REGLAS
                  const rules = [
                    ['<=12', 'RIESGO ALTO'],
                    ['13 a 18', 'RIESGO MEDIO'],
                    ['19 a 23', 'APTO']
                  ];
                  let ruleRow = 6;
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
                  let recRow = 4;
                  worksheet.mergeCells('A' + recRow + ':B' + recRow);
                  worksheet.getCell('A' + recRow).value = 'DIAGNÓSTICO Y RECOMENDACIONES';
                  worksheet.getCell('A' + recRow).style = headerStyle;
                  recRow++;
                  
                  const recs = ${JSON.stringify(RECOMMENDATIONS)}[${JSON.stringify(resultText)}];
                  
                  worksheet.getCell('A' + recRow).value = 'Situación:';
                  worksheet.getCell('B' + recRow).value = ${JSON.stringify(analysis)};
                  worksheet.getCell('A' + recRow).font = { bold: true };
                  worksheet.getCell('B' + recRow).alignment = { wrapText: true, vertical: 'middle' };
                  recRow += 2;

                  worksheet.getCell('A' + recRow).value = 'Acciones Correctivas:';
                  worksheet.getCell('A' + recRow).font = { bold: true };
                  recRow++;
                  recs.rec.forEach(r => {
                    worksheet.getCell('A' + recRow).value = '• ' + r;
                    worksheet.mergeCells('A' + recRow + ':B' + recRow);
                    worksheet.getCell('A' + recRow).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
                    recRow++;
                  });
                  recRow++;
                  
                  worksheet.getCell('A' + recRow).value = 'Plan de Seguimiento:';
                  worksheet.getCell('B' + recRow).value = recs.followUp;
                  worksheet.getCell('A' + recRow).font = { bold: true };
                  worksheet.getCell('B' + recRow).alignment = { wrapText: true, vertical: 'middle' };
                  worksheet.getCell('B' + recRow).font = { bold: true, color: { argb: ${JSON.stringify(resultTextCol.replace('#', ''))} } };


                  // TABLA DISTRIBUCIÓN
                  let distRow = 11;
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
                  saveAs(new Blob([buffer]), "Informe_Locus_${entry.name.replace(/\s+/g, '_')}.xlsx");
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

const LocusControlPage = () => {
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedEntry, setSelectedEntry] = useState<LocusControlEntry | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['locusControl', SHEET_ID],
    queryFn: () => fetchLocusControlData(SHEET_ID),
  });

  const handleDownloadExcelDashboard = async () => {
    const excelWindow = window.open('', '_blank');
    if (!excelWindow) return;

    // @ts-ignore
    const h2c = window.html2canvas || await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = () => resolve((window as any).html2canvas);
      document.head.appendChild(script);
    });

    const pieElement = document.getElementById('dashboard-pie-chart');
    const compElement = document.getElementById('dashboard-comparison-chart');

    const [pieCanvas, compCanvas] = await Promise.all([
      h2c(pieElement, { scale: 2, useCORS: true }),
      h2c(compElement, { scale: 2, useCORS: true })
    ]);

    const pieImg = (pieCanvas as any).toDataURL('image/png');
    const compImg = (compCanvas as any).toDataURL('image/png');

    const excelData = filteredEntries.map(entry => ({
      ID: `LOC-${entry.id}`,
      Nombre: entry.name,
      Empresa: entry.company,
      Puesto: entry.position,
      'Puntaje Interno': entry.internalScore,
      'Puntaje Externo': entry.externalScore,
      Balance: entry.internalScore - entry.externalScore,
      Resultado: entry.result,
      'Diagnóstico': entry.internalScore - entry.externalScore > 0 
        ? "Perfil con dominancia interna. El evaluado asume responsabilidad directa sobre sus acciones y resultados, mostrando proactividad en seguridad." 
        : "Perfil con dominancia externa. Existe una tendencia a atribuir resultados a factores ajenos, lo que sugiere una menor autonomía operativa."
    }));

      const script = `
        <script src="https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
        <script>
          window.onload = async () => {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Dashboard Data');
            
            // Título
            worksheet.mergeCells('A1:I1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = 'REPORTE EJECUTIVO - LOCUS DE CONTROL';
            titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
            titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1B4B' } };
            titleCell.alignment = { horizontal: 'center' };

            // Gráficos
            let currentY = 3;
            const pieImgSource = ${JSON.stringify(pieImg)};
            if (pieImgSource && pieImgSource !== "null") {
              const imgId = workbook.addImage({ base64: pieImgSource, extension: 'png' });
              worksheet.addImage(imgId, {
                tl: { col: 0, row: currentY },
                ext: { width: 350, height: 300 }
              });
            }

            const compImgSource = ${JSON.stringify(compImg)};
            if (compImgSource && compImgSource !== "null") {
              const imgId = workbook.addImage({ base64: compImgSource, extension: 'png' });
              worksheet.addImage(imgId, {
                tl: { col: 4, row: currentY },
                ext: { width: 550, height: 300 }
              });
            }

            currentY += 18;

            // Tabla de Datos
            const headers = ['ID', 'Nombre', 'Empresa', 'Puesto', 'Interno', 'Externo', 'Balance', 'Resultado', 'Diagnóstico'];
            const headerRow = worksheet.getRow(currentY);
            headers.forEach((h, i) => {
              const cell = headerRow.getCell(i + 1);
              cell.value = h;
              cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
            });

            const data = ${JSON.stringify(excelData)};
            data.forEach((item, idx) => {
              const row = worksheet.getRow(currentY + 1 + idx);
              row.getCell(1).value = item.ID;
              row.getCell(2).value = item.Nombre;
              row.getCell(3).value = item.Empresa;
              row.getCell(4).value = item.Puesto;
              row.getCell(5).value = item['Puntaje Interno'];
              row.getCell(6).value = item['Puntaje Externo'];
              row.getCell(7).value = item.Balance;
              row.getCell(8).value = item.Resultado;
              row.getCell(9).value = item.Diagnóstico;
              row.getCell(9).alignment = { wrapText: true, vertical: 'middle' };

              // Formato condicional colores
              const resCell = row.getCell(8);
              if (item.Resultado === 'APTO') {
                resCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
                resCell.font = { color: { argb: 'FF059669' }, bold: true };
              } else if (item.Resultado === 'RIESGO MEDIO') {
                resCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
                resCell.font = { color: { argb: 'FFD97706' }, bold: true };
              } else {
                resCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
                resCell.font = { color: { argb: 'FFDC2626' }, bold: true };
              }
            });

            // Ajustes de ancho
            worksheet.getColumn(1).width = 12;
            worksheet.getColumn(2).width = 30;
            worksheet.getColumn(3).width = 20;
            worksheet.getColumn(4).width = 25;
            worksheet.getColumn(8).width = 15;
            worksheet.getColumn(9).width = 50;

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), "Reporte_General_Locus.xlsx");
            setTimeout(() => window.close(), 1000);
          };
        </script>
      `;
      excelWindow.document.write(script);
      excelWindow.document.close();
  };

  const handlePrintDashboard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Capturamos el contenido actual (Dashboard o Lista)
    const container = document.querySelector('.flex-1.space-y-12'); 
    if (!container) return;

    const contentHtml = container.innerHTML;

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dashboard Locus de Control</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: white; font-family: 'Inter', sans-serif; padding: 40px; }
            .no-print { display: none !important; }
            canvas, .recharts-responsive-container { min-height: 300px !important; }
          </style>
        </head>
        <body>
          <div id="print-area">
            ${contentHtml}
          </div>
          <script>
            window.onload = () => {
              // Limpiar elementos no deseados de la captura
              document.querySelectorAll('button').forEach(b => b.classList.add('no-print'));
              
              const element = document.getElementById('print-area');
              html2pdf().from(element).set({
                margin: 10,
                filename: 'Dashboard_Locus_Control.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 1.5, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
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

  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    return data.entries.filter(entry => {
      const matchesSearch = entry.name.toLowerCase().includes(search.toLowerCase()) ||
                           entry.company.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || entry.result === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const handleExportBulkExcel = async () => {
    const excelWindow = window.open('', '_blank');
    if (!excelWindow) return;
    
    excelWindow.document.write(`
      <html>
        <head>
          <title>Generando Base Completa...</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #1e293b; }
            .loader { border: 4px solid #f3f3f3; border-top: 4px solid #6366f1; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .status { font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="loader"></div>
          <div id="status">Sincronizando ${filteredEntries.length} Participantes...</div>
          <script src="https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
          <script>
            (async function() {
              try {
                // Wait for ExcelJS if it's not immediately available
                let attempts = 0;
                while (!window.ExcelJS && attempts < 50) {
                  await new Promise(resolve => setTimeout(resolve, 100));
                  attempts++;
                }

                if (!window.ExcelJS) throw new Error("ExcelJS focus timeout");

                const workbook = new ExcelJS.Workbook();
              const entries = ${JSON.stringify(filteredEntries)};
              const RECS = ${JSON.stringify(RECOMMENDATIONS)};
              
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

              for (const entry of entries) {
                const safeName = entry.name.substring(0, 31).replace(/[\\\\\\/\\?\\*\\:\\[\\]]/g, '') || 'Participante';
                const worksheet = workbook.addWorksheet(safeName);
                
                worksheet.getColumn(1).width = 30;
                worksheet.getColumn(2).width = 90;
                worksheet.getColumn(3).width = 25;
                worksheet.getColumn(4).width = 25;
                worksheet.getColumn(5).width = 5;

                worksheet.getCell('A1').value = 'APELLIDOS Y NOMBRES';
                worksheet.getCell('A1').style = headerStyle;
                worksheet.getCell('A2').value = entry.name;
                worksheet.getCell('A2').font = { bold: true };
                worksheet.getCell('A2').border = cellStyle.border;

                worksheet.mergeCells('C1:D1');
                worksheet.getCell('C1').value = 'RESULTADOS';
                worksheet.getCell('C1').style = headerStyle;

                const resultColor = entry.result === 'APTO' ? 'FFD1FAE5' : (entry.result === 'RIESGO MEDIO' ? 'FFFEF3C7' : 'FFFEE2E2');
                const resultTextCol = entry.result === 'APTO' ? 'FF059669' : (entry.result === 'RIESGO MEDIO' ? 'FFD97706' : 'FFDC2626');

                const resultsData = [
                  ['INTERNO', entry.internalScore],
                  ['EXTERNO', entry.externalScore],
                  ['LOCUS DE CONTR', entry.result]
                ];

                resultsData.forEach((row, i) => {
                  const rNum = i + 2;
                  worksheet.getCell('C' + rNum).value = row[0];
                  worksheet.getCell('D' + rNum).value = row[1];
                  worksheet.getCell('C' + rNum).style = {...cellStyle, font: {bold: true}};
                  worksheet.getCell('D' + rNum).style = cellStyle;
                  if (row[0] === 'LOCUS DE CONTR') {
                    worksheet.getCell('D' + rNum).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: resultColor.replace('#', '') } };
                    worksheet.getCell('D' + rNum).font = { bold: true, color: { argb: resultTextCol.replace('#', '') } };
                  }
                });

                // DRAW CHART
                const canvas = document.createElement('canvas');
                canvas.width = 800;
                canvas.height = 160;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 800, 160);
                
                const barY = 70;
                const barH = 30;
                // Red segment
                ctx.fillStyle = '#fecaca'; // Red-200
                ctx.fillRect(50, barY, 700 * 0.543, barH);
                // Amber segment
                ctx.fillStyle = '#fef3c7'; // Amber-100
                ctx.fillRect(50 + 700 * 0.543, barY, 700 * 0.261, barH);
                // Green segment
                ctx.fillStyle = '#d1fae5'; // Emerald-100
                ctx.fillRect(50 + 700 * (0.543 + 0.261), barY, 700 * 0.196, barH);
                
                // Pointer
                const pX = 50 + (entry.internalScore / 23) * 700;
                const pColor = entry.result === 'APTO' ? '#10b981' : (entry.result === 'RIESGO MEDIO' ? '#d97706' : '#dc2626');
                ctx.fillStyle = pColor;
                ctx.fillRect(pX - 3, barY - 15, 6, barH + 30);
                
                // Text
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(entry.result + ' (' + entry.internalScore + ' pts)', pX, barY - 25);
                
                // Legend
                ctx.font = '12px Arial';
                ctx.fillStyle = '#64748b';
                ctx.textAlign = 'left';
                ctx.fillText('EXTERNO (RIESGO)', 50, barY + barH + 20);
                ctx.textAlign = 'right';
                ctx.fillText('INTERNO (APTO)', 750, barY + barH + 20);

                const chartImgId = workbook.addImage({
                  base64: canvas.toDataURL('image/png'),
                  extension: 'png',
                });
                
                worksheet.addImage(chartImgId, {
                  tl: { col: 5.2, row: 1 },
                  ext: { width: 600, height: 120 }
                });

                let rR = 5;
                worksheet.mergeCells('A' + rR + ':B' + rR);
                worksheet.getCell('A' + rR).value = 'DIAGNÓSTICO Y RECOMENDACIONES';
                worksheet.getCell('A' + rR).style = headerStyle;
                rR++;

                const getAnalysisText = (internal) => {
                  if (internal >= 19) return "Perfil con dominancia interna sólida (Apto). El evaluado asume responsabilidad directa sobre sus acciones y resultados, mostrando un alto compromiso con la seguridad operativa y el cumplimiento de normas.";
                  if (internal >= 13) return "Perfil con control de riesgo medio. Si bien asume responsabilidad, aún existe una tendencia parcial a atribuir eventos a factores externos. Se recomienda reforzamiento en cultura de seguridad.";
                  return "Perfil con dominancia externa (Riesgo Alto). Existe una marcada tendencia a atribuir los resultados a factores ajenos a su voluntad, lo que aumenta la probabilidad de conductas inseguras por falta de responsabilidad personal.";
                };

                worksheet.getCell('A' + rR).value = 'Situación:';
                worksheet.getCell('B' + rR).value = getAnalysisText(entry.internalScore);
                worksheet.getCell('A' + rR).font = { bold: true };
                worksheet.getCell('B' + rR).alignment = { wrapText: true, vertical: 'middle' };
                rR += 2;

                const pRecs = RECS[entry.result];
                worksheet.getCell('A' + rR).value = 'Acciones Correctivas:';
                worksheet.getCell('A' + rR).font = { bold: true };
                rR++;
                pRecs.rec.forEach(r => {
                  worksheet.getCell('A' + rR).value = '• ' + r;
                  worksheet.mergeCells('A' + rR + ':B' + rR);
                  worksheet.getCell('A' + rR).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
                  rR++;
                });
                rR++;

                worksheet.getCell('A' + rR).value = 'Plan de Seguimiento:';
                worksheet.getCell('B' + rR).value = pRecs.followUp;
                worksheet.getCell('A' + rR).font = { bold: true };
                worksheet.getCell('B' + rR).alignment = { wrapText: true, vertical: 'middle' };
                worksheet.getCell('B' + rR).font = { bold: true, color: { argb: resultTextCol.replace('#', '') } };
              }

              const buff = await workbook.xlsx.writeBuffer();
              saveAs(new Blob([buff]), "Base_Locus_Control_Global.xlsx");
              setTimeout(() => window.close(), 1500);
              } catch (err) {
                document.getElementById('status').innerHTML = "ERROR: " + err.message;
                console.error(err);
              }
            })();
          </script>
        </body>
      </html>
    `);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse uppercase tracking-widest text-xs">Sincronizando Datos Psicometricos...</p>
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
          <p className="text-muted-foreground max-w-sm">No pudimos obtener los datos de Locus de Control desde el repositorio.</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} /> Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col selection:bg-primary/20 overflow-x-hidden">
      <div className={cn(
        "flex-1 space-y-12 pb-24 px-4 md:px-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
        selectedEntry ? "pr-0 lg:pr-[450px] xl:pr-[500px]" : ""
      )}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                <Globe className="w-5 h-5" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground italic flex items-center gap-3">
                Locus <span className="text-primary not-italic">Control</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-2xl px-1">
              Análisis de la percepción de control sobre eventos críticos y seguridad operativa.
            </p>
          </div>

          <div className="flex items-center bg-muted/30 p-1 rounded-2xl border border-border/50 backdrop-blur-md">
            <Button 
              variant={view === 'dashboard' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('dashboard')}
              className={cn("rounded-xl gap-2 px-4 font-bold text-xs uppercase tracking-wider", view === 'dashboard' && "shadow-lg shadow-primary/20")}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
            <Button 
              variant={view === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('list')}
              className={cn("rounded-xl gap-2 px-4 font-bold text-xs uppercase tracking-wider", view === 'list' && "shadow-lg shadow-primary/20")}
            >
              <List className="w-4 h-4" /> Listado
            </Button>
            <div className="w-px h-6 bg-border/50 mx-2" />
            <Button variant="ghost" size="icon" onClick={() => handlePrintDashboard()} className="rounded-xl text-primary hover:bg-primary/10">
              <FileDown className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDownloadExcelDashboard()} className="rounded-xl text-emerald-600 hover:bg-emerald-500/10">
              <FileSpreadsheet className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => refetch()} className="rounded-xl">
              <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
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
                  <h2 className="text-xl font-black uppercase tracking-tighter italic">¿Qué es el Locus de Control?</h2>
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl font-medium">
                  Define cómo una persona interpreta las causas de los eventos que le suceden. En el <span className="font-bold text-white uppercase italic">contexto minero</span>, identificamos si los trabajadores asumen la responsabilidad de lo que ocurre en su trabajo o si tienden a atribuirlo a factores externos (suerte, entorno o terceros), influyendo directamente en la <span className="font-bold text-white uppercase italic">seguridad operativa</span>.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-indigo-300">Control Interno</p>
                  <p className="text-xs font-medium">Sus acciones influyen en los resultados. Asociado a proactividad y cumplimiento seguro.</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-indigo-300">Control Externo</p>
                  <p className="text-xs font-medium">Depende de factores fuera de su control. Relacionado con mayor riesgo y conductas inseguras.</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Objetivo</h3>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  "Identificar el nivel de responsabilidad de los operadores para clasificar riesgos, asignar tareas críticas y diseñar programas de capacitación focalizados que reduzcan ostensiblemente la tasa de accidentabilidad."
                </p>
              </div>
              <div className="space-y-2 mt-6">
                {['Clasificar por Riesgo', 'Decisiones de Asignación', 'Programas de Capacitación'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {view === 'dashboard' ? (
          <div className="space-y-10">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard 
                label="Total Evaluados" 
                value={data.totalEvaluated} 
                icon={Users} 
                color="text-blue-500" 
                bg="bg-blue-500/10" 
                border="border-blue-500/20" 
              />
              <KpiCard 
                label="Promedio Interno" 
                value={data.avgInternal.toFixed(1)} 
                icon={Brain} 
                color="text-indigo-500" 
                bg="bg-indigo-500/10" 
                border="border-indigo-500/20" 
              />
              <KpiCard 
                label="Promedio Externo" 
                value={data.avgExternal.toFixed(1)} 
                icon={Zap} 
                color="text-emerald-500" 
                bg="bg-emerald-500/10" 
                border="border-emerald-500/20" 
              />
              <KpiCard 
                label="Índice de Aptitud" 
                value={`${((data.riskDistribution.find(d => d.name === 'APTO')?.value || 0) / data.totalEvaluated * 100).toFixed(0)}%`} 
                icon={ShieldCheck} 
                color="text-amber-500" 
                bg="bg-amber-500/10" 
                border="border-amber-500/20" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chart: Risk Distribution */}
              <Card id="dashboard-pie-chart" className="lg:col-span-4 border-2 shadow-2xl rounded-[2.5rem] overflow-hidden group">
                <CardHeader className="bg-muted/5 border-b border-border/20 p-8">
                  <CardTitle className="text-xl font-black italic tracking-tighter">Distribución de Aptitud</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Segmentación por puntaje interno</CardDescription>
                </CardHeader>
                <CardContent className="p-8 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {data.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip cursor={{ fill: 'transparent' }} content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                           return (
                             <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-2xl">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].name}</p>
                               <p className="text-xl font-black">{payload[0].value} <span className="text-xs font-medium text-muted-foreground italic">casos</span></p>
                             </div>
                           );
                         }
                         return null;
                       }} />
                      <Legend verticalAlign="bottom" height={36} content={({ payload }) => (
                        <div className="flex justify-center gap-6 mt-4">
                          {payload?.map((entry: any, index: number) => {
                            const count = data.riskDistribution.find(d => d.name === entry.value)?.value || 0;
                            return (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">
                                  {entry.value}: <span className="text-primary italic">{count}</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Chart: Level Line Comparison */}
              <Card id="dashboard-comparison-chart" className="lg:col-span-8 border-2 shadow-2xl rounded-[2.5rem] overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
                <CardHeader className="bg-muted/5 border-b border-border/20 p-8">
                  <CardTitle className="text-xl font-black italic tracking-tighter">Comparativa Locus Interno vs Externo</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Balance promedio del grupo evaluado</CardDescription>
                </CardHeader>
                <CardContent className="p-8 lg:p-12 space-y-16">
                  
                  <div className="space-y-10 relative">
                    <div className="flex justify-between items-end mb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-indigo-500 uppercase tracking-tighter">Locus Interno</p>
                        <p className="text-4xl font-black tabular-nums italic text-indigo-600">{(data.avgInternal / 23 * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-black text-emerald-500 uppercase tracking-tighter">Locus Externo</p>
                        <p className="text-4xl font-black tabular-nums italic text-emerald-600">{(data.avgExternal / 23 * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="relative h-6 w-full bg-muted/20 rounded-full border border-border/50 overflow-hidden shadow-inner">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${(data.avgInternal / 23 * 100)}%` }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-10 bg-white shadow-xl z-10 border border-border/20 rounded-full" style={{ left: `${(data.avgInternal / 23 * 100)}%`, position: 'absolute', transform: 'translateX(-50%)' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 bg-indigo-50/10 rounded-3xl border border-indigo-200/20">
                        <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Significado
                        </h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">Proporción de individuos que atribuyen sus éxitos a su esfuerzo propio.</p>
                      </div>
                      <div className="p-6 bg-emerald-50/10 rounded-3xl border border-emerald-200/20">
                        <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Significado
                        </h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">Proporción de individuos que perciben que agentes externos determinan su seguridad.</p>
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
                    <h3 className="text-xl font-black text-white italic tracking-tighter">Regla de Negocio</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apto</span>
                        <span className="text-xs font-black text-emerald-500 tracking-tighter italic">19 - 23 pts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riesgo Medio</span>
                        <span className="text-xs font-black text-amber-500 tracking-tighter italic">13 - 18 pts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riesgo Alto</span>
                        <span className="text-xs font-black text-red-500 tracking-tighter italic">0 - 12 pts</span>
                      </div>
                    </div>
                </div>
              </Card>

              <Card className="md:col-span-2 border-2 border-dashed rounded-[2.5rem] p-8 bg-muted/5 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-foreground italic uppercase">Análisis Ejecutivo del Grupo</h4>
                    <p className="text-muted-foreground text-sm max-w-lg mt-1 italic">
                      "La gran mayoría de trabajadores no presenta un nivel óptimo de responsabilidad personal. El grupo de riesgo alto representa el mayor peligro, requiriendo intervención inmediata."
                    </p>
                    <div className="mt-4 p-4 bg-muted/40 rounded-2xl text-[10px] font-black uppercase text-indigo-600 tracking-widest animate-pulse">
                      Se utilizó la Escala I-E de Rotter (23 ítems)
                    </div>
                </div>
              </Card>
            </div>

            {/* Recommendations / Action Plan */}
            <div className="space-y-8">
               <h3 className="text-2xl font-black italic tracking-tighter uppercase px-2">Acciones según Resultados</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                     <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Para Personal Apto</p>
                     <ul className="space-y-3 text-xs font-medium text-slate-600 leading-tight italic decoration-emerald-500/50">
                        <li>• Líderes o mentores de seguridad</li>
                        <li>• Asignación a tareas críticas</li>
                        <li>• Seguimiento anual preventivo</li>
                     </ul>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-4">
                     <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Para Riesgo Medio</p>
                     <ul className="space-y-3 text-xs font-medium text-slate-600 leading-tight italic">
                        <li>• Capacitación intensiva en seguridad</li>
                        <li>• Seguimiento constante por supervisores</li>
                        <li>• Reevaluación técnica en 6 meses</li>
                     </ul>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 space-y-4">
                     <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">Para Riesgo Alto</p>
                     <ul className="space-y-3 text-xs font-medium text-slate-600 leading-tight italic">
                        <li>• Intervención psicológica obligatoria</li>
                        <li>• Restricción temporal de tareas críticas</li>
                        <li>• Seguimiento semanal y reevaluación en 3 meses</li>
                     </ul>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="Buscar por nombre o empresa..." 
                      className="pl-12 h-14 bg-card shadow-xl border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex bg-muted/30 p-1 rounded-2xl border border-border/50 backdrop-blur-md">
                    <Button 
                      variant={statusFilter === 'ALL' ? 'default' : 'ghost'} 
                      size="sm" 
                      onClick={() => setStatusFilter('ALL')}
                      className={cn("rounded-xl px-4 text-[10px] font-black uppercase tracking-widest", statusFilter === 'ALL' && "shadow-lg shadow-primary/20")}
                    >
                      Todos
                    </Button>
                    <Button 
                      variant={statusFilter === 'APTO' ? 'default' : 'ghost'} 
                      size="sm" 
                      onClick={() => setStatusFilter('APTO')}
                      className={cn("rounded-xl px-4 text-[10px] font-black uppercase tracking-widest", statusFilter === 'APTO' && "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20")}
                    >
                      Apto
                    </Button>
                    <Button 
                      variant={statusFilter === 'RIESGO MEDIO' ? 'default' : 'ghost'} 
                      size="sm" 
                      onClick={() => setStatusFilter('RIESGO MEDIO')}
                      className={cn("rounded-xl px-4 text-[10px] font-black uppercase tracking-widest", statusFilter === 'RIESGO MEDIO' && "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20")}
                    >
                      Medio
                    </Button>
                    <Button 
                      variant={statusFilter === 'RIESGO ALTO' ? 'default' : 'ghost'} 
                      size="sm" 
                      onClick={() => setStatusFilter('RIESGO ALTO')}
                      className={cn("rounded-xl px-4 text-[10px] font-black uppercase tracking-widest", statusFilter === 'RIESGO ALTO' && "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20")}
                    >
                      Alto
                    </Button>
                </div>
                
                <Button 
                  onClick={handleExportBulkExcel}
                  className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 gap-3 group transition-all active:scale-95 border-0"
                >
                  <FileSpreadsheet className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <div className="text-left leading-none">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-70 mb-0.5">Descargar Base</p>
                    <p className="text-sm font-black tracking-tighter uppercase italic">Excel Grupal</p>
                  </div>
                </Button>
              </div>
              <div className="flex items-center gap-3 bg-muted/30 px-6 py-3 rounded-2xl border border-border/50">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{filteredEntries.length} Casos Encontrados</span>
              </div>
            </div>

            <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="max-h-[750px] overflow-y-auto overflow-x-auto custom-scrollbar relative">
                <Table>
                  <TableHeader className="bg-slate-100/90 backdrop-blur-md sticky top-0 z-40">
                    <TableRow className="hover:bg-transparent border-b-2">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 px-8 sticky top-0 bg-slate-100/90 z-40 shadow-sm">ID</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Evaluado</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Puesto / Empresa</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Interno</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Externo</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Condición</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow 
                      key={entry.id} 
                      onClick={() => setSelectedEntry(entry)}
                      className={cn(
                        "group hover:bg-muted/30 transition-colors border-b-border/10 cursor-pointer",
                        selectedEntry?.id === entry.id ? "bg-primary/5" : ""
                      )}
                    >
                      <TableCell className="font-mono text-[10px] font-bold text-muted-foreground/40 px-8 py-5">#{entry.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-black italic uppercase text-xs tracking-tight group-hover:translate-x-1 transition-transform">{entry.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold uppercase">{entry.position}</p>
                          <p className="text-[9px] font-bold text-muted-foreground/60">{entry.company}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-black tabular-nums text-indigo-600">{entry.internalScore}</TableCell>
                      <TableCell className="font-black tabular-nums text-emerald-600">{entry.externalScore}</TableCell>
                      <TableCell>
                        <Badge className={cn("border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", 
                          entry.result === 'APTO' ? "bg-emerald-500/10 text-emerald-600" :
                          entry.result === 'RIESGO MEDIO' ? "bg-amber-500/10 text-amber-600" :
                          "bg-red-500/10 text-red-600"
                        )}>
                          {entry.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
          </div>
        )}
      </div>

      {/* Sliding Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-screen z-50 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
        selectedEntry 
          ? "w-full md:w-[450px] lg:w-[500px] xl:w-[550px] translate-x-0" 
          : "w-0 translate-x-full pointer-events-none"
      )}>
        {selectedEntry && (
          <LocusIndividualPanel 
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

export default LocusControlPage;
