import { 
  Settings,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Methodology {
  name: string;
  description: string;
  factors: string;
  type: string;
}

interface MethodologyCatalogProps {
  onSelect: (name: string) => void;
}

export const methodologies: Methodology[] = [
  { 
    name: "Meredith Belbin", 
    description: "Identificación de los 9 roles de equipo para optimizar el rendimiento colectivo.", 
    factors: "9 Roles", 
    type: "COMPETENCIAS" 
  },
  { 
    name: "Modelo Big Five (OCEAN)", 
    description: "Apertura, Responsabilidad, Extraversión, Amabilidad, Neuroticismo.", 
    factors: "5 Factores", 
    type: "PERSONALIDAD" 
  },
  { 
    name: "DISC", 
    description: "Análisis del comportamiento natural y adaptado en entornos laborales.", 
    factors: "4 Ejes", 
    type: "CONDUCTAL" 
  },
  { 
    name: "16PF (Cattell)", 
    description: "Medición de 16 factores primarios de la personalidad de Raymond Cattell.", 
    factors: "16 Factores", 
    type: "PSICOMÉTRICO" 
  },
];

const MethodologyCatalog = ({ onSelect }: MethodologyCatalogProps) => {
  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-2xl border-none ring-1 ring-white/10 overflow-hidden rounded-2xl md:rounded-[32px]">
      <CardHeader className="p-6 md:p-8 border-b border-border/20 bg-muted/10 flex flex-row items-center justify-between space-y-0 text-left">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <CardTitle className="text-xl md:text-2xl font-black tracking-tight">Registro</CardTitle>
            <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Bibliotecas estandarizadas</CardDescription>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Sincronizado</span>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="pl-6 md:pl-10 font-black text-[10px] md:text-[11px] uppercase tracking-widest py-4 md:py-6 text-primary">Metodología</TableHead>
                <TableHead className="font-black text-[10px] md:text-[11px] uppercase tracking-widest">Descripción Técnica</TableHead>
                <TableHead className="font-black text-[10px] md:text-[11px] uppercase tracking-widest">Dimensión</TableHead>
                <TableHead className="text-right pr-6 md:pr-10 font-black text-[10px] md:text-[11px] uppercase tracking-widest text-muted-foreground">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methodologies.map((m, idx) => (
                <TableRow 
                  key={idx} 
                  className="border-border/20 hover:bg-primary/[0.02] transition-all group cursor-pointer"
                  onClick={() => onSelect(m.name)}
                >
                  <TableCell className="pl-6 md:pl-10 py-6 md:py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 md:h-10 rounded-full bg-primary/20 group-hover:bg-primary transition-all" />
                      <span className="font-black text-lg md:text-xl tracking-tight group-hover:translate-x-1 transition-transform">{m.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-[300px] md:max-w-[500px]">
                      {m.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-[9px] md:text-[10px] font-black tracking-wider px-3 md:px-4 py-1 rounded-full border-none",
                      m.type === "COMPETENCIAS" ? "bg-indigo-500/10 text-indigo-600" :
                      m.type === "PERSONALIDAD" ? "bg-emerald-500/10 text-emerald-600" :
                      m.type === "CONDUCTAL" ? "bg-amber-500/10 text-amber-600" :
                      "bg-rose-500/10 text-rose-600"
                    )}>
                      {m.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 md:pr-10">
                    <Button variant="ghost" className="rounded-xl font-black gap-2 hover:bg-primary hover:text-white transition-all overflow-hidden relative">
                       <span className="hidden sm:inline">Iniciar</span> <ArrowRight className="w-4 h-4 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all sm:translate-x-0 sm:opacity-100" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologyCatalog;
