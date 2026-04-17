import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Users, UserPlus, UsersRound, Plus, Save, Trash2, Search, Filter, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GroupsPage = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState([
    { id: 1, name: "Operaciones Mina", members: 12, createdAt: "2024-03-20" },
    { id: 2, name: "Seguridad Industrial", members: 8, createdAt: "2024-03-22" },
    { id: 3, name: "Mantenimiento Planta", members: 15, createdAt: "2024-03-25" },
  ]);

  const [evaluated, setEvaluated] = useState([
    { id: 1, name: "Juan", lastName: "Pérez", position: "Operador de Pala", gender: "Masculino", age: 34, group: "Operaciones Mina", email: "juan.perez@mina.com", phone: "+51 987 654 321" },
    { id: 2, name: "María", lastName: "García", position: "Ingeniera de Seguridad", gender: "Femenino", age: 29, group: "Seguridad Industrial", email: "maria.garcia@mina.com", phone: "+51 912 345 678" },
  ]);

  const [newGroupName, setNewGroupName] = useState("");
  const [newEvaluated, setNewEvaluated] = useState({
    name: "",
    lastName: "",
    position: "",
    gender: "",
    age: "",
    group: "",
    email: "",
    phone: "",
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;
    
    const newGroup = {
      id: groups.length + 1,
      name: newGroupName,
      members: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName("");
    toast({
      title: "Grupo creado",
      description: `El grupo "${newGroupName}" ha sido registrado correctamente.`,
    });
  };

  const handleCreateEvaluated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvaluated.name || !newEvaluated.lastName) return;

    const person = {
      id: evaluated.length + 1,
      ...newEvaluated,
      age: parseInt(newEvaluated.age),
    };

    setEvaluated([...evaluated, person as any]);
    setNewEvaluated({ name: "", lastName: "", position: "", gender: "", age: "", group: "", email: "", phone: "" });
    toast({
      title: "Evaluado registrado",
      description: `${newEvaluated.name} ${newEvaluated.lastName} ha sido añadido.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Personal</h1>
        <p className="text-muted-foreground mt-2">
          Administre sus grupos de trabajo y el registro de participantes.
        </p>
      </div>

      <Tabs defaultValue="groups" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/40">
          <TabsTrigger value="groups" className="rounded-lg gap-2 px-6">
            <UsersRound className="w-4 h-4" />
            Grupos
          </TabsTrigger>
          <TabsTrigger value="evaluated" className="rounded-lg gap-2 px-6">
            <Users className="w-4 h-4" />
            Evaluados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario Grupos */}
            <Card className="lg:col-span-1 border-border/40 bg-card/60 backdrop-blur-sm shadow-xl h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Nuevo Grupo
                </CardTitle>
                <CardDescription>Cree un nuevo grupo para organizar a los evaluados.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Nombre del Grupo</Label>
                    <Input
                      id="group-name"
                      placeholder="Ej. Equipo de Perforación"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2 shadow-md">
                    <Save className="w-4 h-4" />
                    Registrar Grupo
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista Grupos */}
            <Card className="lg:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Grupos Registrados</CardTitle>
                  <CardDescription>Visualice la lista actual de grupos de trabajo.</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar grupo..." className="pl-8 w-[200px] h-9 bg-background/50" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[500px] overflow-y-auto overflow-x-auto custom-scrollbar relative">
                  <Table>
                    <TableHeader className="bg-slate-100/90 backdrop-blur-md sticky top-0 z-40">
                      <TableRow className="border-border/40">
                        <TableHead className="py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Nombre</TableHead>
                        <TableHead className="text-center py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Integrantes</TableHead>
                        <TableHead className="py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">F. Creación</TableHead>
                        <TableHead className="text-right py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {groups.map((group) => (
                      <TableRow key={group.id} className="border-border/40 hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                            {group.members}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{group.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evaluated" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Formulario Evaluados */}
            <Card className="xl:col-span-4 border-border/40 bg-card/60 backdrop-blur-sm shadow-xl h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Registro de Evaluado
                </CardTitle>
                <CardDescription>Ingrese los datos personales del participante.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEvaluated} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eval-name">Nombres</Label>
                      <Input
                        id="eval-name"
                        value={newEvaluated.name}
                        onChange={(e) => setNewEvaluated({...newEvaluated, name: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eval-lastName">Apellidos</Label>
                      <Input
                        id="eval-lastName"
                        value={newEvaluated.lastName}
                        onChange={(e) => setNewEvaluated({...newEvaluated, lastName: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="eval-pos">Cargo</Label>
                      <Input
                        id="eval-pos"
                        placeholder="Ej. Operador A"
                        value={newEvaluated.position}
                        onChange={(e) => setNewEvaluated({...newEvaluated, position: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eval-email" className="flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Correo Electrónico
                      </Label>
                      <Input
                        id="eval-email"
                        type="email"
                        placeholder="usuario@mina.com"
                        value={newEvaluated.email}
                        onChange={(e) => setNewEvaluated({...newEvaluated, email: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eval-phone" className="flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Teléfono
                      </Label>
                      <Input
                        id="eval-phone"
                        placeholder="+51 000 000 000"
                        value={newEvaluated.phone}
                        onChange={(e) => setNewEvaluated({...newEvaluated, phone: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Género</Label>
                      <Select 
                        value={newEvaluated.gender} 
                        onValueChange={(v) => setNewEvaluated({...newEvaluated, gender: v})}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eval-age">Edad</Label>
                      <Input
                        id="eval-age"
                        type="number"
                        value={newEvaluated.age}
                        onChange={(e) => setNewEvaluated({...newEvaluated, age: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Asignar Grupo</Label>
                    <Select 
                      value={newEvaluated.group}
                      onValueChange={(v) => setNewEvaluated({...newEvaluated, group: v})}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map(g => (
                          <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full gap-2 shadow-md">
                    <Save className="w-4 h-4" />
                    Guardar Registro
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista Evaluados */}
            <Card className="xl:col-span-8 border-border/40 bg-card/60 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Lista de Evaluados</CardTitle>
                  <CardDescription>Administre el personal registrado en los grupos.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-9 w-9 border-border/50">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nombre..." className="pl-8 w-[250px] h-9 bg-background/50" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar relative">
                  <Table>
                    <TableHeader className="bg-slate-100/90 backdrop-blur-md sticky top-0 z-40">
                      <TableRow className="border-border/40">
                        <TableHead className="py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Nombre Completo</TableHead>
                        <TableHead className="py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Contacto</TableHead>
                        <TableHead className="py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Cargo</TableHead>
                        <TableHead className="py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Grupo</TableHead>
                        <TableHead className="py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Género / Edad</TableHead>
                        <TableHead className="text-right py-4 sticky top-0 bg-slate-100/90 z-40 shadow-sm">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {evaluated.map((person) => (
                      <TableRow key={person.id} className="border-border/40 hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="font-medium text-sm">{person.name} {person.lastName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                              <Mail className="w-2.5 h-2.5" />
                              {(person as any).email}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                              <Phone className="w-2.5 h-2.5" />
                              {(person as any).phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{person.position}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary">
                            {person.group}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {person.gender} • {person.age} años
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupsPage;

