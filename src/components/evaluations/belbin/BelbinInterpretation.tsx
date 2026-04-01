import { 
  Users2,
  Lightbulb,
  Search,
  UserCheck,
  BarChart3,
  Heart,
  Hammer,
  Flag,
  Wrench
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const rolesData = [
  {
    role: "Cerebro (PL)",
    type: "Mental",
    icon: Lightbulb,
    description: "Creativo, imaginativo, poco ortodoxo. Resuelve problemas difíciles.",
    strengths: "Capacidad para generar ideas y resolver problemas complejos.",
    weaknesses: "Ignora los incidentes, demasiado absorto en sus ideas."
  },
  {
    role: "Investigador de Recursos (RI)",
    type: "Social",
    icon: Search,
    description: "Extrovertido, entusiasta, comunicativo. Busca oportunidades.",
    strengths: "Capacidad para explorar nuevas oportunidades y desarrollar contactos.",
    weaknesses: "Demasiado optimista, pierde el interés una vez que el entusiasmo inicial ha pasado."
  },
  {
    role: "Coordinador (CO)",
    type: "Social",
    icon: UserCheck,
    description: "Maduro, seguro de sí mismo, identifica el talento. Aclara las metas.",
    strengths: "Promueve la toma de decisiones, delega bien.",
    weaknesses: "Se le puede considerar manipulador, delega su propio trabajo."
  },
  {
    role: "Impulsor (SH)",
    type: "Acción",
    icon: Flag,
    description: "Retador, dinámico, trabaja bajo presión. Tiene iniciativa.",
    strengths: "Valentía para superar obstáculos.",
    weaknesses: "Propenso a provocar a los demás, puede ofender los sentimientos de la gente."
  },
  {
    role: "Monitor Evaluador (ME)",
    type: "Mental",
    icon: BarChart3,
    description: "Serio, perspicaz, estratega. Percibe todas las opciones.",
    strengths: "Juzga con exactitud.",
    weaknesses: "Carece de iniciativa y de capacidad para inspirar a otros."
  },
  {
    role: "Cohesionador (TW)",
    type: "Social",
    icon: Heart,
    description: "Cooperador, apacible, perceptivo y diplomático. Escucha.",
    strengths: "Evita los enfrentamientos, calma las aguas.",
    weaknesses: "Indeciso en situaciones de crisis."
  },
  {
    role: "Implementador (IMP)",
    type: "Acción",
    icon: Hammer,
    description: "Práctico, de confianza, eficiente. Transforma ideas en acciones.",
    strengths: "Capacidad para transformar ideas en planes de trabajo prácticos.",
    weaknesses: "Inflexibilidad, lento para responder a nuevas posibilidades."
  },
  {
    role: "Finalizador (CF)",
    type: "Acción",
    icon: Wrench,
    description: "Esmerado, concienzudo, ansioso. Busca errores y omisiones.",
    strengths: "Capacidad para cumplir con los plazos de entrega.",
    weaknesses: "Tiende a preocuparse excesivamente, reacio a delegar."
  },
  {
    role: "Especialista (SP)",
    type: "Mental",
    icon: Users2,
    description: "Interesado en una sola cosa a la vez, aporta conocimientos técnicos.",
    strengths: "Aporta conocimientos y habilidades técnicas excepcionales.",
    weaknesses: "Contribuye solo en áreas estrechas de conocimiento."
  }
];

const BelbinInterpretation = () => {
  return (
    <div className="py-10 space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rolesData.map((role, idx) => (
          <Card key={idx} className="border-none ring-1 ring-white/10 bg-card/40 backdrop-blur-md overflow-hidden rounded-[24px] hover:ring-primary/40 transition-all group">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <role.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase py-1 border-none bg-muted/40">
                  {role.type}
                </Badge>
              </div>
              <CardTitle className="text-xl font-black tracking-tight mt-4 text-left">{role.role}</CardTitle>
              <CardDescription className="text-xs font-bold leading-relaxed text-muted-foreground mt-1 text-left">
                {role.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              <div className="space-y-1.5 text-left">
                <span className="text-[9px] font-black uppercase text-primary tracking-widest">Fortalezas:</span>
                <p className="text-xs font-bold text-foreground/70">{role.strengths}</p>
              </div>
              <div className="space-y-1.5 text-left">
                <span className="text-[9px] font-black uppercase text-destructive tracking-widest">Debilidades Admitidas:</span>
                <p className="text-xs font-bold text-foreground/70">{role.weaknesses}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BelbinInterpretation;
