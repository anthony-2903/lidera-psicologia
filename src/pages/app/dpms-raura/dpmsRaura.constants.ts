import { DASHBOARD_PALETTES } from "@/lib/dashboard-configs";

export const SHEET_ID = "1-yiLe8BFRiw8XbUyn9vdl2e2M3y7ENYQXgKajhEBwUA";

export const DPMS_RAURA_TABLE_COLUMN_WIDTHS = [
  90, 200, 140, 250, 220, 260, 170, 130,
];

export const DPMS_RAURA_TABLE_WIDTH = 1460;

export const CAT_COLORS = DASHBOARD_PALETTES.rauraCategories;

export const DIMENSION_DEFINITIONS: Record<string, Record<string, string>> = {
  cultura: {
    REACTIVA: "Actuacion basada en la respuesta a incidentes, sin enfoque preventivo.",
    DEPENDIENTE: "Cumplimiento de normas mediante supervision y control externo.",
    INDEPENDIENTE: "Conducta guiada por la responsabilidad y autocontrol individual.",
    INTERDEPENDIENTE: "Cultura de compromiso colectivo y cuidado mutuo.",
  },
  rolEquipo: {
    ACCION: "Ejecucion y cumplimiento de tareas.",
    SOCIALES: "Colaboracion y cohesion del equipo.",
    MENTALES: "Analisis, ideas y toma de decisiones.",
  },
  comunicacion: {
    ASERTIVA: "Expresa ideas con claridad y respeto.",
    FUNCIONAL: "Orientada al cumplimiento de tareas y objetivos.",
    DIRECTA: "Mensajes claros, concretos y sin ambiguedades.",
    COLABORATIVA: "Promueve participacion y trabajo en equipo.",
  },
  percepcion: {
    REACTIVO: "Actua solo cuando ocurre un incidente o problema. No anticipa riesgos.",
    "NORMATIVO-PREVENTIVO": "Cumple normas de seguridad establecidas, sin mayor analisis personal.",
    "CAUTELOSO ANALITICO": "Evalua los riesgos antes de actuar y analiza consecuencias.",
    "PROACTIVO-PREVENTIVO": "Se anticipa a los riesgos, propone mejoras y promueve la seguridad.",
  },
  liderazgo: {
    SOPORTE: "El lider acompana al equipo, facilita recursos y refuerza el trabajo.",
    EMPOWERMENT: "El lider delega autoridad y autonomia, fomentando la responsabilidad.",
    COACHING: "El lider guia y desarrolla a las personas mediante retroalimentacion.",
    DIRECTIVO: "El lider da instrucciones claras y controla la ejecucion de tareas.",
  },
  motivacion: {
    INTRINSECA: "Impulso interno orientado al interes, desarrollo personal y logro.",
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
  transition: "Transito incipiente a Dependiente",
  verdictScore: 48.33,
};

export const FINAL_RAURA_KPIS = [
  {
    label: "Encuestas analizadas",
    value: FINAL_RAURA_REPORT.surveyRecords,
    detail: `${FINAL_RAURA_REPORT.validResponses.toLocaleString("es-PE")} respuestas validas`,
    color: "#2563eb",
  },
  {
    label: "Percepcion global",
    value: `${FINAL_RAURA_REPORT.perception.toFixed(2)}%`,
    detail: "Favorable, no valida madurez por si sola",
    color: "#0ea5e9",
  },
  {
    label: "Conducta ante acto inseguro",
    value: `${FINAL_RAURA_REPORT.unsafeAct.toFixed(2)}%`,
    detail: "Indicador conductual mas critico",
    color: "#dc2626",
  },
  {
    label: "Gestion ante riesgo",
    value: `${FINAL_RAURA_REPORT.riskManagement.toFixed(2)}%`,
    detail: "Falla casi en la mitad de los casos",
    color: "#ea580c",
  },
];

export const FINAL_RAURA_BARS = [
  { name: "Percepcion", value: FINAL_RAURA_REPORT.perception, color: "#2563eb" },
  { name: "Acto inseguro", value: FINAL_RAURA_REPORT.unsafeAct, color: "#dc2626" },
  { name: "Gestion riesgo", value: FINAL_RAURA_REPORT.riskManagement, color: "#ea580c" },
  { name: "Liderazgo riesgo", value: FINAL_RAURA_REPORT.effectiveLeadership, color: "#f59e0b" },
  { name: "Q6 declarado", value: FINAL_RAURA_REPORT.declaredLeadership, color: "#16a34a" },
  { name: "GESCAM", value: FINAL_RAURA_REPORT.gescam, color: "#64748b" },
];

export const FINAL_RAURA_TRISAFE = [
  { condition: "Poder", value: 70, status: "Parcial", evidence: "Sistema formal OK, con brechas puntuales en campo", color: "#2563eb" },
  { condition: "Saber", value: 57, status: "Critico", evidence: "Capacitacion Mina 61% / Planta 53%", color: "#ea580c" },
  { condition: "Querer", value: 48, status: "Critico", evidence: "Bajo refuerzo, comunicacion y seguridad psicologica", color: "#dc2626" },
];

export const FINAL_RAURA_LOW_ITEMS = [
  { name: "Q20 Buzon / ideas", value: 70.5, color: "#dc2626" },
  { name: "Q23 Reconocimiento", value: 71.71, color: "#ea580c" },
  { name: "Q21 Comite SSO", value: 73.26, color: "#f59e0b" },
  { name: "Q1 Lideres compromiso", value: 74.17, color: "#f59e0b" },
  { name: "Q28 Infraestructura", value: 74.28, color: "#f59e0b" },
  { name: "Q22 Proponer mejoras", value: 74.5, color: "#f59e0b" },
];

export const FINAL_RAURA_FOLLOW_UP = [
  { name: "Acto inseguro", base: 48.33, goal6: 68, goal12: 75 },
  { name: "Gestion riesgo", base: 51.67, goal6: 68, goal12: 75 },
  { name: "Liderazgo riesgo", base: 60, goal6: 75, goal12: 85 },
  { name: "Reconocimiento", base: 71.71, goal6: 80, goal12: 85 },
  { name: "Comunicacion", base: 70.5, goal6: 78, goal12: 85 },
  { name: "Capacitacion", base: 57, goal6: 85, goal12: 95 },
];

export const FINAL_RAURA_INTERVENTIONS = [
  "Observacion conductual: 3 observaciones por guardia",
  "Caminatas de liderazgo: 2 por semana con compromisos cerrados",
  "Microintervenciones de percepcion de riesgo en campo",
  "Refuerzo positivo por detener, reportar y corregir",
  "Alertas sin Culpa y espacios de escucha protegida",
  "Cerrar brecha de capacitacion Mina / Planta",
  "Completar 10 entrevistas DPMS pendientes",
  "Cerrar hallazgos tecnicos con evidencia fotografica",
];
