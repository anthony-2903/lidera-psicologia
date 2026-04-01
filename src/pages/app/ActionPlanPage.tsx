import { useState } from "react";
import { 
  UsersRound, 
  User, 
  ClipboardList, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Search,
  Clock,
  BrainCircuit,
  Activity,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { groups, teamMembers } from "@/data/mockData";

type Step = 'group' | 'member' | 'config' | 'timeline';

const ActionPlanPage = () => {
  const [step, setStep] = useState<Step>('group');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [planConfig, setPlanConfig] = useState({
    type: 'conductual',
    sessions: 4,
    objectives: '',
    riskLevel: 'medio'
  });

  const currentGroup = groups.find(g => g.id === selectedGroup);
  const currentMember = teamMembers.find(m => m.id === selectedMember);

  const handleNext = () => {
    if (step === 'group') setStep('member');
    else if (step === 'member') setStep('config');
    else if (step === 'config') setStep('timeline');
  };

  const handleBack = () => {
    if (step === 'member') setStep('group');
    else if (step === 'config') setStep('member');
    else if (step === 'timeline') setStep('config');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Stepper Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
            Plan de Acción <Badge variant="outline" className="border-primary/20 text-primary uppercase font-black text-[10px] tracking-widest">Psicología</Badge>
          </h1>
          <p className="text-muted-foreground font-medium">Diseño de intervenciones conductuales personalizadas</p>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-muted/30 p-1.5 rounded-full border border-border/40">
          {(['group', 'member', 'config', 'timeline'] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                  step === s ? "bg-primary text-primary-foreground shadow-lg scale-110" : "text-muted-foreground/40"
                )}
              >
                {idx + 1}
              </div>
              {idx < 3 && <div className="w-10 h-0.5 bg-muted/60 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Area */}
      <div className="min-h-[500px]">
        {/* STEP 1: GROUP SELECTION */}
        {step === 'group' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <UsersRound className="text-primary" /> 1. Seleccione el Grupo de Trabajo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groups.map((g) => (
                <Card 
                   key={g.id}
                   className={cn(
                    "cursor-pointer transition-all border-2 group hover:shadow-2xl",
                    selectedGroup === g.id ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-xl" : "border-border/40 hover:border-primary/40 bg-card/40 backdrop-blur-md"
                  )}
                  onClick={() => {
                    setSelectedGroup(g.id);
                    handleNext();
                  }}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className={cn("w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-transform group-hover:scale-110", g.color)}>
                      <g.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black">{g.name}</CardTitle>
                      <p className="text-sm font-bold text-muted-foreground/60">{g.count} Integrantes</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: MEMBER SELECTION */}
        {step === 'member' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <User className="text-primary" /> 2. Seleccione al Evaluado de {currentGroup?.name}
              </h2>
              <Button variant="ghost" className="font-bold text-xs uppercase" onClick={handleBack}>
                <ChevronLeft className="mr-1 w-4 h-4" /> Cambiar Grupo
              </Button>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por nombre o cargo..." className="pl-10 h-12 bg-card/40 border-border/40 font-bold" />
              </div>
              
              <div className="grid gap-3">
                {teamMembers.map((m) => (
                  <Card 
                    key={m.id}
                    className={cn(
                      "cursor-pointer transition-all border-border/40 hover:border-primary/40 group",
                      selectedMember === m.id ? "border-primary bg-primary/5 shadow-md" : "bg-card/40"
                    )}
                    onClick={() => {
                      setSelectedMember(m.id);
                      handleNext();
                    }}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                          <AvatarImage src={m.avatar} />
                          <AvatarFallback>{m.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-foreground">{m.name}</p>
                          <p className="text-xs font-bold text-muted-foreground/60">{m.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-1">Riesgo Detectado</p>
                          <Badge variant="outline" className={cn(
                            "font-black text-[10px]",
                            m.risk === 'Alto' ? "text-red-600 border-red-500/20 bg-red-500/5" : 
                            m.risk === 'Medio' ? "text-amber-600 border-amber-500/20 bg-amber-500/5" : 
                            "text-emerald-600 border-emerald-500/20 bg-emerald-500/5"
                          )}>
                            {m.risk}
                          </Badge>
                        </div>
                        <ChevronRight className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PLAN CONFIGURATION */}
        {step === 'config' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <ClipboardList className="text-primary" /> 3. Configuración de Intervención
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-black tracking-tight">Detalles del Plan</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-wider">Asignado a: {currentMember?.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tipo de Intervención</Label>
                      <Select defaultValue="conductual">
                        <SelectTrigger className="font-bold bg-background/40">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent className="font-bold text-foreground">
                          <SelectItem value="conductual">Modificación Conductual</SelectItem>
                          <SelectItem value="psicologica">Apoyo Psicológico Clínico</SelectItem>
                          <SelectItem value="tecnica">Refuerzo Técnico/Seguridad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Número de Sesiones</Label>
                      <div className="flex items-center gap-4">
                        <Input 
                          type="number" 
                          value={planConfig.sessions} 
                          onChange={(e) => setPlanConfig({...planConfig, sessions: parseInt(e.target.value)})}
                          className="font-black bg-background/40 w-24"
                        />
                        <span className="text-sm font-bold text-muted-foreground">Sesiones Planificadas</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Objetivos de la Intervención</Label>
                    <Textarea 
                      placeholder="Ej. Reducir incidentes de exceso de velocidad en Scoop, mejorar comunicación en radio..."
                      className="min-h-[120px] font-bold bg-background/40 text-foreground"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border/40 bg-muted/10 p-6 rounded-b-xl">
                  <Button variant="ghost" className="font-black text-xs uppercase" onClick={handleBack}>Atrás</Button>
                  <Button className="font-black px-8 rounded-xl shadow-lg shadow-primary/20" onClick={handleNext}>Generar Plan Maestro</Button>
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-700">Etapas del Psicólogo</h4>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </div>
                        <p className="text-xs font-bold text-emerald-800"><span className="block font-black">E1: Evaluación</span>Rapport, anamnesis y diagnóstico inicial.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </div>
                        <p className="text-xs font-bold text-emerald-800"><span className="block font-black">E2: Intervención</span>Aplicación de técnicas de cambio conductual.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </div>
                        <p className="text-xs font-bold text-emerald-800"><span className="block font-black">E3: Cierre</span>Evaluación de resultados y plan de prevención.</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TIMELINE VISUALIZER */}
        {step === 'timeline' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                  <Calendar className="text-primary" /> Plan Maestro de Intervención
                </h2>
                <p className="text-muted-foreground font-bold text-sm">Cronograma proyectado para {currentMember?.name}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="font-bold text-xs uppercase" onClick={handleBack}>Editar</Button>
                <Button className="font-black text-xs uppercase bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20">Finalizar y Notificar</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(planConfig.sessions)].map((_, i) => (
                <Card key={i} className="border-border/40 bg-card/60 relative overflow-hidden group hover:border-primary/40 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-muted/30 rotate-45 translate-x-8 -translate-y-8" />
                  <CardContent className="p-6 space-y-4">
                    <Badge className="font-black text-[10px] tracking-widest bg-emerald-500/10 text-emerald-600 border-none">SESIÓN {i + 1}</Badge>
                    <div>
                      <p className="text-sm font-black">
                        {i === 0 ? "Evaluación Diagnóstica" : i === planConfig.sessions - 1 ? "Cierre y Evaluación" : "Módulo de Intervención"}
                      </p>
                      <p className="text-xs font-bold text-muted-foreground/60 mt-1">
                        {i === 0 ? "Diagnosticar brechas de seguridad" : i === planConfig.sessions - 1 ? "Verificar cambios de actitud" : "Ejercicios de respuesta segura"}
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-muted-foreground/40 font-black text-[9px] uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> Pendiente de ejecución
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/40 bg-indigo-600 text-white shadow-2xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit className="w-40 h-40" />
              </div>
              <div className="max-w-2xl space-y-4 relative">
                <h3 className="text-2xl font-black tracking-tight">Nota del Especialista</h3>
                <p className="text-indigo-100 font-bold italic text-lg leading-relaxed">
                  "Este plan ha sido generado bajo el modelo de psicología de seguridad basada en el comportamiento (SBC). 
                  Se enfoca en el fortalecimiento del liderazgo visible y la autogestión del riesgo en {currentGroup?.name}."
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-900" />
                  </div>
                  <div>
                    <p className="text-sm font-black">Psic. Admin LeadPath</p>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Especialista en Psicología Minera</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionPlanPage;
