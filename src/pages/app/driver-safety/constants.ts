export const SHEET_ID = "1nrHMcI8fWlBKIWIv9aprjElPhY-ccmXX";

export const DRIVER_SAFETY_TABLE_COLUMN_WIDTHS = [
  90, 210, 120, 110, 130, 150, 180, 140, 120, 180, 100, 100, 90, 130, 160,
];

export const RISK_COLORS = {
  "RIESGO ALTO": "#ef4444", // Red-500
  "RIESGO MEDIO": "#f59e0b", // Amber-500
  "RIESGO BAJO": "#10b981", // Emerald-500
  ERROR: "#64748b", // Slate-500
};

export const RECOMMENDATIONS = {
  "RIESGO BAJO": {
    title: "🟢 RECOMENDACIÓN: RIESGO BAJO (Dominancia Interna)",
    desc: "Perfil con dominancia interna sólida. El evaluado tiende a reconocer la influencia de sus propias acciones en los resultados laborales y de seguridad.",
    rec: [
      "Mantener en tareas críticas, según desempeño y criterio operativo.",
      "Considerar como referente de conducta segura.",
      "Refuerzar mediante feedback positivo.",
      "Seguimiento preventivo periódico.",
      "Potenciar participación en charlas o inducciones de seguridad.",
    ],
    followUp: "Seguimiento preventivo periódico.",
  },
  "RIESGO MEDIO": {
    title: "🟡 RECOMENDACIÓN: RIESGO MEDIO (Control Moderado)",
    desc: "Perfil con control interno moderado. Si bien el evaluado muestra capacidad para asumir responsabilidad sobre sus acciones, aún puede presentar cierta tendencia a atribuir algunos eventos a factores externos.",
    rec: [
      "Realizar reforzamiento en responsabilidad personal.",
      "Brindar retroalimentación directa del supervisor.",
      "Reforzar uso de herramientas preventivas.",
      "Monitorear desempeño en tareas críticas.",
      "Reevaluar en periodo definido por el área.",
    ],
    followUp: "Monitoreo de desempeño en tareas críticas.",
  },
  "RIESGO ALTO": {
    title: "🔴 RECOMENDACIÓN: RIESGO ALTO (Predominancia Externa)",
    desc: "Perfil con predominancia externa. El evaluado podría mostrar mayor tendencia a atribuir los resultados a factores externos, como el entorno, terceros o condiciones fuera de su control.",
    rec: [
      "Aplicar intervención conductual individual.",
      "Reforzar percepción de riesgo y consecuencias.",
      "Realizar seguimiento cercano en campo.",
      "Evaluar antecedentes de incidentes o incumplimientos.",
      "Considerar restricción temporal de tareas críticas según criterio operativo.",
      "Reevaluar antes de exposición a tareas de mayor riesgo.",
    ],
    followUp: "Intervención conductual individual y seguimiento cercano.",
  },
  ERROR: {
    title: "⚠️ REGISTRO NO VÁLIDO",
    desc: "Registro no válido para interpretación. Las respuestas no completan las 23 preguntas válidas o existe un problema de lectura de datos.",
    rec: [
      "Revisar la fila correspondiente en la base de datos.",
      "Verificar que se hayan completado las 23 respuestas.",
      "Asegurar que las respuestas sean únicamente A o B.",
    ],
    followUp: "Requiere revisión manual de la base de datos.",
  },
};

export const REPORT_ACTIONS = {
  "RIESGO BAJO":
    "Sin restricciones operacionales. Reevaluación 12 meses.",
  "RIESGO MEDIO":
    "Taller de autorresponsabilidad en seguridad. Monitoreo trimestral. Reevaluación a 3 meses(90 dias).",
  "RIESGO ALTO":
    "SE SOLICITA APERSONARSE AL ÁREA DE GERENCIA PARA RECIBIR LAS INSTRUCCIONES Y DIRECTRICES CORRESPONDIENTES.",
  ERROR: "Registro no válido. Revisar base de datos.",
};
