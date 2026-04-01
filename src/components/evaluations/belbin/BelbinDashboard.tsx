import { useState } from "react";
import { 
  ChevronLeft,
  Info,
  ScrollText,
  ClipboardList,
  BarChart3,
  BookOpen
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BelbinQuestionnaire from "./BelbinQuestionnaire";
import BelbinResults from "./BelbinResults";
import BelbinInterpretation from "./BelbinInterpretation";

interface BelbinDashboardProps {
  onBack: () => void;
}

const BelbinDashboard = ({ onBack }: BelbinDashboardProps) => {
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleScoreChange = (stageId: number, optionId: string, value: string) => {
    const numValue = Math.min(10, Math.max(0, parseInt(value) || 0));
    setScores(prev => ({
      ...prev,
      [`${stageId}-${optionId}`]: numValue
    }));
  };

  const handleFinish = () => {
    alert("Cuestionario completado. Ahora puede ver los resultados.");
  };

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-8 gap-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="h-12 w-12 rounded-2xl bg-background border border-border/40 hover:bg-muted shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] px-4 shrink-0">Evaluación Belbin</Badge>
              <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic shrink-0">Dashboard de Roles</h1>
            </div>
            <p className="text-muted-foreground font-bold mt-1 text-left">Análisis integral de competencias para equipos de alto rendimiento.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20 self-start md:self-center">
          <Info className="w-5 h-5 text-primary shrink-0" />
          <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.1em]">
            Valide cada etapa con <span className="underline decoration-2 text-primary">10 PUNTOS</span> para ver resultados
          </p>
        </div>
      </div>

      <Tabs defaultValue="respuestas" className="mt-8">
        <TabsList className="bg-background/40 p-1.5 rounded-[20px] h-16 border border-border/40 gap-2 mb-10 overflow-x-auto justify-start">
          <TabsTrigger 
            value="respuestas" 
            className="rounded-[14px] px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white shadow-none transition-all gap-3"
          >
            <ClipboardList className="w-4 h-4" />
            Respuestas
          </TabsTrigger>
          <TabsTrigger 
            value="resultados" 
            className="rounded-[14px] px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white shadow-none transition-all gap-3"
          >
            <BarChart3 className="w-4 h-4" />
            Resultados
          </TabsTrigger>
          <TabsTrigger 
            value="interpretacion" 
            className="rounded-[14px] px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white shadow-none transition-all gap-3"
          >
            <BookOpen className="w-4 h-4" />
            Interpretación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="respuestas">
          <BelbinQuestionnaire 
            scores={scores} 
            onScoreChange={handleScoreChange} 
            onFinish={handleFinish} 
          />
        </TabsContent>

        <TabsContent value="resultados">
          <BelbinResults scores={scores} />
        </TabsContent>

        <TabsContent value="interpretacion">
          <BelbinInterpretation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BelbinDashboard;
