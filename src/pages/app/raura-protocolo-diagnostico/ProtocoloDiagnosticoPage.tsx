import {
  Activity,
  BarChart3,
  Brain,
  Calculator,
  CheckCircle2,
  CheckSquare,
  ClipboardCheck,
  FileText,
  Layers,
  LayoutDashboard,
  Link2,
  ShieldCheck,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProtocolTab = {
  id: string;
  label: string;
  sheet: string;
  icon: typeof LayoutDashboard;
  title: string;
  description: string;
  objective: string;
  inputs: string[];
  process: string[];
  outputs: string[];
  validations: string[];
  fields: { name: string; detail: string; use: string }[];
  from: string;
  to: string;
};

type ExcelRow = {
  code: string;
  item: string;
  source: string;
  value: string;
  status: "OK" | "BRECHA" | "REACTIVO";
};

type ChartType = "bar" | "line" | "pie" | "radar";

const tabs: ProtocolTab[] = [
  {
    id: "inicio",
    label: "1. Inicio",
    sheet: "1. Inicio",
    icon: LayoutDashboard,
    title: "Mapa general del protocolo",
    description: "Portada operativa del diagnostico: define alcance, responsables, periodo evaluado y resultado global.",
    objective: "Dar contexto al usuario antes de revisar datos: que se evalua, con que fuentes y que resultado final se obtuvo.",
    inputs: ["Nombre de unidad: Raura.", "Periodo de diagnostico.", "Version del protocolo.", "Responsables del levantamiento.", "Estado final: REACTIVO."],
    process: ["Resume el flujo completo del archivo.", "Explica las tres dimensiones evaluadas: liderazgo visible, trabajo en equipo, organizacion y estructura.", "Conecta cada hoja con la etapa del diagnostico."],
    outputs: ["Ficha resumen del diagnostico.", "Estado general visible para gerencia.", "Acceso rapido a hojas de evidencia, cuestionario y triangulacion."],
    validations: ["La unidad debe coincidir con la data cargada.", "El estado final debe venir de Resultados del Diagnostico.", "La fecha y version deben quedar trazables."],
    fields: [
      { name: "Unidad / Proyecto", detail: "Identifica el alcance organizacional evaluado.", use: "Filtra y contextualiza todo el diagnostico." },
      { name: "Periodo", detail: "Rango de fechas del levantamiento.", use: "Evita mezclar evidencias de ciclos distintos." },
      { name: "Resultado global", detail: "Lectura final del modelo.", use: "Se muestra como REACTIVO para priorizar cierre de brechas." },
      { name: "Dimensiones", detail: "LV, Trabajo en equipo, Organizacion y estructura.", use: "Ordena la lectura de las hojas posteriores." },
    ],
    from: "Parametros del protocolo y resultados consolidados.",
    to: "Todas las pestañas; funciona como indice ejecutivo.",
  },
  {
    id: "abreviaturas",
    label: "2. Abreviaturas",
    sheet: "2. Abreviaturas",
    icon: FileText,
    title: "Glosario operativo",
    description: "Diccionario de terminos, siglas y criterios de interpretacion para que todos lean el archivo igual.",
    objective: "Eliminar ambiguedad: cada abreviatura usada en listas, entrevistas y resultados debe tener una definicion unica.",
    inputs: ["Siglas del protocolo.", "Nombres de dimensiones.", "Tipos de evidencia.", "Niveles de calificacion.", "Roles entrevistados."],
    process: ["Estandariza terminos antes de analizar.", "Agrupa abreviaturas por dimension, fuente y metodo.", "Aclara diferencias entre documento, campo, cuestionario y entrevista."],
    outputs: ["Glosario consultable.", "Definiciones consistentes para reportes.", "Base semantica para interpretar criterios y resultados."],
    validations: ["Cada sigla usada en otras hojas debe existir aqui.", "No deben existir siglas duplicadas con significado distinto.", "Las definiciones deben ser cortas y operativas."],
    fields: [
      { name: "Sigla", detail: "Codigo corto usado en el Excel.", use: "Reduce ruido visual en matrices y graficos." },
      { name: "Descripcion", detail: "Significado completo.", use: "Permite interpretar cada indicador." },
      { name: "Categoria", detail: "Dimension, fuente, rol o estado.", use: "Ordena el glosario por tipo." },
      { name: "Aplicacion", detail: "Donde se usa la sigla.", use: "Conecta el glosario con las hojas reales." },
    ],
    from: "Estructura del protocolo y nombres de hojas.",
    to: "Criterios, matrices Doc/Cam, entrevistas y triangulacion.",
  },
  {
    id: "criterios",
    label: "3. Criterios",
    sheet: "3. Criterios de calificacion",
    icon: CheckSquare,
    title: "Criterios de calificacion",
    description: "Reglas para transformar evidencia y respuestas en una lectura de madurez, cumplimiento y brecha.",
    objective: "Definir como se califica cada hallazgo para que el resultado no dependa de opinion individual.",
    inputs: ["Escala de valoracion.", "Umbrales de cumplimiento.", "Ponderaciones por dimension.", "Fuentes aceptadas como evidencia.", "Reglas para clasificar brechas."],
    process: ["Convierte respuestas en puntajes comparables.", "Diferencia evidencia suficiente, parcial e inexistente.", "Define cuando una dimension cae en estado reactivo.", "Prioriza brechas criticas sobre cumplimientos aislados."],
    outputs: ["Reglas de calculo.", "Semaforo de interpretacion.", "Base para resultados y graficos.", "Criterio comun para auditor y lideres."],
    validations: ["Cada indicador debe tener escala definida.", "Los umbrales deben sumar coherentemente.", "La misma regla debe aplicar a cuestionario, campo y entrevista cuando corresponda."],
    fields: [
      { name: "Indicador", detail: "Comportamiento, practica o control evaluado.", use: "Unidad minima de evaluacion." },
      { name: "Escala", detail: "Valor o estado asignable.", use: "Permite calcular cumplimiento." },
      { name: "Criterio de evidencia", detail: "Que prueba acepta el protocolo.", use: "Evita calificar sin respaldo." },
      { name: "Interpretacion", detail: "Que significa el puntaje.", use: "Traduce numeros a decision." },
    ],
    from: "Glosario, metodologia y objetivos de evaluacion.",
    to: "Doc/Cam, tabulacion, resultados y triangulacion.",
  },
  {
    id: "lv-doc-cam",
    label: "4. LV Doc/Cam",
    sheet: "4. LV Doc y Cam",
    icon: Activity,
    title: "Liderazgo visible: documental y campo",
    description: "Matriz para comprobar si el liderazgo se ve en registros, rutinas y presencia real en terreno.",
    objective: "Validar si los lideres sostienen practicas visibles de seguridad y si esas practicas tienen evidencia verificable.",
    inputs: ["Planes de inspeccion.", "Actas de reuniones.", "Registros de observaciones.", "Rondas en campo.", "Entrevistas a supervisores y trabajadores."],
    process: ["Contrasta lo documentado contra lo observado.", "Marca brechas entre presencia declarada y presencia real.", "Identifica si el lider corrige, acompana y retroalimenta en campo."],
    outputs: ["Hallazgos de liderazgo visible.", "Puntaje o estado por indicador LV.", "Evidencias para triangulacion LV.", "Acciones sugeridas de liderazgo."],
    validations: ["La evidencia documental debe tener fecha y responsable.", "La observacion de campo debe indicar area o frente.", "Un cumplimiento no debe marcarse si solo existe declaracion verbal."],
    fields: [
      { name: "Indicador LV", detail: "Practica visible de liderazgo.", use: "Agrupa hallazgos de liderazgo." },
      { name: "Evidencia documental", detail: "Registro, acta, plan o reporte.", use: "Prueba formal de la practica." },
      { name: "Evidencia de campo", detail: "Observacion directa en operacion.", use: "Confirma si la practica ocurre." },
      { name: "Brecha", detail: "Diferencia entre requerido y observado.", use: "Alimenta triangulacion y plan de accion." },
    ],
    from: "Criterios, documentos internos, observaciones y entrevistas.",
    to: "Liderazgo Visible Triangulacion y Resultados del Diagnostico.",
  },
  {
    id: "te-doc-cam",
    label: "5. TEquip Doc/Cam",
    sheet: "5. TEquip Doc y Cam",
    icon: UsersRound,
    title: "Trabajo en equipo: documental y campo",
    description: "Evalua coordinacion, comunicacion, soporte entre roles y ejecucion segura del trabajo.",
    objective: "Determinar si los equipos coordinan sus tareas de manera consistente o si dependen de esfuerzos aislados.",
    inputs: ["Reuniones de inicio de guardia.", "Permisos de trabajo.", "Reportes de coordinacion.", "Observaciones de frente.", "Percepcion del cuestionario."],
    process: ["Revisa si los equipos comparten informacion critica.", "Evalua colaboracion entre supervision, operaciones y seguridad.", "Identifica fallas de traspaso, seguimiento o aprendizaje."],
    outputs: ["Mapa de brechas de coordinacion.", "Estado de trabajo en equipo por indicador.", "Insumos para triangulacion TE.", "Prioridades de intervencion operacional."],
    validations: ["La coordinacion debe evidenciarse en registros y campo.", "Las reuniones deben mostrar acuerdos y seguimiento.", "No confundir convivencia con trabajo colaborativo efectivo."],
    fields: [
      { name: "Rutina de coordinacion", detail: "Instancia donde el equipo alinea tareas.", use: "Mide disciplina de equipo." },
      { name: "Roles participantes", detail: "Quienes intervienen.", use: "Evalua cobertura y responsabilidad." },
      { name: "Acuerdos / controles", detail: "Compromisos definidos.", use: "Verifica si la coordinacion produce accion." },
      { name: "Seguimiento", detail: "Cierre de acuerdos.", use: "Diferencia conversacion de gestion real." },
    ],
    from: "Criterios, registros de equipo, campo y cuestionario.",
    to: "Trabajo en Equipo Triangulacion y Resultados del Diagnostico.",
  },
  {
    id: "oe-doc-cam",
    label: "6. Org. y estruc.",
    sheet: "6. Org. y estruc. Doc y Cam",
    icon: Layers,
    title: "Organizacion y estructura: documental y campo",
    description: "Revisa si roles, responsabilidades, escalamiento y recursos soportan la gestion de seguridad.",
    objective: "Confirmar si la estructura permite cerrar brechas, sostener controles y tomar decisiones oportunas.",
    inputs: ["Organigramas.", "Matriz RACI o responsabilidades.", "Procedimientos.", "Evidencia de escalamiento.", "Seguimiento de acciones."],
    process: ["Contrasta responsabilidades formales contra ejecucion real.", "Evalua si existen rutas claras de escalamiento.", "Detecta cuellos de botella para cerrar acciones de seguridad."],
    outputs: ["Brechas de estructura y gobierno.", "Indicadores OE calificados.", "Insumos para triangulacion OE.", "Riesgos de gestion sistemica."],
    validations: ["Cada responsabilidad debe tener dueno claro.", "Las acciones deben tener fecha, responsable y estado.", "La estructura debe comprobarse con evidencias, no solo organigrama."],
    fields: [
      { name: "Rol / area", detail: "Responsable del proceso.", use: "Asigna propiedad de brechas." },
      { name: "Responsabilidad", detail: "Funcion esperada.", use: "Define que se debe comprobar." },
      { name: "Evidencia de ejecucion", detail: "Registro de cumplimiento real.", use: "Verifica si la estructura funciona." },
      { name: "Escalamiento", detail: "Ruta para resolver bloqueos.", use: "Mide capacidad de respuesta." },
    ],
    from: "Criterios, documentos de gestion, seguimiento y campo.",
    to: "Organizacion y Estructura Triangulacion y Resultados del Diagnostico.",
  },
  {
    id: "resultados",
    label: "7. Resultados",
    sheet: "7. Resultados del Diagnostico",
    icon: Target,
    title: "Resultados del diagnostico",
    description: "Consolidado ejecutivo: resume la puntuacion, madurez, brechas y prioridad por dimension.",
    objective: "Convertir todo el levantamiento en una lectura directiva clara: donde estamos, por que y que se debe atacar primero.",
    inputs: ["Puntajes Doc/Cam.", "Tabulacion del cuestionario.", "Triangulaciones.", "Entrevistas.", "Poblacion y muestra."],
    process: ["Calcula resultados por dimension.", "Resume hallazgos recurrentes.", "Compara evidencia cuantitativa y cualitativa.", "Define estado global REACTIVO cuando predominan brechas de gestion."],
    outputs: ["Resultado global.", "Ranking de dimensiones.", "Hallazgos criticos.", "Prioridades para plan de accion."],
    validations: ["No debe haber resultado sin fuente trazable.", "Las dimensiones deben venir de hojas previas.", "El resultado global debe explicar las causas, no solo mostrar porcentaje."],
    fields: [
      { name: "Dimension", detail: "LV, TE u OE.", use: "Organiza el resultado." },
      { name: "Puntaje", detail: "Valor consolidado.", use: "Compara madurez entre dimensiones." },
      { name: "Estado", detail: "Reactivo u otro nivel definido.", use: "Traduce dato a decision." },
      { name: "Hallazgo principal", detail: "Causa dominante.", use: "Conecta resultado con accion." },
    ],
    from: "Doc/Cam, cuestionario, graficos, entrevistas y triangulacion.",
    to: "Reporte gerencial y plan de accion.",
  },
  {
    id: "tabulacion",
    label: "8. Tabulacion",
    sheet: "8. Tabulacion Cuestionario",
    icon: ClipboardCheck,
    title: "Tabulacion del cuestionario",
    description: "Base numerica del cuestionario: transforma las respuestas importadas en totales y lecturas por item.",
    objective: "Procesar las respuestas de la fuente actual y dejar formulas reactivas para que los totales se recalculen al cambiar datos.",
    inputs: ["Respuestas importadas desde Google Sheets.", "Opciones por pregunta.", "Dimension asociada a cada item.", "Formula de totalizacion.", "Identificador de participante o registro."],
    process: ["Limpia y ordena respuestas.", "Cuenta frecuencias por alternativa.", "Calcula totales por pregunta.", "Agrupa preguntas por dimension.", "Entrega base para graficos."],
    outputs: ["Matriz de tabulacion.", "Totales por pregunta.", "Totales por dimension.", "Base para graficos del cuestionario."],
    validations: ["Todas las respuestas deben mapear a una alternativa valida.", "Las formulas deben recalcularse automaticamente.", "La cantidad de registros debe coincidir con la fuente cargada."],
    fields: [
      { name: "Nro. registro", detail: "Fila o respuesta individual.", use: "Controla trazabilidad." },
      { name: "Pregunta / item", detail: "Variable evaluada.", use: "Permite agrupar y graficar." },
      { name: "Respuesta", detail: "Alternativa seleccionada.", use: "Base del conteo." },
      { name: "Total", detail: "Formula por item o dimension.", use: "Alimenta resultados y graficos." },
    ],
    from: "Google Sheets y estructura del cuestionario.",
    to: "Graficos Cuestionario, Cuestionario por Dimension y Resultados.",
  },
  {
    id: "graficos",
    label: "9. Graficos",
    sheet: "9. Graficos Cuestionar",
    icon: BarChart3,
    title: "Graficos del cuestionario",
    description: "Visualiza distribuciones, tendencias y brechas del cuestionario para lectura rapida.",
    objective: "Transformar la tabulacion en graficos que permitan comparar dimensiones y detectar focos criticos.",
    inputs: ["Totales de tabulacion.", "Agrupacion por dimension.", "Escalas de respuesta.", "Cantidad de registros.", "Criterios de interpretacion."],
    process: ["Construye barras, porcentajes o distribuciones.", "Compara dimensiones.", "Resalta respuestas desfavorables.", "Facilita lectura ejecutiva."],
    outputs: ["Graficos por pregunta.", "Graficos por dimension.", "Indicadores visuales de brecha.", "Insumo para resultados."],
    validations: ["Cada grafico debe venir de un rango definido.", "Los porcentajes deben sumar 100% cuando aplique.", "Los titulos deben indicar pregunta, dimension y base de respuestas."],
    fields: [
      { name: "Grafico", detail: "Visual asociado a pregunta o dimension.", use: "Lectura rapida." },
      { name: "Rango fuente", detail: "Celdas tomadas de tabulacion.", use: "Mantiene trazabilidad." },
      { name: "Base n", detail: "Cantidad de respuestas.", use: "Evalua representatividad." },
      { name: "Interpretacion", detail: "Mensaje clave del grafico.", use: "Conecta visual con decision." },
    ],
    from: "Tabulacion Cuestionario.",
    to: "Resultados del Diagnostico y triangulaciones.",
  },
  {
    id: "entrevistas",
    label: "10. Entrevistas",
    sheet: "10. Entrevista Lideres",
    icon: Brain,
    title: "Entrevista a lideres",
    description: "Registro cualitativo para entender causas, percepciones y barreras de gestion en seguridad.",
    objective: "Capturar evidencia narrativa de lideres y contrastarla con datos, campo y documentos.",
    inputs: ["Guia de entrevista.", "Rol del entrevistado.", "Respuesta textual.", "Dimension relacionada.", "Evidencia o ejemplo entregado."],
    process: ["Codifica respuestas por dimension.", "Identifica patrones repetidos.", "Separa percepcion, causa y evidencia.", "Detecta barreras de liderazgo o estructura."],
    outputs: ["Hallazgos cualitativos.", "Citas sintetizadas.", "Causas probables.", "Insumos para triangulacion."],
    validations: ["No publicar datos sensibles innecesarios.", "Cada conclusion debe apoyarse en mas de una respuesta o evidencia.", "Diferenciar opinion aislada de patron recurrente."],
    fields: [
      { name: "Rol", detail: "Cargo o nivel del entrevistado.", use: "Segmenta percepciones." },
      { name: "Pregunta", detail: "Consulta realizada.", use: "Mantiene consistencia." },
      { name: "Respuesta sintetizada", detail: "Idea principal sin ruido.", use: "Facilita analisis." },
      { name: "Codigo / dimension", detail: "LV, TE u OE.", use: "Conecta entrevista con triangulacion." },
    ],
    from: "Guia de entrevista y lideres participantes.",
    to: "Triangulaciones LV, TE, OE y Resultados.",
  },
  {
    id: "lv-triang",
    label: "11. LV Triang.",
    sheet: "11. Liderazgo Visible Trian",
    icon: TrendingUp,
    title: "Triangulacion: liderazgo visible",
    description: "Cruza documentos, campo, cuestionario y entrevistas para validar liderazgo visible.",
    objective: "Confirmar si los hallazgos de liderazgo son consistentes entre fuentes o si existe una brecha de percepcion.",
    inputs: ["LV Doc/Cam.", "Resultados del cuestionario.", "Entrevistas.", "Observaciones de campo.", "Criterios de calificacion."],
    process: ["Compara lo declarado, lo documentado y lo observado.", "Marca coincidencias y contradicciones.", "Asigna severidad por recurrencia y riesgo.", "Redacta conclusion integrada."],
    outputs: ["Conclusion LV triangulada.", "Brechas priorizadas de liderazgo.", "Evidencia cruzada.", "Recomendaciones para lideres."],
    validations: ["Una conclusion debe tener minimo dos fuentes coherentes.", "Las contradicciones deben quedar visibles.", "La severidad debe justificarse por evidencia y riesgo."],
    fields: [
      { name: "Hallazgo LV", detail: "Brecha o fortaleza detectada.", use: "Objeto de triangulacion." },
      { name: "Fuente documental", detail: "Registro que respalda o contradice.", use: "Sostiene trazabilidad." },
      { name: "Fuente campo/cuestionario", detail: "Dato observado o respuesta.", use: "Valida comportamiento." },
      { name: "Conclusion", detail: "Lectura integrada.", use: "Alimenta resultados." },
    ],
    from: "LV Doc/Cam, tabulacion, graficos y entrevistas.",
    to: "Resultados del Diagnostico y plan de accion LV.",
  },
  {
    id: "te-triang",
    label: "12. TE Triang.",
    sheet: "12. Trabajo en equipo Triang",
    icon: UsersRound,
    title: "Triangulacion: trabajo en equipo",
    description: "Integra evidencia sobre coordinacion, comunicacion, soporte y aprendizaje entre equipos.",
    objective: "Determinar si las fallas de trabajo en equipo son eventos puntuales o patrones del sistema operativo.",
    inputs: ["TE Doc/Cam.", "Cuestionario.", "Entrevistas.", "Observacion de reuniones y frentes.", "Criterios."],
    process: ["Cruza coordinacion formal con practica real.", "Evalua si acuerdos se ejecutan.", "Identifica fricciones entre areas.", "Prioriza causas por impacto operativo."],
    outputs: ["Conclusion TE triangulada.", "Brechas de coordinacion.", "Acciones para rutinas de equipo.", "Riesgos de variabilidad operacional."],
    validations: ["No concluir solo por percepcion.", "Las brechas deben poder ubicarse en rutina, rol o proceso.", "Los acuerdos deben tener seguimiento verificable."],
    fields: [
      { name: "Hallazgo TE", detail: "Problema de coordinacion o colaboracion.", use: "Base del analisis." },
      { name: "Evidencia de rutina", detail: "Reunion, permiso, acta o seguimiento.", use: "Comprueba disciplina." },
      { name: "Percepcion", detail: "Senal del cuestionario o entrevista.", use: "Contrasta experiencia del equipo." },
      { name: "Accion sugerida", detail: "Mejora concreta de equipo.", use: "Alimenta plan de accion." },
    ],
    from: "TE Doc/Cam, cuestionario, graficos y entrevistas.",
    to: "Resultados del Diagnostico y plan de accion TE.",
  },
  {
    id: "oe-triang",
    label: "13. OE Triang.",
    sheet: "13. Org. y estruc. Triang",
    icon: Layers,
    title: "Triangulacion: organizacion y estructura",
    description: "Integra evidencia sobre responsabilidades, autoridad, recursos y seguimiento.",
    objective: "Definir si las brechas vienen de comportamiento individual o de estructura, proceso y gobierno.",
    inputs: ["OE Doc/Cam.", "Entrevistas.", "Seguimiento de acciones.", "Cuestionario.", "Evidencia de escalamiento."],
    process: ["Contrasta roles formales con ejecucion.", "Identifica bloqueos de autoridad o recursos.", "Verifica cierre de acciones.", "Separa sintomas operativos de causas estructurales."],
    outputs: ["Conclusion OE triangulada.", "Brechas sistemicas.", "Riesgos de gobierno.", "Acciones de estructura y seguimiento."],
    validations: ["Cada brecha estructural debe tener evidencia de impacto.", "El responsable debe quedar claro.", "No atribuir a personas lo que corresponde a proceso o estructura."],
    fields: [
      { name: "Brecha OE", detail: "Falla de rol, proceso, recurso o gobierno.", use: "Define causa sistemica." },
      { name: "Responsable", detail: "Dueno del cierre.", use: "Evita acciones sin propiedad." },
      { name: "Evidencia de impacto", detail: "Consecuencia observada.", use: "Justifica prioridad." },
      { name: "Control propuesto", detail: "Cambio esperado.", use: "Conecta diagnostico con mejora." },
    ],
    from: "OE Doc/Cam, entrevistas, cuestionario y seguimiento.",
    to: "Resultados del Diagnostico y plan de accion OE.",
  },
  {
    id: "cuestionario-dim",
    label: "14. Dimension",
    sheet: "14. Cuestionario x dimension",
    icon: ShieldCheck,
    title: "Cuestionario por dimension",
    description: "Agrupa preguntas y resultados por dimension para ver donde se concentra la debilidad.",
    objective: "Convertir respuestas individuales en una lectura comparativa por dimension del modelo.",
    inputs: ["Preguntas clasificadas.", "Respuesta tabulada.", "Dimension asignada.", "Cantidad de participantes.", "Criterios de lectura."],
    process: ["Agrupa items por LV, TE y OE.", "Calcula promedios o distribuciones por dimension.", "Identifica preguntas criticas.", "Ordena dimensiones por prioridad."],
    outputs: ["Resultado por dimension.", "Preguntas criticas.", "Comparativo LV/TE/OE.", "Insumo para resultados y triangulacion."],
    validations: ["Cada pregunta debe pertenecer a una dimension.", "No duplicar preguntas en dimensiones distintas salvo regla explicita.", "La base de participantes debe coincidir con tabulacion."],
    fields: [
      { name: "Dimension", detail: "LV, TE u OE.", use: "Agrupa resultados." },
      { name: "Pregunta", detail: "Item del cuestionario.", use: "Explica la dimension." },
      { name: "Resultado", detail: "Puntaje, frecuencia o porcentaje.", use: "Mide percepcion." },
      { name: "Prioridad", detail: "Criticidad de la brecha.", use: "Ordena acciones." },
    ],
    from: "Tabulacion Cuestionario.",
    to: "Graficos, triangulacion y resultados.",
  },
  {
    id: "poblacion",
    label: "Poblac. y muestra",
    sheet: "Poblac y Muestra",
    icon: Target,
    title: "Poblacion y muestra",
    description: "Controla representatividad: quienes participaron, de que areas y con que cobertura.",
    objective: "Saber si los datos levantados representan razonablemente a la organizacion evaluada.",
    inputs: ["Poblacion total.", "Muestra encuestada.", "Areas.", "Roles.", "Turnos o guardias.", "Cantidad de respuestas validas."],
    process: ["Compara poblacion contra muestra.", "Calcula cobertura.", "Identifica sesgos por rol o area.", "Define advertencias de interpretacion."],
    outputs: ["Cobertura de muestra.", "Segmentos subrepresentados.", "Base n para graficos.", "Nota de confiabilidad del diagnostico."],
    validations: ["La muestra debe coincidir con registros validos.", "Roles criticos no deben quedar fuera.", "Si hay baja cobertura, resultados deben interpretarse con cautela."],
    fields: [
      { name: "Segmento", detail: "Area, rol o turno.", use: "Evalua cobertura." },
      { name: "Poblacion", detail: "Universo esperado.", use: "Base de comparacion." },
      { name: "Muestra", detail: "Participantes reales.", use: "Mide representatividad." },
      { name: "Cobertura", detail: "Porcentaje de participacion.", use: "Califica confianza del dato." },
    ],
    from: "Listado de personal, areas y respuestas recibidas.",
    to: "Tabulacion, graficos y nota metodologica de resultados.",
  },
];

const flowSteps = [
  "Parametros",
  "Criterios",
  "Doc/Cam",
  "Cuestionario",
  "Entrevistas",
  "Triangulacion",
  "Resultados",
];

const kpis = [
  { label: "Registros", value: "526", detail: "base cargada", icon: ClipboardCheck },
  { label: "Tabs", value: "15", detail: "flujo Excel", icon: Layers },
  { label: "Dimensiones", value: "3", detail: "LV, TE y OE", icon: ShieldCheck },
  { label: "Estado", value: "REACTIVO", detail: "resultado final", icon: Activity },
];

const chartColors = ["#0f766e", "#2563eb", "#f59e0b", "#dc2626", "#7c3aed"];

const chartByTab: Record<string, { title: string; type: ChartType; data: Record<string, string | number>[] }> = {
  inicio: {
    title: "Avance por fuente del diagnostico",
    type: "bar",
    data: [
      { name: "Doc", valor: 72 },
      { name: "Campo", valor: 61 },
      { name: "Cuest.", valor: 100 },
      { name: "Entr.", valor: 84 },
      { name: "Triang.", valor: 100 },
    ],
  },
  abreviaturas: {
    title: "Uso de terminos por bloque",
    type: "pie",
    data: [
      { name: "Dimensiones", valor: 3 },
      { name: "Fuentes", valor: 4 },
      { name: "Estados", valor: 5 },
      { name: "Roles", valor: 6 },
    ],
  },
  criterios: {
    title: "Escala de madurez usada para calificar",
    type: "bar",
    data: [
      { name: "Reactivo", valor: 20 },
      { name: "Basico", valor: 40 },
      { name: "Gestionado", valor: 60 },
      { name: "Preventivo", valor: 80 },
      { name: "Lider", valor: 100 },
    ],
  },
  "lv-doc-cam": {
    title: "Liderazgo visible: doc vs campo",
    type: "bar",
    data: [
      { name: "Rutinas", doc: 44, campo: 28 },
      { name: "Presencia", doc: 51, campo: 22 },
      { name: "Feedback", doc: 35, campo: 18 },
      { name: "Cierre", doc: 39, campo: 16 },
    ],
  },
  "te-doc-cam": {
    title: "Trabajo en equipo: evidencia comparada",
    type: "bar",
    data: [
      { name: "Reunion", doc: 62, campo: 38 },
      { name: "Permisos", doc: 58, campo: 42 },
      { name: "Traspaso", doc: 34, campo: 24 },
      { name: "Acuerdos", doc: 41, campo: 26 },
    ],
  },
  "oe-doc-cam": {
    title: "Organizacion: estructura contra ejecucion",
    type: "bar",
    data: [
      { name: "Roles", doc: 67, campo: 45 },
      { name: "RACI", doc: 46, campo: 30 },
      { name: "Escala", doc: 37, campo: 22 },
      { name: "Cierre", doc: 33, campo: 19 },
    ],
  },
  resultados: {
    title: "Resultado consolidado por dimension",
    type: "radar",
    data: [
      { name: "LV", valor: 18, objetivo: 70 },
      { name: "TE", valor: 24, objetivo: 70 },
      { name: "OE", valor: 19, objetivo: 70 },
      { name: "Muestra", valor: 58, objetivo: 70 },
      { name: "Triang.", valor: 31, objetivo: 70 },
    ],
  },
  tabulacion: {
    title: "Tabulacion: respuestas procesadas",
    type: "line",
    data: [
      { name: "P1", valor: 526 },
      { name: "P2", valor: 526 },
      { name: "P3", valor: 526 },
      { name: "P4", valor: 526 },
      { name: "P5", valor: 526 },
    ],
  },
  graficos: {
    title: "Concentracion de brechas por dimension",
    type: "bar",
    data: [
      { name: "LV", valor: 82 },
      { name: "TE", valor: 76 },
      { name: "OE", valor: 81 },
      { name: "Global", valor: 80 },
    ],
  },
  entrevistas: {
    title: "Temas recurrentes en entrevistas",
    type: "bar",
    data: [
      { name: "Lider.", valor: 31 },
      { name: "Coord.", valor: 26 },
      { name: "Roles", valor: 23 },
      { name: "Cierre", valor: 20 },
    ],
  },
  "lv-triang": {
    title: "Triangulacion LV por fuente",
    type: "pie",
    data: [
      { name: "Doc", valor: 24 },
      { name: "Campo", valor: 32 },
      { name: "Cuest.", valor: 26 },
      { name: "Entr.", valor: 18 },
    ],
  },
  "te-triang": {
    title: "Triangulacion TE por fuente",
    type: "pie",
    data: [
      { name: "Doc", valor: 28 },
      { name: "Campo", valor: 27 },
      { name: "Cuest.", valor: 25 },
      { name: "Entr.", valor: 20 },
    ],
  },
  "oe-triang": {
    title: "Triangulacion OE por fuente",
    type: "pie",
    data: [
      { name: "Doc", valor: 34 },
      { name: "Campo", valor: 21 },
      { name: "Cuest.", valor: 18 },
      { name: "Entr.", valor: 27 },
    ],
  },
  "cuestionario-dim": {
    title: "Cuestionario agrupado por dimension",
    type: "bar",
    data: [
      { name: "LV", favorable: 18, brecha: 82 },
      { name: "TE", favorable: 24, brecha: 76 },
      { name: "OE", favorable: 19, brecha: 81 },
    ],
  },
  poblacion: {
    title: "Cobertura de muestra por segmento",
    type: "bar",
    data: [
      { name: "Oper.", valor: 58 },
      { name: "Mant.", valor: 52 },
      { name: "Sup.", valor: 64 },
      { name: "Seg.", valor: 49 },
    ],
  },
};

const excelRowsByTab: Record<string, ExcelRow[]> = {
  criterios: [
    { code: "C-01", item: "Evidencia suficiente", source: "Doc/Cam", value: ">= 80%", status: "OK" },
    { code: "C-02", item: "Evidencia parcial", source: "Doc/Cam", value: "40% - 79%", status: "BRECHA" },
    { code: "C-03", item: "Evidencia baja", source: "Cuestionario", value: "< 40%", status: "REACTIVO" },
    { code: "C-04", item: "Brecha critica", source: "Triangulacion", value: "Prioridad alta", status: "REACTIVO" },
  ],
  resultados: [
    { code: "R-01", item: "Liderazgo visible", source: "LV + triang.", value: "18%", status: "REACTIVO" },
    { code: "R-02", item: "Trabajo en equipo", source: "TE + triang.", value: "24%", status: "REACTIVO" },
    { code: "R-03", item: "Organizacion y estructura", source: "OE + triang.", value: "19%", status: "REACTIVO" },
    { code: "R-04", item: "Resultado global", source: "Consolidado", value: "20%", status: "REACTIVO" },
  ],
  tabulacion: [
    { code: "T-01", item: "Registros importados", source: "Google Sheets", value: "526", status: "OK" },
    { code: "T-02", item: "Preguntas tabuladas", source: "Cuestionario", value: "125", status: "OK" },
    { code: "T-03", item: "Formula total", source: "Excel", value: "SUM(N:AQ)", status: "OK" },
    { code: "T-04", item: "Lectura final", source: "Resultados", value: "REACTIVO", status: "REACTIVO" },
  ],
  poblacion: [
    { code: "P-01", item: "Operaciones", source: "Personal", value: "58%", status: "BRECHA" },
    { code: "P-02", item: "Mantenimiento", source: "Personal", value: "52%", status: "BRECHA" },
    { code: "P-03", item: "Supervision", source: "Personal", value: "64%", status: "OK" },
    { code: "P-04", item: "Seguridad", source: "Personal", value: "49%", status: "BRECHA" },
  ],
};

const getExcelRows = (tab: ProtocolTab): ExcelRow[] => {
  if (excelRowsByTab[tab.id]) return excelRowsByTab[tab.id];

  if (tab.id.includes("doc-cam")) {
    return [
      { code: "DC-01", item: "Documento revisado", source: tab.sheet, value: "Parcial", status: "BRECHA" },
      { code: "DC-02", item: "Campo observado", source: "Frente operativo", value: "Bajo", status: "REACTIVO" },
      { code: "DC-03", item: "Consistencia Doc/Cam", source: "Cruce", value: "No consistente", status: "REACTIVO" },
      { code: "DC-04", item: "Hallazgo trazable", source: "Evidencia", value: "Si", status: "OK" },
    ];
  }

  if (tab.id.includes("triang")) {
    return [
      { code: "TR-01", item: "Documento", source: "Doc/Cam", value: "Parcial", status: "BRECHA" },
      { code: "TR-02", item: "Campo", source: "Observacion", value: "Bajo", status: "REACTIVO" },
      { code: "TR-03", item: "Cuestionario", source: "Tabulacion", value: "Brecha alta", status: "REACTIVO" },
      { code: "TR-04", item: "Entrevista", source: "Lideres", value: "Patron recurrente", status: "BRECHA" },
    ];
  }

  return tab.fields.map((field, index) => ({
    code: `${tab.label.split(".")[0].padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
    item: field.name,
    source: field.detail,
    value: field.use,
    status: index === 0 ? "OK" : index === 1 ? "BRECHA" : "REACTIVO",
  }));
};

const SectionList = ({ title, items }: { title: string; items: string[] }) => (
  <Card className="border-border/50 shadow-none">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-black uppercase tracking-wider">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
          <span>{item}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const statusClass = {
  OK: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
  BRECHA: "bg-amber-500/15 text-amber-800 border-amber-500/20",
  REACTIVO: "bg-red-500/15 text-red-700 border-red-500/20",
};

const FormulaBar = ({ tab }: { tab: ProtocolTab }) => (
  <div className="grid gap-2 border-b border-border/50 bg-muted/40 p-3 md:grid-cols-[110px_minmax(0,1fr)]">
    <div className="flex items-center gap-2 rounded-md border border-border/50 bg-background px-3 py-2 text-xs font-black text-muted-foreground">
      <Calculator className="h-4 w-4 text-primary" />
      FX
    </div>
    <div className="rounded-md border border-border/50 bg-background px-3 py-2 font-mono text-xs leading-5 text-muted-foreground">
      =CONSOLIDAR({tab.sheet}; datos + evidencia + criterios) =&gt; resultado explicable
    </div>
  </div>
);

const MiniChart = ({ config }: { config: { title: string; type: ChartType; data: Record<string, string | number>[] } }) => {
  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black">{config.title}</CardTitle>
        <CardDescription className="text-xs">Grafico de apoyo para interpretar la hoja.</CardDescription>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          {config.type === "line" ? (
            <LineChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          ) : config.type === "pie" ? (
            <PieChart>
              <Tooltip />
              <Pie data={config.data} dataKey="valor" nameKey="name" innerRadius={48} outerRadius={88} paddingAngle={3}>
                {config.data.map((entry, index) => (
                  <Cell key={String(entry.name)} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : config.type === "radar" ? (
            <RadarChart data={config.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" fontSize={11} />
              <Tooltip />
              <Radar dataKey="objetivo" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
              <Radar dataKey="valor" stroke="#dc2626" fill="#dc2626" fillOpacity={0.28} />
            </RadarChart>
          ) : (
            <BarChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              {"doc" in config.data[0] ? (
                <>
                  <Bar dataKey="doc" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="campo" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </>
              ) : "favorable" in config.data[0] ? (
                <>
                  <Bar dataKey="favorable" stackId="a" fill="#0f766e" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="brecha" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </>
              ) : (
                <Bar dataKey="valor" fill="#2563eb" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ExcelPreview = ({ tab }: { tab: ProtocolTab }) => {
  const rows = getExcelRows(tab);
  const chartConfig = chartByTab[tab.id] || chartByTab.inicio;

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b border-border/50 bg-slate-50 pb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg font-black">Vista tipo Excel: {tab.sheet}</CardTitle>
            <CardDescription>Tabla, formula y grafico que muestran como se llega al resultado del tab.</CardDescription>
          </div>
          <Badge className="w-fit bg-red-500/10 text-red-700 hover:bg-red-500/10">Resultado conectado: REACTIVO</Badge>
        </div>
      </CardHeader>
      <FormulaBar tab={tab} />
      <CardContent className="p-0">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1.35fr)_420px]">
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[54px_120px_minmax(180px,1fr)_minmax(180px,1fr)_180px_130px] border-b border-border/50 bg-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-600">
                <div className="border-r border-border/50 p-2 text-center">#</div>
                <div className="border-r border-border/50 p-2">A Codigo</div>
                <div className="border-r border-border/50 p-2">B Indicador</div>
                <div className="border-r border-border/50 p-2">C Fuente / evidencia</div>
                <div className="border-r border-border/50 p-2">D Valor</div>
                <div className="p-2">E Estado</div>
              </div>
              {rows.map((row, index) => (
                <div
                  key={`${row.code}-${row.item}`}
                  className="grid grid-cols-[54px_120px_minmax(180px,1fr)_minmax(180px,1fr)_180px_130px] border-b border-border/40 text-sm"
                >
                  <div className="border-r border-border/40 bg-slate-50 p-3 text-center text-xs font-black text-slate-500">{index + 1}</div>
                  <div className="border-r border-border/40 p-3 font-mono text-xs font-bold text-slate-700">{row.code}</div>
                  <div className="border-r border-border/40 p-3 font-semibold leading-6">{row.item}</div>
                  <div className="border-r border-border/40 p-3 leading-6 text-muted-foreground">{row.source}</div>
                  <div className="border-r border-border/40 p-3 font-bold text-slate-700">{row.value}</div>
                  <div className="p-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black ${statusClass[row.status]}`}>
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[54px_120px_minmax(180px,1fr)_minmax(180px,1fr)_180px_130px] bg-amber-50 text-sm">
                <div className="border-r border-border/40 p-3 text-center text-xs font-black text-amber-800">{rows.length + 1}</div>
                <div className="border-r border-border/40 p-3 font-mono text-xs font-black text-amber-800">TOTAL</div>
                <div className="border-r border-border/40 p-3 font-black text-amber-900">Lectura consolidada</div>
                <div className="border-r border-border/40 p-3 font-semibold text-amber-900">Criterio + evidencia + tendencia</div>
                <div className="border-r border-border/40 p-3 font-black text-amber-900">20%</div>
                <div className="p-3">
                  <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/15 px-2.5 py-1 text-[10px] font-black text-red-700">
                    REACTIVO
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 p-4 xl:border-l xl:border-t-0">
            <MiniChart config={chartConfig} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProtocoloDiagnosticoPage = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">Raura</Badge>
              <Badge variant="outline">Protocolo de diagnostico</Badge>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">Protocolo Diagnostico</h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-muted-foreground">
                Vista detallada del flujo del Excel. Cada tab indica que datos contiene, de donde vienen, como se revisan,
                que salida genera y a que parte del diagnostico alimenta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
            {kpis.map((item) => (
              <Card key={item.label} className="border-border/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                  </div>
                  <p className="mt-3 text-2xl font-black leading-none tracking-tight">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black tracking-tight">Conexion general del proceso</CardTitle>
          <CardDescription>El protocolo funciona como una cadena: si una etapa esta incompleta, el resultado pierde trazabilidad.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-7">
            {flowSteps.map((step, index) => (
              <div key={step} className="rounded-lg border border-border/60 bg-background p-3">
                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-black text-primary">
                  {index + 1}
                </div>
                <p className="text-sm font-black leading-tight">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="criterios" className="space-y-5">
        <div className="overflow-x-auto rounded-xl border border-border/50 bg-muted/40 p-1">
          <TabsList className="h-auto min-w-max justify-start gap-1 bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="gap-2 rounded-lg px-3 py-2 text-xs font-black data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            <div className="space-y-5">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
                        <tab.icon className="h-5 w-5 text-primary" />
                        {tab.title}
                      </CardTitle>
                      <CardDescription className="mt-2 max-w-4xl leading-6">{tab.description}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{tab.sheet}</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Detalle operativo</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Objetivo del tab</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{tab.objective}</p>
                  </div>
                </CardContent>
              </Card>

              <ExcelPreview tab={tab} />

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <SectionList title="Datos que entran" items={tab.inputs} />
                    <SectionList title="Revision / calculo" items={tab.process} />
                    <SectionList title="Salida esperada" items={tab.outputs} />
                  </div>

                  <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-black">Estructura que debe verse en este tab</CardTitle>
                      <CardDescription>Campos recomendados para que la informacion no quede como texto suelto.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-hidden rounded-xl border border-border/50">
                        <div className="grid grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] bg-muted/60 text-xs font-black uppercase tracking-wider text-muted-foreground">
                          <div className="p-3">Campo</div>
                          <div className="p-3">Que registra</div>
                          <div className="p-3">Para que sirve</div>
                        </div>
                        {tab.fields.map((field) => (
                          <div
                            key={field.name}
                            className="grid grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] border-t border-border/50 text-sm"
                          >
                            <div className="p-3 font-black text-foreground">{field.name}</div>
                            <div className="p-3 leading-6 text-muted-foreground">{field.detail}</div>
                            <div className="p-3 leading-6 text-muted-foreground">{field.use}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-5">
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-black">
                        <Link2 className="h-4 w-4 text-primary" />
                        Conexion del tab
                      </CardTitle>
                      <CardDescription>De donde recibe informacion y que hoja alimenta.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-border/50 bg-background p-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recibe de</p>
                        <p className="mt-1 text-sm font-semibold leading-6">{tab.from}</p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-background p-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Alimenta a</p>
                        <p className="mt-1 text-sm font-semibold leading-6">{tab.to}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-black">Validaciones clave</CardTitle>
                      <CardDescription>Reglas para que el contenido sea confiable.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tab.validations.map((item) => (
                        <div key={item} className="rounded-lg bg-amber-500/10 p-3 text-sm font-semibold leading-6 text-amber-800">
                          {item}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-black">Estado de implementacion</CardTitle>
                      <CardDescription>Contenido documentado para la vista Raura.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest">
                        <span>Detalle del tab</span>
                        <span className="text-primary">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProtocoloDiagnosticoPage;
