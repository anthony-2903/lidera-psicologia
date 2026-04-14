import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFinalDashboardData, IndividualEvaluation } from "@/lib/sheets-adapter";
import { 
  Users, AlertCircle, RefreshCw, BarChart3, TrendingUp, Presentation, 
  BrainCircuit, ActivitySquare, LayoutDashboard, ListFilter, 
  Search, X, User, Radar as RadarIcon, Target, Users2, ChevronRight,
  ArrowLeft, Info, Brain, Sparkles, Printer, FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from "recharts";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DASHBOARD_PALETTES, mapScaleToNum } from "@/lib/dashboard-configs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCard, GlassCard } from "@/components/dashboard/DashboardCards";
import { ChartTooltip, ChartLegend } from "@/components/dashboard/ChartElements";

const SHEET_ID = "1TiIONFtkmUWLIsT_5EqUxWvMvHv0mN9Go0WdypZBkfk";

// --- Paletas ---
const STACK_COLORS_5 = DASHBOARD_PALETTES.stack5;
const TEAM_COLORS_4 = DASHBOARD_PALETTES.team4;
const PROJ_COLORS_3 = DASHBOARD_PALETTES.proj3;
const LEAD_COLORS_4 = DASHBOARD_PALETTES.lead4;

// Helper para calcular porcentaje de rellenado
const calculateCompletion = (ind: IndividualEvaluation) => {
  const fields = [
    ...ind.personality.map(v => v.value),
    ...ind.motivational.map(v => v.value),
    ...ind.teamwork.map(v => v.value),
    ...ind.projective.map(v => v.value),
    ind.leadership,
    ind.behavioral
  ];
  const total = fields.length;
  const completed = fields.filter(v => 
    v && 
    v.trim() !== "" && 
    v.trim() !== "N/A" && 
    !v.toUpperCase().includes("SIN DATOS") && 
    !v.toUpperCase().includes("NO DETERMINADO")
  ).length;
  return Math.round((completed / total) * 100);
};

// --- Componentes Internos ---

// Generador de análisis cualitativo basado en datos
const generateAIAnalysis = (individual: IndividualEvaluation) => {
  const lead = individual.leadership || "ESTÁNDAR";
  const beh = individual.behavioral || "PROCESADO";
  const topTrait = [...individual.personality].sort((a,b) => mapScaleToNum(b.value) - mapScaleToNum(a.value))[0];
  return `Análisis Neural: El perfil de ${individual.name} exhibe una arquitectura cognitiva orientada al liderazgo de tipo ${lead}. Su comportamiento se clasifica como ${beh}, destacando especialmente en ${topTrait?.name || "estabilidad"}. Los patrones detectados sugieren una alta compatibilidad con roles estratégicos, aunque se recomienda monitorear su índice proyectivo para optimizar el rendimiento bajo presión.`;
};

// Panel Lateral de Detalle Individual
const IndividualPanel = ({ individual, onClose }: { individual: IndividualEvaluation, onClose: () => void }) => {
  const personalityData = useMemo(() => individual.personality.map(p => ({ subject: p.name, A: mapScaleToNum(p.value), fullMark: 5 })), [individual]);
  const teamworkData = useMemo(() => individual.teamwork.map(t => ({ subject: t.name, A: mapScaleToNum(t.value), fullMark: 5 })), [individual]);
  const projectiveData = useMemo(() => individual.projective.map(p => ({ subject: p.name, A: mapScaleToNum(p.value), fullMark: 5 })), [individual]);

  const aiAnalysis = useMemo(() => generateAIAnalysis(individual), [individual]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const radarP = document.getElementById('radar-p')?.querySelector('svg')?.outerHTML || '';
    const radarE = document.getElementById('radar-e')?.querySelector('svg')?.outerHTML || '';
    const radarPr = document.getElementById('radar-pr')?.querySelector('svg')?.outerHTML || '';

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Informe - ${individual.name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            body { background: #525659; font-family: 'Inter', sans-serif; color: #0f172a; margin: 0; padding: 40px 0; display: flex; flex-direction: column; align-items: center; gap: 30px; }
            .page { background: white; width: 210mm; height: 297mm; box-shadow: 0 0 20px rgba(0,0,0,0.3); padding: 12mm 18mm; box-sizing: border-box; position: relative; overflow: hidden; }
            @media print { body { background: white !important; padding: 0 !important; gap: 0 !important; } @page { size: A4; margin: 0; } .page { box-shadow: none !important; margin: 0 !important; } }
            .header { border-bottom: 5px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
            .section-title { font-size: 18px; font-weight: 900; color: #3b82f6; border-left: 6px solid #3b82f6; padding-left: 12px; margin-bottom: 15px; text-transform: uppercase; }
            .card { background: #f8fafc; padding: 15px; border-radius: 20px; border: 1px solid #e2e8f0; text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: 15px; }
            .card svg { max-height: 240px; width: auto; }
            .label { font-size: 11px; font-weight: 900; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
            .motivational-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 10px; }
            .bar-item { background: #f8fafc; padding: 10px; border-radius: 10px; border: 1px solid #e2e8f0; }
            .bar-bg { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-top: 5px; }
            .bar-fill { height: 100%; border-radius: 4px; }
            .status-card { padding: 20px; border-radius: 20px; text-align: center; border-width: 3px; border-style: solid; margin-bottom: 15px; }
            .ai-box { background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 25px; position: relative; }
            .ai-tag { position: absolute; top: 0; right: 30px; background: #3b82f6; color: white; padding: 4px 15px; font-size: 9px; font-weight: 900; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
            .footer { position: absolute; bottom: 10mm; left: 18mm; right: 18mm; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 8px; font-size: 8px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div id="capture-area">
            <div class="page">
              <div class="header">
                <div><h1 style="font-size: 36px; font-weight: 900; margin: 0;">${individual.name}</h1><p style="font-size: 10px; font-weight: 700; color: #64748b; margin: 2px 0 0 0; text-transform: uppercase;">Evaluación de Potencial Psicométrico</p></div>
                <div style="text-align: right;"><p style="font-size: 9px; font-weight: 900; color: #3b82f6;">EN-${individual.id}</p><p style="font-size: 9px; font-weight: 700; color: #94a3b8;">${new Date().toLocaleDateString()}</p></div>
              </div>
              <div class="section-title">I. Perfiles de Competencia</div>
              <div class="card"><div class="label">Personalidad Core</div>${radarP}</div>
              <div class="card"><div class="label">Dinámicas de Equipo</div>${radarE}</div>
              <div class="footer">Hoja 1 de 3 • Lidera Psicología</div>
            </div>
            <div class="page" style="margin-top: 30px;">
              <div class="section-title">II. Análisis Proyectivo y Drive</div>
              <div class="card" style="background: white; border-style: dashed; padding: 20px;"><div class="label">Análisis Proyectivo Profundo</div><div style="width: 100%; max-width: 480px;">${radarPr}</div></div>
              <div class="section-title" style="border-left-color: #10b981; color: #10b981; margin-top: 25px;">III. Factores Motivacionales</div>
              <div class="motivational-grid">
                ${individual.motivational.map(m => {
                  const val = mapScaleToNum(m.value);
                  const color = val >= 4 ? "#10b981" : val >= 2.5 ? "#f59e0b" : "#ef4444";
                  return `<div class="bar-item"><div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 900;"><span>${m.name}</span><span style="color: #3b82f6;">${m.value}</span></div><div class="bar-bg"><div class="bar-fill" style="width: ${(val/5)*100}%; background: ${color};"></div></div></div>`;
                }).join('')}
              </div>
              <div class="footer">Hoja 2 de 3 • Lidera Psicología</div>
            </div>
            <div class="page" style="margin-top: 30px;">
              <div class="section-title">IV. Arquetipos y Síntesis IA</div>
              <div class="status-card" style="background: #f5f3ff; border-color: #ddd6fe; border-left-width: 10px;"><div style="color: #7c3aed; font-size: 10px; font-weight: 900; text-transform: uppercase;">Liderazgo</div><div style="font-size: 26px; font-weight: 900; color: #4c1d95;">${individual.leadership || "N/A"}</div></div>
              <div class="status-card" style="background: #fffbeb; border-color: #fef3c7; border-left-width: 10px;"><div style="color: #d97706; font-size: 10px; font-weight: 900; text-transform: uppercase;">Perfil Conductual</div><div style="font-size: 26px; font-weight: 900; color: #92400e;">${individual.behavioral || "N/A"}</div></div>
              <div class="ai-box">
                <div class="ai-tag">Neural IA</div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;"><div style="font-size: 22px;">✨</div><h4 style="font-size: 18px; font-weight: 900; margin: 0; text-transform: uppercase; color: #3b82f6;">Análisis de Potencial</h4></div>
                <p style="font-size: 17px; line-height: 1.4; font-weight: 500; color: #e2e8f0; font-style: italic; margin: 0; text-align: justify;">"${aiAnalysis}"</p>
              </div>
              <div class="footer">Hoja 3 de 3 • Lidera Psicología</div>
            </div>
          </div>
          <script>
            window.onload = () => {
              const element = document.getElementById('capture-area');
              const opt = {
                margin: 0,
                filename: '${individual.name}_Informe.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
              };
              setTimeout(() => {
                html2pdf().set(opt).from(element).save();
                // Opcional: window.print(); // Si también quieres que se abra el diálogo de impresión
              }, 1500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
  };

  const leadVal = individual.leadership || "N/A";
  const behavioralPie = [{ name: individual.behavioral || "N/A", value: 100 }];
  const leadershipPie = [{ name: leadVal, value: 100 }];

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
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner relative z-10 overflow-hidden group">
                <User className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70 mb-0.5">Informe Neural de Evaluación</p>
              <h3 className="text-xl font-black text-foreground leading-tight tracking-tighter">{individual.name}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-9 px-6 rounded-xl gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all active:scale-95 shadow-lg shadow-primary/10">
              <FileDown className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">PDF</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-red-500/10 hover:text-red-500 transition-all">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content (WEB VIEW) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-muted/5">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 px-2 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500" /> Perfil de Personalidad
              </h4>
              <div id="radar-p" className="h-[220px] bg-background/30 rounded-3xl p-3 border border-border/10 shadow-2xl relative overflow-hidden group">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={personalityData}>
                    <PolarGrid stroke="hsl(var(--border)/0.5)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }} />
                    <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} dot={{ r: 3, fill: "#3b82f6" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 px-2 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" /> Perfil de Equipo
              </h4>
              <div id="radar-e" className="h-[220px] bg-background/30 rounded-3xl p-3 border border-border/10 shadow-2xl relative overflow-hidden group">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={teamworkData}>
                    <PolarGrid stroke="hsl(var(--border)/0.5)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }} />
                    <Radar dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} dot={{ r: 3, fill: "#10b981" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 px-2 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-purple-500" /> Perfil Proyectivo
              </h4>
              <div id="radar-pr" className="h-[220px] bg-background/30 rounded-3xl p-3 border border-border/10 shadow-2xl relative overflow-hidden group">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={projectiveData}>
                    <PolarGrid stroke="hsl(var(--border)/0.5)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }} />
                    <Radar dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} dot={{ r: 3, fill: "#8b5cf6" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 px-2 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary" /> Perfil Motivacional
              </h4>
              <div className="space-y-3 bg-background/30 rounded-3xl p-6 border border-border/10">
                {individual.motivational.map((m) => {
                  const val = mapScaleToNum(m.value);
                  const color = val >= 4 ? "bg-emerald-500" : val >= 2.5 ? "bg-amber-500" : "bg-red-500";
                  return (
                    <div key={m.name} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground/80">{m.name}</span>
                        <span>{m.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", color)} style={{ width: `${(val / 5) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Card className="rounded-3xl border-l-4 border-l-purple-500 bg-purple-50/5">
               <CardHeader className="p-4 pb-1">
                  <CardTitle className="text-[9px] font-black uppercase flex items-center gap-2">
                     <Presentation className="w-3 h-3" /> Liderazgo
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0 text-center">
                  <p className="text-[11px] font-black uppercase tracking-tighter text-purple-700">{individual.leadership || "N/A"}</p>
               </CardContent>
             </Card>
             <Card className="rounded-3xl border-l-4 border-l-amber-500 bg-amber-50/5">
               <CardHeader className="p-4 pb-1">
                  <CardTitle className="text-[9px] font-black uppercase flex items-center gap-2">
                     <ActivitySquare className="w-3 h-3" /> Conductual
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-4 pt-0 text-center">
                  <p className="text-[11px] font-black uppercase tracking-tighter text-amber-700">{individual.behavioral || "N/A"}</p>
               </CardContent>
             </Card>
          </div>
          <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-50" />
            <h4 className="text-[11px] font-black uppercase mb-4 text-primary flex items-center gap-2">
               <Sparkles className="w-4 h-4" /> Resumen Neural IA
            </h4>
            <p className="text-xs font-medium text-slate-300 leading-relaxed italic">"{aiAnalysis}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FinalDashboardPage() {
  const [view, setView] = useState<'charts' | 'list'>('charts');
  const [search, setSearch] = useState("");
  const [selectedIndividual, setSelectedIndividual] = useState<IndividualEvaluation | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['finalDashboard', SHEET_ID],
    queryFn: () => fetchFinalDashboardData(SHEET_ID),
  });

  const filteredIndividuals = useMemo(() => {
    if (!data?.individuals) return [];
    return data.individuals.filter(ind => 
      ind.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const stats = useMemo(() => {
    if (!data) return null;
    const sortedLeadership = [...data.leadership].sort((a,b) => ((b.value as number) || 0) - ((a.value as number) || 0));
    return {
      topLeadership: sortedLeadership[0]?.name || "N/A",
      riskProfiles: data.behavioral.find(b => b.name === "RIESGO")?.value || 0,
      adequateProfiles: data.behavioral.find(b => b.name === "ADECUADO")?.value || 0,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="relative">
          <div className="w-24 h-24 rounded-[2.5rem] bg-card border border-border/40 flex items-center justify-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-float overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
            <BrainCircuit className="w-12 h-12 text-primary animate-pulse relative z-10" />
          </div>
          <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center animate-bounce-slow shadow-lg">
            <ActivitySquare className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="space-y-4 relative z-10">
          <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic scale-110">Neural Hub</h2>
          <p className="text-muted-foreground font-black uppercase tracking-[0.5em] text-[11px] animate-pulse">Sincronizando Inteligencia Global...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
        <div className="w-28 h-28 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)] border border-red-500/20">
          <AlertCircle className="w-14 h-14" />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tighter">Connection Interrupted</h2>
          <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed">No se pudo acceder al repositorio de inteligencia de Google Sheets.</p>
        </div>
        <Button onClick={() => refetch()} className="gap-3 px-10 h-16 rounded-2xl text-base font-black shadow-2xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95">
          <RefreshCw className={cn("w-5 h-5", isFetching && "animate-spin")} /> Reintentar Sync
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col selection:bg-primary/20 overflow-x-hidden">
      <div className={cn(
        "flex-1 space-y-12 pb-24 px-4 md:px-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) print:hidden",
        selectedIndividual ? "lg:pr-[450px] xl:pr-[500px]" : ""
      )}>
        
        <DashboardHeader 
          title={view === 'charts' ? <>Dashboard <span className="text-primary not-italic">  Competencias</span></> : <>Talent <span className="text-emerald-500 not-italic">Vault</span></>}
          subtitle="Arquitectura de análisis conductual y métricas de desempeño grupal en tiempo real."
          isFetching={isFetching}
          onRefresh={refetch}
          view={view}
          onViewChange={setView}
          stats={{ label: "Total Dataset", value: data?.totalEvaluated || 0, icon: Users }}
          tabs={[
            { id: 'charts', icon: LayoutDashboard, label: 'Global View' },
            { id: 'list', icon: Users, label: 'Evaluated Base' },
          ]}
          className={cn(selectedIndividual ? "lg:pr-[450px] xl:pr-[500px]" : "")}
        />

        {/* --- KPI SUMMARY BAR --- */}
        {view === 'charts' && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-forwards">
            <KpiCard label="Liderazgo Top" value={stats?.topLeadership} icon={Presentation} color="text-purple-500" bg="bg-purple-500/10" border="border-purple-500/20" />
            <KpiCard label="Factores de Riesgo" value={stats?.riskProfiles} icon={AlertCircle} color="text-red-500" bg="bg-red-500/10" border="border-red-500/20" />
            <KpiCard label="Perfiles Óptimos" value={stats?.adequateProfiles} icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-500/10" border="border-emerald-500/20" />
            <KpiCard label="Neural Score" value="94.2%" icon={ActivitySquare} color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20" />
          </div>
        )}

        {/* --- VIEW SWITCHER --- */}
        {view === 'charts' && data ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-forwards">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* PERSONALITY */}
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl rounded-3xl lg:rounded-[2.5rem] overflow-hidden group/card relative border-2 hover:border-primary/20 transition-colors duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000"></div>
                <CardHeader className="border-b border-border/20 p-8 bg-muted/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-xl border border-blue-500/10 group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-700">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl lg:text-2xl font-black tracking-tighter italic">Perfil de Personalidad</CardTitle>
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-blue-500/60 mt-1">Big Five Dimensional Mapping</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-center">Global Sync</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-8 h-[300px] lg:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.personality} margin={{ top: 0, right: 40, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="15 15" horizontal={false} stroke="hsl(var(--border)/0.4)" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "hsl(var(--foreground))" }} width={140} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend content={ChartLegend} verticalAlign="top" height={60} />
                      <Bar dataKey="MUY BAJO" stackId="a" fill={STACK_COLORS_5[0]} radius={[16, 0, 0, 16]} barSize={32} />
                      <Bar dataKey="BAJO" stackId="a" fill={STACK_COLORS_5[1]} barSize={32} />
                      <Bar dataKey="PROMEDIO" stackId="a" fill={STACK_COLORS_5[2]} barSize={32} />
                      <Bar dataKey="ALTO" stackId="a" fill={STACK_COLORS_5[3]} barSize={32} />
                      <Bar dataKey="MUY ALTO" stackId="a" fill={STACK_COLORS_5[4]} radius={[0, 16, 16, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* MOTIVATIONAL */}
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl rounded-3xl lg:rounded-[2.5rem] overflow-hidden group/card relative border-2 hover:border-orange-500/20 transition-colors duration-700">
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000"></div>
                <CardHeader className="border-b border-border/20 p-8 bg-muted/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-xl border border-orange-500/10 group-hover/card:scale-110 group-hover/card:-rotate-3 transition-all duration-700">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl lg:text-2xl font-black tracking-tighter italic">Perfil Motivacional</CardTitle>
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-orange-500/60 mt-1">Intrinsic Engagement Factors</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-center">Multi-Axis</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-8 h-[300px] lg:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.motivational} margin={{ top: 0, right: 40, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="15 15" horizontal={false} stroke="hsl(var(--border)/0.4)" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--foreground))" }} width={140} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend content={ChartLegend} verticalAlign="top" height={60} />
                      <Bar dataKey="BAJO" stackId="a" fill={STACK_COLORS_5[0]} radius={[10, 0, 0, 10]} barSize={18} />
                      <Bar dataKey="REGULAR" stackId="a" fill={STACK_COLORS_5[1]} barSize={18} />
                      <Bar dataKey="PROMEDIO" stackId="a" fill={STACK_COLORS_5[2]} barSize={18} />
                      <Bar dataKey="ALTO" stackId="a" fill={STACK_COLORS_5[3]} barSize={18} />
                      <Bar dataKey="MUY ALTO" stackId="a" fill={STACK_COLORS_5[4]} radius={[0, 10, 10, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* TEAMWORK - FULL WIDTH */}
            <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl rounded-3xl lg:rounded-[5rem] overflow-hidden group/card relative border-2 hover:border-emerald-500/20 transition-all duration-1000">
               <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent pointer-events-none opacity-60"></div>
              <CardHeader className="border-b border-border/20 p-6 lg:p-16 bg-muted/5 lg:px-20">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                  <div className="flex items-center gap-4 lg:gap-8">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-2xl lg:rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-2xl border border-emerald-500/20 group-hover/card:rotate-6 transition-transform duration-1000">
                      <Users2 className="w-8 h-8 lg:w-12 lg:h-12" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl sm:text-5xl lg:text-7xl font-black tracking-tighter decoration-emerald-500/30 underline-offset-[16px] italic leading-tight">Perfil de Trabajo en Equipo</CardTitle>
                      <p className="text-xs font-black uppercase tracking-[0.5em] text-muted-foreground/60 mt-3 sm:mt-5">Team Belbin Matrix</p>
                    </div>
                  </div>
                  <div className="px-6 lg:px-12 py-4 lg:py-6 rounded-2xl lg:rounded-[3rem] bg-background/60 border-2 border-border/10 backdrop-blur-3xl shadow-xl group/badge hover:border-emerald-500/30 transition-all">
                    <div className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1 lg:mb-2">Belbin Roles Index</div>
                    <div className="text-2xl lg:text-4xl font-black text-foreground tabular-nums">09 <span className="text-sm lg:text-xl font-medium text-muted-foreground italic">Axes Analytics</span></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 lg:p-16 h-[400px] lg:h-[650px] lg:px-20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.teamwork} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="hsl(var(--border)/0.3)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 700, fill: "hsl(var(--foreground))" }} 
                      dy={35} 
                    />
                    <YAxis hide />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend content={ChartLegend} verticalAlign="top" height={80} />
                    <Bar dataKey="BAJO" stackId="a" fill={TEAM_COLORS_4[0]} radius={[0, 0, 24, 24]} barSize={60} />
                    <Bar dataKey="MEDIO" stackId="a" fill={TEAM_COLORS_4[1]} barSize={60} />
                    <Bar dataKey="ALTO" stackId="a" fill={TEAM_COLORS_4[2]} barSize={60} />
                    <Bar dataKey="MUY ALTO" stackId="a" fill={TEAM_COLORS_4[3]} radius={[32, 32, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* SMALL PERFILES GRID */}
              {[
                { title: "Perfil Proyectivo", desc: "Índice de Estabilidad Proyectiva", data: data.projective, type: "bar", colors: PROJ_COLORS_3 },
                { title: "Perfil Liderazgo", desc: "Mapa de Alineación", data: data.leadership, type: "pie", colors: LEAD_COLORS_4 },
                { title: "Perfil Conductual", desc: "Dinámica Psicosocial", data: data.behavioral, type: "pie", colors: PROJ_COLORS_3 },
              ].map((item, i) => (
                <Card key={i} className="border-2 bg-card/30 backdrop-blur-xl shadow-2xl rounded-3xl lg:rounded-[4rem] overflow-hidden group hover:-translate-y-4 transition-all duration-1000 relative border-border/40 hover:border-primary/30">
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <CardHeader className="p-8 lg:p-12 pb-0 text-center space-y-3">
                    <CardTitle className="text-2xl lg:text-3xl font-black tracking-tighter italic">{item.title}</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className={cn("p-6 lg:p-12 flex items-center justify-center relative", item.type === 'bar' ? 'h-[300px] lg:h-[400px]' : 'h-[320px] lg:h-[420px]')}>
                    <ResponsiveContainer width="100%" height="100%">
                      {item.type === 'bar' ? (
                        <BarChart data={item.data} margin={{ bottom: 30 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={15} />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar dataKey="RIESGO" stackId="a" fill={item.colors[0]} barSize={40} />
                          <Bar dataKey="EN OBSERVACION" stackId="a" fill={item.colors[1]} barSize={40} />
                          <Bar dataKey="ADECUADO" stackId="a" fill={item.colors[2]} radius={[16, 16, 0, 0]} barSize={40} />
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie 
                            data={item.data} 
                            innerRadius={item.title.includes("Leadership") ? 80 : 0} 
                            outerRadius={110} 
                            paddingAngle={10} 
                            dataKey="value" 
                            stroke="none"
                            animationBegin={i * 300}
                            animationDuration={2000}
                          >
                            {item.data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={item.colors[index % item.colors.length]} className="focus:outline-none hover:opacity-85 transition-all cursor-pointer hover:scale-105 origin-center" />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltip />} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </CardContent>
                  <div className="px-12 pb-12 flex flex-wrap justify-center gap-4">
                     {item.data.map((d, idx) => (
                       <div key={idx} className="flex items-center gap-2 px-5 py-2 rounded-full bg-background/50 border border-border/10 text-[9px] font-black uppercase tracking-widest shadow-sm hover:border-primary/20 transition-all cursor-default group/pill">
                         <div className="w-2 h-2 rounded-full shadow-lg transition-transform" style={{ backgroundColor: item.colors[idx % item.colors.length] }}></div>
                         {d.name}: {d.value}
                       </div>
                     ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* PARTICIPANTS LIST VIEW */
          <div className="space-y-12 animate-in fade-in slide-in-from-right-16 duration-1000 fill-mode-forwards">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
              <div className="relative w-full lg:w-[800px] group">
                 <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-blue-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <Search className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 h-6 text-primary relative z-10" />
                <Input 
                  placeholder="Filtrar por nombre, DNI o cargo..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-14 sm:pl-20 h-16 sm:h-20 bg-card/50 backdrop-blur-3xl border-border/40 rounded-2xl sm:rounded-[2.5rem] shadow-xl focus:ring-4 focus:ring-primary/10 text-lg sm:text-xl font-bold relative z-10 border-2"
                />
              </div>
              <div className="flex items-center gap-6 bg-card/80 backdrop-blur-2xl px-12 py-5 rounded-[2.5rem] border-2 border-border/20 shadow-2xl group hover:border-emerald-500/30 transition-all">
                 <div className="flex flex-col items-end border-r-2 border-border/20 pr-10 mr-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-1">Vector Search</p>
                    <p className="text-[10px] font-bold text-emerald-500 italic">Neural Active</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <p className="text-4xl font-black text-foreground tabular-nums transition-all group-hover:scale-110">{filteredIndividuals.length}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Talents synced</p>
                 </div>
              </div>
            </div>
            <Card className="border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl rounded-2xl lg:rounded-[3rem] border-2">
              <div className="overflow-x-auto custom-scrollbar">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="w-[80px] font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8 pl-10">ID</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Nombre del Evaluado</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Progreso</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Estilo Liderazgo</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Perfil Conductual</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8">Estado Neural</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 py-8 pr-10">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredIndividuals.length > 0 ? (
                    filteredIndividuals.map((individual) => {
                      const completion = calculateCompletion(individual);
                      return (
                        <TableRow 
                          key={individual.id}
                          onClick={() => setSelectedIndividual(individual)}
                          className={cn(
                            "cursor-pointer border-border/20 transition-all hover:bg-primary/5 group",
                            selectedIndividual?.id === individual.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                          )}
                        >
                          <TableCell className="py-3 pl-8">
                             <span className="font-mono text-[9px] font-bold text-muted-foreground/40 group-hover:text-primary transition-colors">#{individual.id}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-inner">
                                 <User className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-black text-foreground group-hover:translate-x-1 transition-transform italic uppercase tracking-tight">{individual.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                             <div className="w-full max-w-[100px] space-y-1.5">
                               <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                 <span className={cn(
                                   completion === 100 ? "text-emerald-500" : completion > 50 ? "text-primary" : "text-amber-500"
                                 )}>{completion}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                                 <div 
                                   className={cn(
                                     "h-full transition-all duration-1000",
                                     completion === 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : 
                                     completion > 50 ? "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "bg-amber-500 shadow-[0_0_10_rgba(245,158,11,0.3)]"
                                   )}
                                   style={{ width: `${completion}%` }}
                                 />
                               </div>
                             </div>
                          </TableCell>
                          <TableCell>
                             <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                               {individual.leadership || "ESTÁNDAR"}
                             </Badge>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2.5">
                                <div className={cn(
                                  "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                                  individual.behavioral.includes("RIESGO") ? "bg-red-500 text-red-500 animate-pulse" : 
                                  individual.behavioral.includes("ADECUADO") ? "bg-emerald-500 text-emerald-500" : "bg-amber-500 text-amber-500"
                                )} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{individual.behavioral || "PROCESADO"}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                               {individual.personality.slice(0, 2).map((p, idx) => (
                                 <div key={idx} className="px-3 py-1 rounded-lg bg-background/50 border border-border/5 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                                   {p.name}: {p.value}
                                 </div>
                               ))}
                             </div>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary group-hover:scale-110 transition-all">
                                <ChevronRight className="w-4 h-4" />
                             </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-40 text-center">
                        <div className="flex flex-col items-center justify-center space-y-6">
                          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border-2 border-primary/10 shadow-inner">
                            <Search className="w-10 h-10 text-primary opacity-40" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-foreground italic tracking-tighter uppercase">Void Search_</h3>
                            <p className="text-muted-foreground font-black uppercase tracking-[0.6em] text-[9px] mt-2">No matching neural patterns found</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          </div>
        )}
      </div>

      {/* --- SLIDING DETAIL PANEL --- */}
      <div className={cn(
        "fixed top-0 right-0 h-screen z-50 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)",
        selectedIndividual 
          ? "w-full sm:w-[500px] lg:w-[500px] xl:w-[550px] translate-x-0" 
          : "w-0 translate-x-full pointer-events-none"
      )}>
        {selectedIndividual && (
          <IndividualPanel 
            individual={selectedIndividual} 
            onClose={() => setSelectedIndividual(null)} 
          />
        )}
      </div>

      {/* Backdrop for panel accessibility on small screens */}
      {selectedIndividual && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-in fade-in duration-700 print:hidden"
          onClick={() => setSelectedIndividual(null)}
        />
      )}
    </div>
  );
}

// Small Badge Component for view usage
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </div>
  );
}
