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
    "1": "Nivel Reactivo - Accion basada en instinto y miedo.",
    "2": "Nivel Dependiente - Accion basada en supervision y reglas.",
    "3": "Nivel Independiente - Accion basada en autovigilancia y conviccion.",
    "4": "Nivel Interdependiente - Accion basada en el cuidado mutuo y proactividad.",
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
      ? "Los valores cuantitativos ubican el entorno en una condicion Interdependiente. La organizacion muestra una base preventiva solida y un comportamiento alineado con practicas sostenibles."
      : avg > 50
        ? "El informe final valida una situacion intermedia: existe avance real, pero todavia conviven conductas preventivas con brechas de estandarizacion y liderazgo visible."
        : "El informe final confirma un entorno reactivo: los datos cuantitativos refuerzan la urgencia de mejorar liderazgo, comunicacion y cultura preventiva.";

  return {
    resultLabel,
    avg,
    finalPosition,
    cultureAvg,
    topDimensions,
    bottomDimensions,
    technicalInterpretation,
    executiveConclusion: `El informe final concluye que el entorno en seguridad debe leerse desde la escala porcentual real del instrumento, no desde una cifra fija. El posicionamiento tecnico queda alineado al nivel ${finalPosition}.`,
    strengths: topDimensions,
    gaps: bottomDimensions,
    opportunities: bottomDimensions.map((dim) => `Aumentar enfoque en ${dim.toLowerCase()}`),
    reportMetrics: [
      { name: "Promedio Global", value: avg, color: "#3b82f6" },
      { name: "Cultura SST", value: cultureAvg, color: "#10b981" },
      { name: "Entorno seguridad", value: environmentScore, color: "#ef4444" },
    ],
    recommendations: [
      "Alinear la interpretacion tecnica con los hallazgos cuantitativos para evitar conclusiones demasiado optimistas.",
      "Fortalecer liderazgo visible y comunicacion alineada a la cultura preventiva.",
      "Priorizar la gestion de brechas normativas y el compromiso de mandos medios.",
    ],
  };
};

export const buildEntryAnalysis = (entry: RauraEntry) => {
  const sorted = Object.entries(entry.dimensions).sort((a, b) => a[1].score - b[1].score);
  const lowest = sorted[0];
  const highest = sorted[5];

  let analysis = `El perfil presenta una madurez operativa destacada en **${highest[0].toUpperCase()}** (${Math.round(highest[1].score)}%), categorizado como **${highest[1].perfil}**. `;

  if (lowest[1].score < 50) {
    analysis += `Sin embargo, se detecta un area critica en **${lowest[0].toUpperCase()}** (${Math.round(lowest[1].score)}%), donde el perfil actual es **${lowest[1].perfil}**. Esto sugiere la necesidad de una intervencion inmediata para elevar el nivel de madurez organizacional.`;
  } else {
    analysis += `Incluso en su punto mas bajo (**${lowest[0].toUpperCase()}**), mantiene un nivel aceptable de **${lowest[1].perfil}**, lo que refleja una cultura de seguridad robusta.`;
  }

  return { analysis };
};
