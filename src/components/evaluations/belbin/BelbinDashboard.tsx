import { useState } from "react";
import { 
  ChevronLeft,
  Info,
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
    <div className="animate-in slide-in-from-right duration-500 w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-border/40 pb-6 md:pb-8 gap-4 md:gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-background border border-border/40 hover:bg-muted shrink-0"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          <div className="text-left">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Badge className="bg-primary text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-3 md:px-4 shrink-0">Belbin</Badge>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-foreground uppercase italic shrink-0">Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-xs md:text-sm font-bold mt-1 max-w-[250px] md:max-w-none">Análisis de competencias para equipos.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 md:p-4 bg-primary/5 rounded-xl md:rounded-2xl border border-primary/20 self-start lg:self-center">
          <Info className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
          <p className="text-[9px] md:text-[10px] font-black text-primary/80 uppercase tracking-[0.1em] leading-tight">
            Valide cada etapa con <span className="underline decoration-2 text-primary">10 PUNTOS</span>
          </p>
        </div>
      </div>

      <Tabs defaultValue="respuestas" className="mt-6 md:mt-8">
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="bg-background/40 p-1 rounded-xl md:rounded-[20px] h-12 md:h-16 border border-border/40 gap-1 md:gap-2 mb-6 md:mb-10 w-max md:w-auto">
            <TabsTrigger 
              value="respuestas" 
              className="rounded-lg md:rounded-[14px] px-4 md:px-8 font-black uppercase text-[9px] md:text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white shadow-none transition-all gap-2 md:gap-3"
            >
              <ClipboardList className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Respuestas
            </TabsTrigger>
            <TabsTrigger 
              value="resultados" 
              className="rounded-lg md:rounded-[14px] px-4 md:px-8 font-black uppercase text-[9px] md:text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white shadow-none transition-all gap-2 md:gap-3"
            >
              <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Resultados
            </TabsTrigger>
            <TabsTrigger 
              value="interpretacion" 
              className="rounded-lg md:rounded-[14px] px-4 md:px-8 font-black uppercase text-[9px] md:text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white shadow-none transition-all gap-2 md:gap-3"
            >
              <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Interpretación
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="respuestas">
          <BelbinQuestionnaire 
            scores={scores} 
            onScoreChange={handleScoreChange} 
            onFinish={handleFinish} 
          />
        </TabsContent>

        <TabsContent value="resultados">
          <div className="w-full min-h-[400px]">
             <BelbinResults scores={scores} />
          </div>
        </TabsContent>

        <TabsContent value="interpretacion">
          <BelbinInterpretation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BelbinDashboard;
