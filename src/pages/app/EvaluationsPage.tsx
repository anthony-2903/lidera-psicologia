import { useState } from "react";
import { 
  CheckCircle2,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MethodologyCatalog from "@/components/evaluations/MethodologyCatalog";
import BelbinDashboard from "@/components/evaluations/belbin/BelbinDashboard";

const EvaluationsPage = () => {
  const [view, setView] = useState<'catalog' | 'belbin'>('catalog');

  return (
    <div className="w-full space-y-6 md:space-y-10 pb-20 animate-in fade-in duration-700">
      {view === 'catalog' ? (
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-6 md:pb-8 gap-4">
            <div className="text-left">
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-foreground flex flex-wrap items-center gap-2 md:gap-3">
                Metodologías de Evaluación <Badge className="bg-primary/10 text-primary border-none text-[10px] md:text-[12px] px-3">Catálogo</Badge>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg font-medium mt-1">Instrumentos y marcos psicológicos disponibles.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="w-full overflow-hidden">
               <MethodologyCatalog onSelect={(name) => name === "Meredith Belbin" && setView('belbin')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <Card className="border-none ring-1 ring-white/10 bg-indigo-600 text-white shadow-2xl rounded-2xl md:rounded-[32px] overflow-hidden relative group p-6 md:p-8 flex items-center justify-between text-left">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="flex gap-4 md:gap-6 items-center relative z-10">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md shrink-0">
                    <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl md:text-2xl font-black tracking-tighter">Validación Científica</h4>
                    <p className="text-[10px] md:text-xs font-bold text-indigo-100/70 uppercase tracking-widest leading-tight">Modelos psicométricos estandarizados</p>
                  </div>
                </div>
              </Card>

              <Card className="border-none ring-1 ring-white/10 bg-card/40 backdrop-blur-md shadow-2xl rounded-2xl md:rounded-[32px] overflow-hidden p-6 md:p-8 flex items-center justify-between border-dashed border-2 border-border/40 text-left">
                <div className="flex gap-4 md:gap-6 items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl md:text-2xl font-black tracking-tighter text-muted-foreground/40 italic">Nueva Metodología</h4>
                    <p className="text-[9px] md:text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] leading-tight">Contacte al administrador</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <BelbinDashboard onBack={() => setView('catalog')} />
      )}
    </div>
  );
};

export default EvaluationsPage;
