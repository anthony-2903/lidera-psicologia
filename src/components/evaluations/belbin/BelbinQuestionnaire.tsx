import { 
  AlertCircle,
  ClipboardCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const belbinStages = [
  {
    id: 1,
    title: "1. Qué creo que puedo aportar a un equipo",
    options: [
      { id: "A", text: "Creo que puedo detectar y aprovechar rápidamente las nuevas oportunidades." },
      { id: "B", text: "Puedo trabajar bien con personas de muy diversa índole." },
      { id: "C", text: "Uno de mis talentos naturales es la creación de ideas." },
      { id: "D", text: "Mi habilidad consiste en que consigo atraer a quienes detecto pueden aportar algo valioso para que el grupo logre sus objetivos." },
      { id: "E", text: "Mi capacidad para el seguimiento de los asuntos contribuye en gran medida a que sea eficaz." },
      { id: "F", text: "Estoy dispuesto a hacer frente a una impopularidad temporal, si al final conduce a resultados que valen la pena." },
      { id: "G", text: "Me doy cuenta rápidamente de lo que puede funcionar en situaciones con las que estoy familiarizado." },
      { id: "H", text: "Puedo presentar distintas alternativas razonadas, para diversos temas, sin caer en ningún tipo de prejuicios." },
      { id: "I", text: "Mis comentarios tanto sobre puntos generales como específicos son siempre bien recibidos." }
    ]
  },
  {
    id: 2,
    title: "2. Si tengo un defecto para el trabajo en equipo, es el de que",
    options: [
      { id: "A", text: "No estoy a gusto si las reuniones no están bien organizadas y controladas y generalmente bien dirigidas." },
      { id: "B", text: "Tiendo a ser demasiado generoso con todos aquellos que defienden puntos de vista válidos pero que no han sido tenidos en consideración." },
      { id: "C", text: "Tengo tendencia a hablar mucho, cuando el grupo trata nuevas ideas." },
      { id: "D", text: "Mi punto de vista objetivo hace que me sea difícil unirme con ganas y entusiasmo a mis colegas." },
      { id: "E", text: "En ocasiones se me considera enérgico y autoritario, si hay necesidad de lograr que algo se haga." },
      { id: "F", text: "Considero difícil tomar claramente el liderazgo, quizá porque reacciono fuertemente ante el ambiente del grupo." },
      { id: "G", text: "Suelo quedar demasiado enganchado con las ideas que se me ocurren, por lo que pierdo contacto con lo que está pasando." },
      { id: "H", text: "Mis colegas suelen considerar que me preocupo innecesariamente de los detalles y sobre la posibilidad de que las cosas salgan mal." },
      { id: "I", text: "Me cuesta contribuir a no ser que el tema tenga que ver con algo que conozca bien." }
    ]
  },
  {
    id: 3,
    title: "3. Cuando participo con otras personas en un proyecto",
    options: [
      { id: "A", text: "Tengo habilidad para influir sobre las personas sin presionarlas." },
      { id: "B", text: "Mi actitud de vigilancia general evita que se cometan omisiones y errores por descuido." },
      { id: "C", text: "Estoy dispuesto a presionar a favor de la acción, a fin de que el grupo no malgaste el tiempo ni pierda de vista su objetivo principal." },
      { id: "D", text: "Siempre se puede contar con que aportaré algo original." },
      { id: "E", text: "Siempre estoy dispuesto a respaldar una buena sugerencia por el interés general." },
      { id: "F", text: "Me entusiasma buscar lo último en lo referente a nuevas ideas y adelantos." },
      { id: "G", text: "Creo que los demás aprecian mi capacidad para juzgar fríamente." },
      { id: "H", text: "Se puede confiar en mí para comprobar que todo el trabajo esencial está organizado." },
      { id: "I", text: "Siempre actúo como un buen profesional." }
    ]
  },
  {
    id: 4,
    title: "4. Mi actitud característica ante el trabajo en equipo consiste en",
    options: [
      { id: "A", text: "Me interesa conocer mejor a mis colegas." },
      { id: "B", text: "No rechazo desafiar los puntos de vista de los demás o defender el mío en minoría." },
      { id: "C", text: "Normalmente encuentro una línea de argumentación para refutar las propuestas que no me parecen bien." },
      { id: "D", text: "Pienso que tengo talento para hacer que las cosas funcionen una vez que el plan ha sido puesto en marcha." },
      { id: "E", text: "Tengo tendencia a evitar lo obvio y a presentar lo inesperado." },
      { id: "F", text: "Aporto un toque de perfeccionismo a cualquier tarea de equipo que acometa." },
      { id: "G", text: "Siempre estoy dispuesto a hacer uso de los contactos que tengo fuera del grupo." },
      { id: "H", text: "Aunque me interesan todas las opiniones, no tengo dudas para adoptar una opinión propia cuando hay que tomar una decisión." },
      { id: "I", text: "Contribuyo cuando sé realmente el tema." }
    ]
  },
  {
    id: 2,
    title: "5. Obtengo satisfacción en el trabajo porque",
    options: [
      { id: "A", text: "Disfruto analizando las situaciones y sopesando todas las opciones posibles." },
      { id: "B", text: "Me interesa encontrar soluciones prácticas a los problemas." },
      { id: "C", text: "Me gusta creer que estoy fomentando unas buenas relaciones en el trabajo." },
      { id: "D", text: "Puedo tener una fuerte influencia en las decisiones." },
      { id: "E", text: "Me gusta conocer a personas que tienen algo nuevo que ofrecer." },
      { id: "F", text: "Puedo poner de acuerdo a los compañeros sobre las acciones que se deben tomar." },
      { id: "G", text: "Me encuentro en mi elemento cuando puedo dedicar toda mi atención a una tarea." },
      { id: "H", text: "Me gusta encontrar un campo que amplíe mi imaginación." },
      { id: "I", text: "Siento que estoy utilizando mis cualidades y entrenándome para mejorar." }
    ]
  },
  {
    id: 6,
    title: "6. Si se me asignara de repente una tarea difícil a realizar en un tiempo limitado y con gente que no conozco",
    options: [
      { id: "A", text: "Me gustaría retirarme a un rincón para buscar la forma de abordar la tarea, antes de desarrollar una línea de acción." },
      { id: "B", text: "Estaría dispuesto a trabajar con la persona que tuviera un enfoque más positivo, por difícil que fuera su carácter." },
      { id: "C", text: "Intentaría encontrar algún modo de reducir el volumen de la tarea, determinando cuál será la mejor aportación que podría hacer cada una de las distintas personas." },
      { id: "D", text: "Mi innato sentido de lo que es urgente ayudaría a asegurar que no nos retrasaríamos." },
      { id: "E", text: "Creo que permanecería sereno y conservaría mi capacidad para pensar correctamente." },
      { id: "F", text: "Me mantendría firme en mis propósitos a pesar de las presiones." },
      { id: "G", text: "Estaría dispuesto a tomar la iniciativa si me pareciera que el grupo no está progresando." },
      { id: "H", text: "Abriría discusiones a fin de buscar nuevas ideas y poner las cosas en marcha." },
      { id: "I", text: "Me gustaría informarme sobre el tema tanto como pueda." }
    ]
  },
  {
    id: 7,
    title: "7. Problemas que suelo padecer cuando trabajo en grupo",
    options: [
      { id: "A", text: "Suelo mostrarme impaciente con aquellos que están obstaculizando el avance." },
      { id: "B", text: "Me suelen criticar por ser demasiado analítico y poco intuitivo." },
      { id: "C", text: "Mi afán de asegurarme de que el trabajo está adecuadamente realizado, puede frenar la marcha del grupo." },
      { id: "D", text: "Me aburro con bastante facilidad y me apoyo en uno o dos miembros del equipo para que me estimulen." },
      { id: "E", text: "Me resulta difícil ponerme en marcha si no veo claro los objetivos." },
      { id: "F", text: "En ocasiones soy muy torpe para explicar y aclarar ciertas ideas complejas que se me ocurren." },
      { id: "G", text: "Soy consciente de que pido a los demás cosas que no puedo hacer yo mismo." },
      { id: "H", text: "Suelo dudar en defender mis puntos de vista cuando me encuentro con una oposición real." },
      { id: "I", text: "Me inclino a pensar que estoy perdiendo el tiempo y que lo haría mejor yo solo." }
    ]
  }
];

interface BelbinQuestionnaireProps {
  scores: Record<string, number>;
  onScoreChange: (stageId: number, optionId: string, value: string) => void;
  onFinish: () => void;
}

const BelbinQuestionnaire = ({ scores, onScoreChange, onFinish }: BelbinQuestionnaireProps) => {
  const getStageTotal = (stageId: number) => {
    const stage = belbinStages.find(s => s.id === stageId);
    if (!stage) return 0;
    return stage.options.reduce((sum, opt) => {
      return sum + (scores[`${stageId}-${opt.id}`] || 0);
    }, 0);
  };

  const isFormValid = belbinStages.every(s => getStageTotal(s.id) === 10);

  return (
    <div className="space-y-16 py-10">
      {belbinStages.map((stage) => {
        const total = getStageTotal(stage.id);
        const isOver = total > 10;
        const isCorrect = total === 10;

        return (
          <div key={stage.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-end justify-between border-b-2 border-primary/10 pb-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 text-left">Etapa {stage.id} de 7</span>
                <h3 className="text-2xl font-black tracking-tight text-foreground text-left">{stage.title}</h3>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                  isOver ? "bg-destructive/10 text-destructive" : isCorrect ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                )}>
                  {isOver ? "Exceso Detectado" : isCorrect ? "Completado" : "Pendiente"}
                </span>
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "text-3xl font-black tabular-nums tracking-tighter",
                    isOver ? "text-destructive" : isCorrect ? "text-emerald-500" : "text-primary"
                  )}>{total} <span className="text-lg opacity-40">/ 10</span></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {stage.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-6 p-6 rounded-[24px] bg-card/40 backdrop-blur-md border border-border/10 hover:border-primary/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5">
                  <div className="w-12 h-12 rounded-2xl bg-background border-2 border-border/20 flex items-center justify-center font-black text-xl text-primary/40 group-hover:text-primary group-hover:border-primary/40 transition-all shrink-0">
                    {opt.id}
                  </div>
                  <p className="flex-1 text-base font-bold leading-snug text-muted-foreground group-hover:text-foreground transition-colors pr-8 text-left">
                    {opt.text}
                  </p>
                  <div className="w-24 shrink-0">
                    <Input 
                      type="number"
                      min="0"
                      max="10"
                      className="h-14 rounded-2xl bg-background/60 border-2 border-border/20 text-center font-black text-2xl focus:ring-primary/20 focus:border-primary transition-all"
                      value={scores[`${stage.id}-${opt.id}`] || ""}
                      onChange={(e) => onScoreChange(stage.id, opt.id, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>

            {!isCorrect && total > 0 && (
              <div className={cn(
                "p-6 rounded-3xl flex items-center justify-center gap-4 border-2 border-dashed",
                isOver ? "bg-destructive/5 border-destructive/20 text-destructive" : "bg-amber-500/5 border-amber-500/20 text-amber-600"
              )}>
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span className="text-sm font-black uppercase tracking-[0.1em]">
                  {isOver ? "HA EXCEDIDO LOS 10 PUNTOS PERMITIDOS" : `LE FALTAN ${10 - total} PUNTOS POR ASIGNAR EN ESTA ETAPA`}
                </span>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-center pt-10">
        <Button 
          className="w-full max-w-2xl h-20 rounded-[32px] bg-primary font-black uppercase tracking-[0.3em] text-lg shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all gap-4 border-4 border-white/20"
          disabled={!isFormValid}
          onClick={onFinish}
        >
          <ClipboardCheck className="w-8 h-8" />
          Finalizar Evaluación
        </Button>
      </div>
    </div>
  );
};

export default BelbinQuestionnaire;
