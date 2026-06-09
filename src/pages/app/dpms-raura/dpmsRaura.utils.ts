import { RauraEntry } from "@/lib/sheets-adapter";
import { DIMENSION_DEFINITIONS } from "./dpmsRaura.constants";

export const toPercent = (value: number) => Math.round(value * 20);

export const getInterpretation = (val: string) => {
  if (!val) return "";
  const v = val.trim().toUpperCase();

  for (const cat in DIMENSION_DEFINITIONS) {
    if (DIMENSION_DEFINITIONS[cat][v]) return `${v} - ${DIMENSION_DEFINITIONS[cat][v]}`;
  }

  const map: Record<string, string> = {
    "1": "Nivel Reactivo - Acción basada en instinto y miedo.",
    "2": "Nivel Dependiente - Acción basada en supervisión y reglas.",
    "3": "Nivel Independiente - Acción basada en autovigilancia y convicción.",
    "4": "Nivel Interdependiente - Acción basada en el cuidado mutuo y proactividad.",
    "5": "Excelente / Liderazgo - Cultura preventiva plenamente integrada y ejemplar.",
  };
  return map[v] || val;
};

export const getQuestionText = (val: string) => {
  if (!val) return "";
  const v = val.trim();
  const map: Record<string, string> = {
    "1": "Nunca",
    "2": "Pocas veces",
    "3": "Algunas veces",
    "4": "Muchas veces",
    "5": "Siempre",
  };
  return map[v] || v;
};

export const getFinalReportSummary = (
  statsMetrix: { avg: number; categories: { name: string; value: number }[] },
  cultureData: { avg: number; label: string },
) => {
  const avg = statsMetrix.avg;
  const cultureAvg = cultureData.avg;

  const topDimensions = [...statsMetrix.categories]
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((dim) => `${dim.name} (${Math.round(dim.value)}%)`);

  const bottomDimensions = [...statsMetrix.categories]
    .sort((a, b) => a.value - b.value)
    .slice(0, 2)
    .map((dim) => `${dim.name} (${Math.round(dim.value)}%)`);

  const finalPosition =
    avg <= 25 ? "Reactivo" : avg <= 50 ? "Dependiente" : avg <= 75 ? "Independiente" : "Interdependiente";
  const resultLabel = `Entorno en seguridad ${finalPosition}`;
  const environmentScore = Math.min(100, avg);

  const technicalInterpretation =
    avg > 75
      ? "Los valores cuantitativos ubican el entorno en una condición Interdependiente. La organización muestra una base preventiva sólida y un comportamiento alineado con prácticas sostenibles."
      : avg > 50
        ? "El informe final valida una situación intermedia: existe avance real, pero todavía conviven conductas preventivas con brechas de estandarización y liderazgo visible."
        : "El informe final confirma un entorno reactivo: los datos cuantitativos refuerzan la urgencia de mejorar liderazgo, comunicación y cultura preventiva.";

  return {
    resultLabel,
    avg,
    finalPosition,
    cultureAvg,
    topDimensions,
    bottomDimensions,
    technicalInterpretation,
    executiveConclusion: `El informe final concluye que el entorno en seguridad debe leerse desde la escala porcentual real del instrumento, no desde una cifra fija. El posicionamiento técnico queda alineado al nivel ${finalPosition}.`,
    strengths: topDimensions,
    gaps: bottomDimensions,
    opportunities: bottomDimensions.map((dim) => `Aumentar enfoque en ${dim.toLowerCase()}`),
    reportMetrics: [
      { name: "Promedio Global", value: avg, color: "#3b82f6" },
      { name: "Cultura SST", value: cultureAvg, color: "#10b981" },
      { name: "Entorno seguridad", value: environmentScore, color: "#ef4444" },
    ],
    recommendations: [
      "Alinear la interpretación técnica con los hallazgos cuantitativos para evitar conclusiones demasiado optimistas.",
      "Fortalecer liderazgo visible y comunicación alineada a la cultura preventiva.",
      "Priorizar la gestión de brechas normativas y el compromiso de mandos medios.",
    ],
  };
};

export const buildEntryAnalysis = (entry: RauraEntry) => {
  const sorted = Object.entries(entry.dimensions).sort((a, b) => a[1].score - b[1].score);
  const lowest = sorted[0];
  const highest = sorted[5];

  let analysis = `El perfil presenta una madurez operativa destacada en **${highest[0].toUpperCase()}** (${Math.round(highest[1].score)}%), categorizado como **${highest[1].perfil}**. `;

  if (lowest[1].score < 50) {
    analysis += `Sin embargo, se detecta un área crítica en **${lowest[0].toUpperCase()}** (${Math.round(lowest[1].score)}%), donde el perfil actual es **${lowest[1].perfil}**. Esto sugiere la necesidad de una intervención inmediata para elevar el nivel de madurez organizacional.`;
  } else {
    analysis += `Incluso en su punto más bajo (**${lowest[0].toUpperCase()}**), mantiene un nivel aceptable de **${lowest[1].perfil}**, lo que refleja una cultura de seguridad robusta.`;
  }

  return { analysis };
};
