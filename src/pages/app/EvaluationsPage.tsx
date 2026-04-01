import { useState } from "react";
import { 
  CheckCircle2,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MethodologyCatalog from "@/components/evaluations/MethodologyCatalog";
import BelbinDashboard from "@/components/evaluations/belbin/BelbinDashboard";

const EvaluationsPage = () => {
  const [view, setView] = useState<'catalog' | 'belbin'>('catalog');

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {view === 'catalog' ? (
        <>
          <div className="flex justify-between items-end border-b border-border/40 pb-8">
            <div className="text-left">
              <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
                Metodologías de Evaluación <Badge className="bg-primary/10 text-primary border-none text-[12px] px-3">Catálogo</Badge>
              </h1>
              <p className="text-muted-foreground text-lg font-medium mt-1">Instrumentos y marcos psicológicos disponibles para aplicación.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <MethodologyCatalog onSelect={(name) => name === "Meredith Belbin" && setView('belbin')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none ring-1 ring-white/10 bg-indigo-600 text-white shadow-2xl rounded-[32px] overflow-hidden relative group p-8 flex items-center justify-between text-left">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="flex gap-6 items-center relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black tracking-tighter">Validación Científica</h4>
                    <p className="text-xs font-bold text-indigo-100/70 uppercase tracking-widest">Modelos psicométricos estandarizados</p>
                  </div>
                </div>
              </Card>

              <Card className="border-none ring-1 ring-white/10 bg-card/40 backdrop-blur-md shadow-2xl rounded-[32px] overflow-hidden p-8 flex items-center justify-between border-dashed border-2 border-border/40 text-left">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center shrink-0">
                    <Info className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black tracking-tighter text-muted-foreground/40 italic">Nueva Metodología</h4>
                    <p className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.2em]">Contacte al administrador para expandir</p>
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
