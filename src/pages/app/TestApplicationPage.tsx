import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, User, Calendar, Briefcase, Mail, Phone, BarChart, PieChart as PieChartIcon, ArrowRight, ClipboardCheck, TrendingUp } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const mockEvaluated = [
  { id: 1, name: "Juan Pérez", status: "Completado", score: 85, group: "Operaciones Mina", position: "Operador de Pala", email: "juan.perez@mina.com" },
  { id: 2, name: "María García", status: "En curso", score: 45, group: "Seguridad Industrial", position: "Ingeniera de Seguridad", email: "maria.garcia@mina.com" },
  { id: 3, name: "Carlos López", status: "Pendiente", score: 0, group: "Mantenimiento Planta", position: "Técnico Mecánico", email: "carlos.lopez@mina.com" },
  { id: 4, name: "Ana Martínez", status: "Completado", score: 92, group: "Operaciones Mina", position: "Supervisora", email: "ana.martinez@mina.com" },
  { id: 5, name: "Pedro Ruiz", status: "En curso", score: 60, group: "Logística", position: "Chofer", email: "pedro.ruiz@mina.com" },
];

const radarData = [
  { subject: 'Liderazgo', A: 120, B: 110, fullMark: 150 },
  { subject: 'Seguridad', A: 98, B: 130, fullMark: 150 },
  { subject: 'Comunicación', A: 86, B: 130, fullMark: 150 },
  { subject: 'Técnico', A: 99, B: 100, fullMark: 150 },
  { subject: 'Puntualidad', A: 85, B: 90, fullMark: 150 },
  { subject: 'Ética', A: 65, B: 85, fullMark: 150 },
];

const barData = [
  { name: 'Ene', valor: 400 },
  { name: 'Feb', valor: 300 },
  { name: 'Mar', valor: 200 },
  { name: 'Abr', valor: 278 },
  { name: 'May', valor: 189 },
];

const TestApplicationPage = () => {
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completado": return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">Completado</Badge>;
      case "En curso": return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">En curso</Badge>;
      case "Pendiente": return <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 border-slate-500/20 font-bold">Pendiente</Badge>;
      default: return null;
    }
  };

  const handleRowClick = (person: any) => {
    setSelectedPerson(person);
    setIsSheetOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Aplicación de Pruebas</h1>
          <p className="text-muted-foreground mt-2">
            Gestión y seguimiento de evaluaciones de personal.
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 p-2 gap-2">
          <ClipboardCheck className="w-4 h-4" />
          Proceso Activo 2024
        </Badge>
      </div>

      <Tabs defaultValue="evaluacion" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/40">
          <TabsTrigger value="evaluacion" className="rounded-lg gap-2 px-6">
            <ClipboardCheck className="w-4 h-4" />
            Evaluación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evaluacion" className="animate-in fade-in zoom-in-95 duration-300">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Estado de Evaluados</CardTitle>
                <CardDescription>Lista detalla de participantes y su progreso actual.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 border-border/50">
                  <Filter className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar evaluado..." className="pl-8 w-[250px] h-9 bg-background/50" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead>Evaluado</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Puntaje</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvaluated.map((person) => (
                    <TableRow 
                      key={person.id} 
                      className="border-border/40 hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => handleRowClick(person)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-sm">{person.name}</div>
                            <div className="text-[10px] text-muted-foreground">{person.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-muted/50 border border-border/40">
                          {person.group}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-1000" 
                              style={{ width: `${person.score}%` }} 
                            />
                          </div>
                          <span className="text-xs font-bold">{person.score}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(person.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2 text-primary hover:bg-primary/10 hover:text-primary font-bold group-hover:translate-x-1 transition-all"
                        >
                          Ver más
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Controlled Sheet for Details */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-2xl border-l-border/40 bg-card/80 backdrop-blur-xl shadow-2xl p-0 overflow-hidden animate-in slide-in-from-right-1/2 duration-500 ease-mac">
          {selectedPerson && (
            <>
              {/* Header (Cleaned) */}
              <div className="bg-muted/30 p-8 border-b border-border/40 relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-1 border border-primary/20 shadow-inner">
                    <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center text-3xl font-black text-primary shadow-sm">
                      {selectedPerson.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <SheetTitle className="text-3xl font-black tracking-tight">{selectedPerson.name}</SheetTitle>
                    <SheetDescription className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                      {selectedPerson.position} • {selectedPerson.group}
                    </SheetDescription>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto h-[calc(100vh-280px)]">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">
                      <Mail className="w-3 h-3" /> Correo Electrónico
                    </div>
                    <div className="text-sm font-bold truncate">{selectedPerson.email}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">
                      <Phone className="w-3 h-3" /> Teléfono
                    </div>
                    <div className="text-sm font-bold">+51 987 654 321</div>
                  </div>
                </div>

                {/* Dashboard Individual */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black flex items-center gap-2">
                      <BarChart className="w-5 h-5 text-primary" />
                      Dashboard Individual
                    </h4>
                    <Badge className="bg-primary hover:bg-primary font-bold">Top 10%</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-border/40 bg-background/50 shadow-sm overflow-hidden group">
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                          <PieChartIcon className="w-3 h-3" /> Radar de Competencias
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 700 }} />
                            <Radar name="Competencias" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-background/50 shadow-sm overflow-hidden group">
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" /> Histórico de Puntaje
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 700 }} stroke="#9ca3af" />
                            <YAxis hide />
                            <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full py-6 text-base font-black shadow-xl shadow-primary/20 rounded-2xl gap-2 hover:translate-y-[-2px] transition-all duration-300">
                    Ver Detalles Completos de Resultados
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TestApplicationPage;
