import type { DiagnosticTab } from "./constants";

export const getLevelConfig = (score: number) => {
  if (score >= 67) return { label: "Alto", color: "text-emerald-500", bg: "bg-emerald-500/10" };
  if (score >= 34) return { label: "Medio", color: "text-amber-500", bg: "bg-amber-500/10" };
  return { label: "Bajo", color: "text-red-500", bg: "bg-red-500/10" };
};

export const getHeatColor = (score: number) => {
  if (score >= 75) return "bg-emerald-500 text-white";
  if (score >= 60) return "bg-amber-400 text-slate-900";
  return "bg-rose-500 text-white";
};

export const getTrafficConfig = (score: number) => {
  if (score >= 75) return { label: "Estable", color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10" };
  if (score >= 60) return { label: "Vigilancia", color: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-500/10" };
  return { label: "Crítico", color: "bg-rose-500", text: "text-rose-600", bg: "bg-rose-500/10" };
};

export const scoreByType = (value: string | undefined, dimension: DiagnosticTab) => {
  const text = (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  if (!text) return 0;

  if (dimension === "cultura") {
    if (text.includes("INTERDEPENDIENTE")) return 95;
    if (text.includes("INDEPENDIENTE")) return 80;
    if (text.includes("DEPENDIENTE")) return 55;
    if (text.includes("REACTIVA")) return 30;
  }

  if (dimension === "percepcion") {
    if (text.includes("PROACTIVO")) return 90;
    if (text.includes("CAUTELOSO")) return 75;
    if (text.includes("NORMATIVO")) return 60;
    if (text.includes("REACTIVO")) return 35;
  }

  if (dimension === "liderazgo") {
    if (text.includes("EMPOWERMENT")) return 90;
    if (text.includes("COACHING")) return 80;
    if (text.includes("SOPORTE")) return 65;
    if (text.includes("DIRECTIVO")) return 55;
  }

  if (dimension === "motivacion") {
    if (text.includes("INTRINSECA") && text.includes("EXTRINSECA")) return 70;
    if (text.includes("INTRINSECA")) return 85;
    if (text.includes("EXTRINSECA")) return 55;
  }

  if (dimension === "comunicacion") {
    let score = 50;
    if (text.includes("COLABORATIVA")) score += 25;
    if (text.includes("ASERTIVA")) score += 20;
    if (text.includes("FUNCIONAL")) score += 10;
    if (text.includes("DIRECTA")) score += 5;
    return Math.min(score, 95);
  }

  if (dimension === "rol") {
    if (text.includes("SOCIALES") && text.includes("ACCION")) return 80;
    if (text.includes("SOCIALES") && text.includes("MENTALES")) return 82;
    if (text.includes("SOCIALES")) return 76;
    if (text.includes("MENTALES")) return 72;
    if (text.includes("ACCION")) return 66;
  }

  return 60;
};
