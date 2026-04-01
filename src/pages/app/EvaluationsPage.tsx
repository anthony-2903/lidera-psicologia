import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  ChevronRight, 
  LayoutGrid, 
  ClipboardCheck, 
  Settings,
  MoreVertical,
  CheckCircle2,
  ListTodo
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const EvaluationsPage = () => {
  const [items, setItems] = useState<string[]>(["Liderazgo", "Seguridad", "Comunicación"]);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const createdEvaluations = [
    { id: "EV-001", name: "Evaluación de Riesgo 2024", type: "PRE", items: 8, status: "Activo" },
    { id: "EV-002", name: "Cierre de Gestión Mina", type: "POST", items: 12, status: "Borrador" },
    { id: "EV-003", name: "Control Trimestral SBC", type: "PRE", items: 6, status: "Activo" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
            Gestión de Evaluación <Badge className="bg-primary/10 text-primary border-none">Config</Badge>
          </h1>
          <p className="text-muted-foreground text-lg font-medium mt-1">Definición de plantillas e ítems de evaluación psicológica</p>
        </div>
        <Button className="rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 h-12 px-6 bg-primary hover:bg-primary/95 transition-all">
          <Plus className="w-5 h-5" />
          Nueva Plantilla
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none ring-1 ring-white/10 bg-card/60 backdrop-blur-md shadow-2xl rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black tracking-tight">Registro de Evaluación</CardTitle>
              <CardDescription className="font-bold text-muted-foreground">Configure los parámetros generales del nuevo instrumento.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-1">Nombre de la Evaluación</Label>
                  <Input placeholder="Ej: Evaluación de Desempeño Conductual" className="h-14 rounded-2xl bg-background/40 border-border/40 font-bold focus:ring-primary/20" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-1">Tipo de Medición</Label>
                  <Select defaultValue="pre">
                    <SelectTrigger className="h-14 rounded-2xl bg-background/40 border-border/40 font-bold">
                      <SelectValue placeholder="Seleccione fase" />
                    </SelectTrigger>
                    <SelectContent className="font-bold">
                      <SelectItem value="pre">DIAGNÓSTICO (PRE)</SelectItem>
                      <SelectItem value="post">CIERRE (POST)</SelectItem>
                      <SelectItem value="peri">PERIÓDICA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-1">Descripción del Objetivo</Label>
                <Textarea placeholder="Indique el propósito de esta evaluación..." className="min-h-32 rounded-2xl bg-background/40 border-border/40 font-bold resize-none" />
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-border/20 pb-4">
                  <Label className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-primary" /> Ítems a Evaluar
                  </Label>
                  <Badge variant="outline" className="font-black text-[10px] px-3">{items.length} ÍTEMS</Badge>
                </div>

                <div className="flex gap-3">
                  <Input 
                    placeholder="Agregar nuevo ítem/habilidad..." 
                    className="h-12 rounded-xl bg-background/60 border-border/40 font-bold"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <Button onClick={handleAddItem} className="h-12 w-12 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 group hover:border-primary/40 transition-all">
                      <span className="font-black text-sm text-foreground/80">{item}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-lg group-hover:opacity-100 opacity-0 transition-all" onClick={() => removeItem(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border/20">
                <Button className="w-full h-16 rounded-[24px] bg-primary font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 hover:translate-y-[-2px] transition-all duration-300">
                  Registrar Plantilla de Evaluación
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List Sidebar */}
        <div className="space-y-8">
          <Card className="border-none ring-1 ring-white/10 bg-card/60 backdrop-blur-md shadow-2xl rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 border-b border-border/20 bg-muted/10">
              <CardTitle className="text-xl font-black tracking-tight">Evaluaciones Creadas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {createdEvaluations.map((evalObj) => (
                  <div key={evalObj.id} className="p-6 hover:bg-primary/[0.02] transition-all group flex items-center justify-between cursor-pointer">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm group-hover:text-primary transition-colors">{evalObj.name}</span>
                        <Badge variant="outline" className={cn(
                          "text-[8px] font-black px-1.5 h-4 border-none",
                          evalObj.type === "PRE" ? "bg-indigo-500/10 text-indigo-600" : "bg-emerald-500/10 text-emerald-600"
                        )}>{evalObj.type}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground/60">
                        <span className="text-[10px] font-bold uppercase tracking-widest">ID: {evalObj.id}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{evalObj.items} Ítems</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none ring-1 ring-white/10 bg-indigo-600 text-white shadow-2xl rounded-[32px] overflow-hidden relative group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black tracking-tight">Estandarización SBC</h4>
                <p className="text-xs font-bold text-indigo-100/80 leading-relaxed uppercase tracking-wide">
                  Toda evaluación creada se sincroniza automáticamente con el sistema de monitoreo en tiempo real para psicólogos.
                </p>
              </div>
              <div className="pt-4 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white" />
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <div className="w-2 h-2 rounded-full bg-white/30" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsPage;
