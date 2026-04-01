import { EvaluatedPerson, RadarDataItem, BarDataItem, ComparisonRadarItem, ResultItem, WorkGroup, TeamMember, EvaluationLog } from "../types";
import { Activity, ShieldAlert, BrainCircuit, ClipboardList } from "lucide-react";

export const mockEvaluated: EvaluatedPerson[] = [
  { 
    id: 1, 
    name: "Juan Pérez", 
    status: "Completado", 
    score: 85, 
    group: "Operaciones Mina", 
    position: "Operador de Pala", 
    email: "juan.perez@mina.com",
    preDescription: "Juan inició con un desempeño sólido en tareas operativas, pero con oportunidades de mejora en comunicación asertiva y liderazgo de equipo.",
    postDescription: "Después del plan de acción, Juan ha demostrado una mejora significativa en la coordinación con su equipo y ha asumido un rol más proactivo en las reuniones de seguridad.",
    actionPlan: "Programa de Coaching en Liderazgo Operativo"
  },
  { 
    id: 2, 
    name: "María García", 
    status: "En curso", 
    score: 45, 
    group: "Seguridad Industrial", 
    position: "Ingeniera de Seguridad", 
    email: "maria.garcia@mina.com",
    preDescription: "María posee un alto nivel técnico. La evaluación inicial destaca la necesidad de mejorar el manejo de conflictos ante situaciones de alta presión.",
    postDescription: "Se observa una evolución positiva en su capacidad de mediación. El proceso continúa enfocado en la gestión del estrés.",
    actionPlan: "Taller de Resolución de Conflictos y Gestión del Estrés"
  },
  { 
    id: 3, 
    name: "Carlos López", 
    status: "Pendiente", 
    score: 0, 
    group: "Mantenimiento Planta", 
    position: "Técnico Mecánico", 
    email: "carlos.lopez@mina.com",
    preDescription: "Evaluación inicial pendiente de completar. Se requiere diagnóstico de competencias blandas.",
    postDescription: "N/A - En espera de evaluación inicial.",
    actionPlan: "Pendiente de asignar"
  },
  { 
    id: 4, 
    name: "Ana Martínez", 
    status: "Completado", 
    score: 92, 
    group: "Operaciones Mina", 
    position: "Supervisora", 
    email: "ana.martinez@mina.com",
    preDescription: "Ana destaca por su visión estratégica. El enfoque inicial fue potenciar su capacidad de delegación efectiva.",
    postDescription: "Ha logrado delegar tareas críticas con éxito, permitiéndole enfocarse en la optimización de procesos de mina.",
    actionPlan: "Mentoría en Alta Gerencia y Delegación"
  },
  { 
    id: 5, 
    name: "Pedro Ruiz", 
    status: "En curso", 
    score: 60, 
    group: "Logística", 
    position: "Chofer", 
    email: "pedro.ruiz@mina.com",
    preDescription: "Pedro muestra compromiso. La primera evaluación sugiere reforzar el conocimiento detallado de los protocolos de logística internacional.",
    postDescription: "Ha completado los módulos teóricos satisfactoriamente. Se encuentra en etapa de aplicación práctica.",
    actionPlan: "Especialización en Normativa Logística y Transporte"
  },
];

export const preRadarData: RadarDataItem[] = [
  { subject: 'Liderazgo', A: 70, B: 110, fullMark: 150 },
  { subject: 'Seguridad', A: 65, B: 130, fullMark: 150 },
  { subject: 'Comunicación', A: 60, B: 130, fullMark: 150 },
  { subject: 'Técnico', A: 90, B: 100, fullMark: 150 },
  { subject: 'Puntualidad', A: 85, B: 90, fullMark: 150 },
  { subject: 'Ética', A: 65, B: 85, fullMark: 150 },
];

export const postRadarData: RadarDataItem[] = [
  { subject: 'Liderazgo', A: 105, B: 110, fullMark: 150 },
  { subject: 'Seguridad', A: 125, B: 130, fullMark: 150 },
  { subject: 'Comunicación', A: 115, B: 130, fullMark: 150 },
  { subject: 'Técnico', A: 100, B: 100, fullMark: 150 },
  { subject: 'Puntualidad', A: 95, B: 90, fullMark: 150 },
  { subject: 'Ética', A: 85, B: 85, fullMark: 150 },
];

export const comparisonData: ComparisonRadarItem[] = preRadarData.map((item, i) => ({
  subject: item.subject,
  pre: item.A,
  post: postRadarData[i].A,
  fullMark: item.fullMark,
  target: item.B
}));

export const preBarData: BarDataItem[] = [
  { name: 'Ene', valor: 210 },
  { name: 'Feb', valor: 240 },
  { name: 'Mar', valor: 200 },
];

export const postBarData: BarDataItem[] = [
  { name: 'Ene', valor: 210 },
  { name: 'Feb', valor: 240 },
  { name: 'Mar', valor: 200 },
  { name: 'Abr', valor: 380 },
  { name: 'May', valor: 450 },
];

export const resultsData: ResultItem[] = [
  { id: "1", name: "Carlos Rodríguez", group: "Operaciones Mina", score: 85, status: "Completado", date: "2024-03-28", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
  { id: "2", name: "Juan Pérez", group: "Seguridad Industrial", score: 92, status: "Completado", date: "2024-03-27", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan" },
  { id: "3", name: "Miguel Ángel", group: "Mantenimiento Planta", score: 68, status: "En Revisión", date: "2024-03-26", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel" },
  { id: "4", name: "Ana Torres", group: "Operaciones Mina", score: 74, status: "Completado", date: "2024-03-25", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
  { id: "5", name: "Roberto Díaz", group: "Logística", score: 81, status: "Completado", date: "2024-03-25", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto" },
  { id: "6", name: "Elena Gómez", group: "Geología", score: 88, status: "Completado", date: "2024-03-24", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
  { id: "7", name: "Luis Martínez", group: "Mantenimiento Planta", score: 55, status: "En Progreso", date: "2024-03-24", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis" },
  { id: "8", name: "Sofía Rojas", group: "Seguridad Industrial", score: 95, status: "Completado", date: "2024-03-23", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia" },
];

export const groups: WorkGroup[] = [
  { id: '1', name: 'Operaciones Mina', icon: Activity, count: 24, color: 'text-blue-600 bg-blue-50' },
  { id: '2', name: 'Seguridad Industrial', icon: ShieldAlert, count: 12, color: 'text-emerald-600 bg-emerald-50' },
  { id: '3', name: 'Mantenimiento Planta', icon: BrainCircuit, count: 18, color: 'text-amber-600 bg-amber-50' },
  { id: '4', name: 'Logística', icon: ClipboardList, count: 15, color: 'text-indigo-600 bg-indigo-50' },
];

export const teamMembers: TeamMember[] = [
  { id: 'm1', name: 'Carlos Rodríguez', role: 'Operador de Jumbo', risk: 'Medio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos' },
  { id: 'm2', name: 'Juan Pérez', role: 'Perforista', risk: 'Alto', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan' },
  { id: 'm3', name: 'Miguel Ángel', role: 'Ayudante', risk: 'Bajo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel' },
  { id: 'm4', name: 'Roberto Díaz', role: 'Operador de Scoop', risk: 'Medio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto' },
];

export const evaluationLog: EvaluationLog[] = [
  { id: "E001", testName: "Batería de Riesgo Psicosocial", evaluatedName: "Juan Pérez", group: "Operaciones Mina", date: "2024-03-20", type: "PRE", status: "Completado" },
  { id: "E002", testName: "Evaluación de Clima Laboral", evaluatedName: "Maria García", group: "Seguridad Industrial", date: "2024-03-22", type: "POST", status: "En Proceso" },
  { id: "E003", testName: "Desempeño por Competencias", evaluatedName: "Carlos López", group: "Mantenimiento Planta", date: "2024-03-25", type: "PRE", status: "Expira Pronto" },
  { id: "E004", testName: "Habilidades Blandas 360", evaluatedName: "Ana Martínez", group: "Operaciones Mina", date: "2024-03-28", type: "PERIÓDICA", status: "Completado" },
];
