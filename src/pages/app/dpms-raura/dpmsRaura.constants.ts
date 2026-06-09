import { DASHBOARD_PALETTES } from "@/lib/dashboard-configs";

export const SHEET_ID = "1-yiLe8BFRiw8XbUyn9vdl2e2M3y7ENYQXgKajhEBwUA";

export const DPMS_RAURA_TABLE_COLUMN_WIDTHS = [
  90, 200, 140, 250, 220, 260, 170, 130,
];

export const DPMS_RAURA_TABLE_WIDTH = 1460;

export const CAT_COLORS = DASHBOARD_PALETTES.rauraCategories;

export const DIMENSION_DEFINITIONS: Record<string, Record<string, string>> = {
  cultura: {
    REACTIVA: "Actuación basada en la respuesta a incidentes, sin enfoque preventivo.",
    DEPENDIENTE: "Cumplimiento de normas mediante supervisión y control externo.",
    INDEPENDIENTE: "Conducta guiada por la responsabilidad y autocontrol individual.",
    INTERDEPENDIENTE: "Cultura de compromiso colectivo y cuidado mutuo.",
  },
  rolEquipo: {
    ACCION: "Ejecución y cumplimiento de tareas.",
    SOCIALES: "Colaboración y cohesión del equipo.",
    MENTALES: "Análisis, ideas y toma de decisiones.",
  },
  comunicacion: {
    ASERTIVA: "Expresa ideas con claridad y respeto.",
    FUNCIONAL: "Orientada al cumplimiento de tareas y objetivos.",
    DIRECTA: "Mensajes claros, concretos y sin ambigüedades.",
    COLABORATIVA: "Promueve participación y trabajo en equipo.",
  },
  percepcion: {
    REACTIVO: "Actúa solo cuando ocurre un incidente o problema. No anticipa riesgos.",
    "NORMATIVO-PREVENTIVO": "Cumple normas de seguridad establecidas, sin mayor análisis personal.",
    "CAUTELOSO ANALITICO": "Evalúa los riesgos antes de actuar y analiza consecuencias.",
    "PROACTIVO-PREVENTIVO": "Se anticipa a los riesgos, propone mejoras y promueve la seguridad.",
  },
  liderazgo: {
    SOPORTE: "El líder acompaña al equipo, facilita recursos y refuerza el trabajo.",
    EMPOWERMENT: "El líder delega autoridad y autonomía, fomentando la responsabilidad.",
    COACHING: "El líder guía y desarrolla a las personas mediante retroalimentación.",
    DIRECTIVO: "El líder da instrucciones claras y controla la ejecución de tareas.",
  },
  motivacion: {
    INTRINSECA: "Impulso interno orientado al interés, desarrollo personal y logro.",
    EXTRINSECA: "Impulso generado por factores externos como reconocimiento o estabilidad.",
  },
};

export const FINAL_RAURA_REPORT = {
  surveyRecords: 526,
  validResponses: 14949,
  perception: 79.4,
  unsafeAct: 48.33,
  riskManagement: 51.67,
  effectiveLeadership: 60,
  declaredLeadership: 97.5,
  trainingMina: 61,
  trainingPlanta: 53,
  gescam: 85,
  dpmsDone: 16,
  dpmsPending: 10,
  validatedLevel: "Reactivo",
  transition: "Tránsito incipiente a Dependiente",
  verdictScore: 48.33,
};

export const FINAL_RAURA_KPIS = [
  {
    label: "Encuestas analizadas",
    value: FINAL_RAURA_REPORT.surveyRecords,
    detail: `${FINAL_RAURA_REPORT.validResponses.toLocaleString("es-PE")} respuestas válidas`,
    color: "#2563eb",
  },
  {
    label: "Percepción global",
    value: `${FINAL_RAURA_REPORT.perception.toFixed(2)}%`,
    detail: "Favorable, no valida madurez por sí sola",
    color: "#0ea5e9",
  },
  {
    label: "Conducta ante acto inseguro",
    value: `${FINAL_RAURA_REPORT.unsafeAct.toFixed(2)}%`,
    detail: "Indicador conductual más crítico",
    color: "#dc2626",
  },
  {
    label: "Gestión ante riesgo",
    value: `${FINAL_RAURA_REPORT.riskManagement.toFixed(2)}%`,
    detail: "Falla casi en la mitad de los casos",
    color: "#ea580c",
  },
];

export const FINAL_RAURA_BARS = [
  { name: "Percepción", value: FINAL_RAURA_REPORT.perception, color: "#2563eb" },
  { name: "Acto inseguro", value: FINAL_RAURA_REPORT.unsafeAct, color: "#dc2626" },
  { name: "Gestión riesgo", value: FINAL_RAURA_REPORT.riskManagement, color: "#ea580c" },
  { name: "Liderazgo riesgo", value: FINAL_RAURA_REPORT.effectiveLeadership, color: "#f59e0b" },
  { name: "Q6 declarado", value: FINAL_RAURA_REPORT.declaredLeadership, color: "#16a34a" },
  { name: "GESCAM", value: FINAL_RAURA_REPORT.gescam, color: "#64748b" },
];

export const FINAL_RAURA_TRISAFE = [
  { condition: "Poder", value: 70, status: "Parcial", evidence: "Sistema formal OK, con brechas puntuales en campo", color: "#2563eb" },
  { condition: "Saber", value: 57, status: "Crítico", evidence: "Capacitación Mina 61% / Planta 53%", color: "#ea580c" },
  { condition: "Querer", value: 48, status: "Crítico", evidence: "Bajo refuerzo, comunicación y seguridad psicológica", color: "#dc2626" },
];

export const FINAL_RAURA_LOW_ITEMS = [
  { name: "Q20 Buzón / ideas", value: 70.5, color: "#dc2626" },
  { name: "Q23 Reconocimiento", value: 71.71, color: "#ea580c" },
  { name: "Q21 Comité SSO", value: 73.26, color: "#f59e0b" },
  { name: "Q1 Líderes compromiso", value: 74.17, color: "#f59e0b" },
  { name: "Q28 Infraestructura", value: 74.28, color: "#f59e0b" },
  { name: "Q22 Proponer mejoras", value: 74.5, color: "#f59e0b" },
];

export const FINAL_RAURA_FOLLOW_UP = [
  { name: "Acto inseguro", base: 48.33, goal6: 68, goal12: 75 },
  { name: "Gestión riesgo", base: 51.67, goal6: 68, goal12: 75 },
  { name: "Liderazgo riesgo", base: 60, goal6: 75, goal12: 85 },
  { name: "Reconocimiento", base: 71.71, goal6: 80, goal12: 85 },
  { name: "Comunicación", base: 70.5, goal6: 78, goal12: 85 },
  { name: "Capacitación", base: 57, goal6: 85, goal12: 95 },
];

export const FINAL_RAURA_INTERVENTIONS = [
  "Observación conductual: 3 observaciones por guardia",
  "Caminatas de liderazgo: 2 por semana con compromisos cerrados",
  "Microintervenciones de percepción de riesgo en campo",
  "Refuerzo positivo por detener, reportar y corregir",
  "Alertas sin Culpa y espacios de escucha protegida",
  "Cerrar brecha de capacitación Mina / Planta",
  "Completar 10 entrevistas DPMS pendientes",
  "Cerrar hallazgos técnicos con evidencia fotográfica",
];
