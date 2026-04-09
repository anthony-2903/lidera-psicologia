
export const DASHBOARD_PALETTES = {
  rauraCategories: {
    'Liderazgo Visible': '#3b82f6',
    'Gestión y Cumplimiento': '#f59e0b',
    'Participación': '#10b981',
    'Cultura y Comunicación': '#8b5cf6',
  },
  stack5: ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#3b82f6"],
  team4: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"],
  proj3: ["#ef4444", "#f59e0b", "#10b981"],
  lead4: ["#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"],
};

export const mapScoreToColor = (score: number) => {
  if (score > 75) return '#10b981';
  if (score > 45) return '#3b82f6';
  return '#ef4444';
};

export const mapScaleToNum = (val: string) => {
  const v = (val || "").toUpperCase().trim();
  if (v === "MUY ALTO") return 5;
  if (v === "ALTO" || v === "ADECUADO") return 4;
  if (v === "PROMEDIO" || v === "REGULAR" || v === "EN OBSERVACION" || v === "MEDIO") return 3;
  if (v === "BAJO" || v === "RIESGO") return 2;
  if (v === "MUY BAJO") return 1;
  return 0;
};
