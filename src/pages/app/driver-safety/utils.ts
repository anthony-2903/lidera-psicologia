export const getAnalysis = (result: string, internal: number) => {
  if (result === "ERROR")
    return "Registro no válido para interpretación. Las respuestas no completan las 23 preguntas válidas o existe un problema de lectura de datos.";
  if (internal >= 19)
    return "Perfil con dominancia interna sólida. El evaluado tiende a reconocer la influencia de sus propias acciones en los resultados laborales y de seguridad. Este perfil resulta favorable para tareas críticas, ya que se asocia con responsabilidad personal, cumplimiento de procedimientos y mayor disposición hacia la conducta segura.";
  if (internal >= 13)
    return "Perfil con control interno moderado. Si bien el evaluado muestra capacidad para asumir responsabilidad sobre sus acciones, aún puede presentar cierta tendencia a atribuir algunos eventos a factores externos. Se recomienda reforzar la autogestión preventiva, la toma de decisiones seguras y la responsabilidad individual frente al riesgo.";
  return "SE SOLICITA APERSONARSE AL ÁREA DE GERENCIA DE SU EMPRESA PARA RECIBIR LAS INSTRUCCIONES Y DIRECTRICES CORRESPONDIENTES A SU PERFIL DE RIESGO.";
};

export const normalizeFilterValue = (value: string | number | undefined | null) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

export const formatFilterLabel = (value: string) =>
  value.replace(/\s+/g, " ").trim().toUpperCase();

export const buildFilterOptions = (values: Array<string | undefined | null>) => {
  const byKey = values.reduce((acc, rawValue) => {
    const raw = String(rawValue ?? "");
    const key = normalizeFilterValue(raw);
    if (!key) return acc;

    const label = formatFilterLabel(raw);
    const currentLabel = acc.get(key);
    const shouldPreferLabel =
      !currentLabel || (label.normalize("NFD") !== label && currentLabel === key);

    acc.set(key, shouldPreferLabel ? label : currentLabel);
    return acc;
  }, new Map<string, string>());

  return Array.from(byKey.values()).sort((a, b) => a.localeCompare(b, "es"));
};
