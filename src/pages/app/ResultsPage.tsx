import { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  FileText, 
  Eye, 
  User, 
  ArrowUpDown,
  Table as TableIcon,
  LayoutGrid,
  FileDown,
  Printer
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const resultsData = [
  { id: "1", name: "Carlos Rodríguez", group: "Operaciones Mina", score: 85, status: "Completado", date: "2024-03-28", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
  { id: "2", name: "Juan Pérez", group: "Seguridad Industrial", score: 92, status: "Completado", date: "2024-03-27", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan" },
  { id: "3", name: "Miguel Ángel", group: "Mantenimiento Planta", score: 68, status: "En Revisión", date: "2024-03-26", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel" },
  { id: "4", name: "Ana Torres", group: "Operaciones Mina", score: 74, status: "Completado", date: "2024-03-25", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
  { id: "5", name: "Roberto Díaz", group: "Logística", score: 81, status: "Completado", date: "2024-03-25", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto" },
  { id: "6", name: "Elena Gómez", group: "Geología", score: 88, status: "Completado", date: "2024-03-24", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
  { id: "7", name: "Luis Martínez", group: "Mantenimiento Planta", score: 55, status: "En Progreso", date: "2024-03-24", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis" },
  { id: "8", name: "Sofía Rojas", group: "Seguridad Industrial", score: 95, status: "Completado", date: "2024-03-23", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia" },
];

const ResultsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  const filteredResults = resultsData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === "all" || item.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
            Resultados <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black px-3 py-1">ADMIN</Badge>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Bases de datos consolidadas de todas las evaluaciones</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-bold text-xs uppercase shadow-sm">
            <Printer className="w-4 h-4 mr-2" /> Imprimir
          </Button>
          <Button className="font-black text-xs uppercase shadow-xl shadow-primary/20">
            <FileDown className="w-4 h-4 mr-2" /> Exportar CSV/PDF
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-xl border-none ring-1 ring-white/10">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Buscar evaluado por nombre..." 
                className="pl-11 h-12 bg-background/50 border-border/40 font-bold focus-visible:ring-primary/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-[200px] h-12 bg-background/50 border-border/40 font-bold">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Filtrar por grupo" />
                  </div>
                </SelectTrigger>
                <SelectContent className="font-bold">
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  <SelectItem value="Operaciones Mina">Operaciones Mina</SelectItem>
                  <SelectItem value="Seguridad Industrial">Seguridad Industrial</SelectItem>
                  <SelectItem value="Mantenimiento Planta">Mantenimiento Planta</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Geología">Geología</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden border-none ring-1 ring-white/10">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="w-[300px] font-black text-[10px] uppercase tracking-widest text-muted-foreground py-6 pl-8">Personal</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Grupo</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Puntaje</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Estado</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Fecha Eval.</TableHead>
              <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground pr-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-border/40 transition-colors group">
                  <TableCell className="py-4 pl-8">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-background shadow-md">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="font-black text-sm tracking-tight">{item.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/60">ID: EVAL-00{item.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold text-[10px] border-primary/20 text-primary bg-primary/5">
                      {item.group}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-20 bg-muted/40 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-amber-500" : "bg-red-500"
                          )} 
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                      <span className="font-black text-sm">{item.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        item.status === "Completado" ? "bg-emerald-500" : item.status === "En Revisión" ? "bg-amber-500" : "bg-blue-500 animate-pulse"
                      )} />
                      <span className="font-bold text-xs">{item.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                    {item.date}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/80 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 font-bold border-border/40 shadow-2xl">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Opciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-sm cursor-pointer">
                          <Eye className="mr-2 h-4 w-4 text-primary" /> Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm cursor-pointer">
                          <FileText className="mr-2 h-4 w-4 text-indigo-500" /> Generar Reporte
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm cursor-pointer text-destructive focus:text-destructive">
                          <Download className="mr-2 h-4 w-4" /> Bajar PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center">
                      <TableIcon className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <p className="font-black text-muted-foreground/60">No se encontraron resultados para tu búsqueda.</p>
                    <Button variant="outline" onClick={() => { setSearchTerm(""); setGroupFilter("all"); }}>Limpiar Filtros</Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Summary Footer */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
          Mostrando {filteredResults.length} de {resultsData.length} evaluados
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-8 px-3 font-black text-xs uppercase" disabled>Anterior</Button>
          <Button variant="outline" size="sm" className="h-8 px-3 font-black text-xs uppercase" disabled>Siguiente</Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
