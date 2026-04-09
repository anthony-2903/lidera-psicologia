import Papa from 'papaparse';

// ============================================
// Tipos para el Dashboard General (Globales)
// ============================================

export interface QualityCount {
  [key: string]: number;
}

export interface ChartData {
  name: string;
  [key: string]: string | number;
}

export interface IndividualEvaluation {
  id: number;
  name: string;
  personality: { name: string; value: string }[];
  motivational: { name: string; value: string }[];
  teamwork: { name: string; value: string }[];
  projective: { name: string; value: string }[];
  leadership: string;
  behavioral: string;
}

export interface FinalDashboardData {
  totalEvaluated: number;
  // Personalidad (5 ejes x 5 niveles) - Ideal para Radar
  personality: ChartData[];
  // Motivacional (10 ejes x 5 niveles) - Ideal para Bar Chart
  motivational: ChartData[];
  // Equipo (9 roles x 4 niveles) - Ideal para Bar Chart o Radar
  teamwork: ChartData[];
  // Proyectivo (4 ejes x 3 niveles) - Ideal para Radial Bar o Micro-Pies
  projective: ChartData[];
  // Liderazgo (1 eje x 4 niveles) - Ideal para Donut (Pie)
  leadership: ChartData[];
  // Conductual (1 eje x 3 niveles) - Ideal para SemiCircle Gauge (Pie)
  behavioral: ChartData[];
  // Datos individuales para la vista de listado
  individuals: IndividualEvaluation[];
}

export interface RauraEntry {
  id: number;
  area: string;
  fecha: string;
  puesto: string;
  empresa: string;
  scores: {
    liderazgo: number;
    gestion: number;
    participacion: number;
    cultura: number;
  };
  totalScore: number;
  comentarios: string;
  rawResponses: string[];
}

export interface RauraDashboardData {
  totalRespondents: number;
  globalAverage: number;
  categories: { name: string; value: number }[];
  areas: ChartData[];
  entries: RauraEntry[];
}

export interface SheetRow {
  N: string;
  'APELLIDOS Y NOMBRES': string;
  DNI: string;
  EMPRESA: string;
  ÁREA: string;
  PUESTO: string;
  'GRADO DE INSTRUCCIÓN': string;
  'BATERIAS PSICOLOGICAS': string;
  'ENTREVISTA POR COMPETENCIAS': string;
  ESTADO: string;
  'FECHA DE EVALUACION': string;
}

export interface StatGroup {
  completo: number;
  proceso: number;
  falta: number;
}

export interface InterviewStatGroup {
  realizado: number;
  falta: number;
}

export interface GroupMetric {
  id: number;
  name: string;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  avgScore: number;
  color: string;
  // Specific stats for Seguimiento Dashboard
  psychologyStats: StatGroup;
  interviewStats: InterviewStatGroup;
  statusStats: StatGroup;
  // Others
  genderData: { name: string; value: number; color: string }[];
  radarData: { subject: string; A: number; fullMark: number }[];
}

const COLORS = [
  "hsl(212, 52%, 25%)", // Deep Blue
  "hsl(142, 71%, 45%)", // Green
  "hsl(38, 92%, 50%)",  // Amber
  "hsl(262, 83%, 58%)", // Purple
  "hsl(10, 81%, 59%)",  // Red
];

export const fetchSheetData = async (sheetId: string): Promise<GroupMetric[]> => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch Google Sheet data');
  }
  
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<SheetRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        const groups: Record<string, GroupMetric> = {};
        
        rows.forEach((row) => {
          const area = row.ÁREA || 'Sin Área';
          if (!groups[area]) {
            groups[area] = {
              id: Object.keys(groups).length + 1,
              name: area,
              total: 0,
              completed: 0,
              inProgress: 0,
              pending: 0,
              avgScore: 0,
              color: COLORS[Object.keys(groups).length % COLORS.length],
              psychologyStats: { completo: 0, proceso: 0, falta: 0 },
              interviewStats: { realizado: 0, falta: 0 },
              statusStats: { completo: 0, proceso: 0, falta: 0 },
              genderData: [
                { name: "Masculino", value: 0, color: "hsl(212, 52%, 25%)" },
                { name: "Femenino", value: 0, color: "hsl(38, 92%, 50%)" },
              ],
              radarData: [
                { subject: 'Liderazgo', A: 80, fullMark: 100 },
                { subject: 'Seguridad', A: 70, fullMark: 100 },
                { subject: 'Comunicación', A: 85, fullMark: 100 },
                { subject: 'Técnico', A: 90, fullMark: 100 },
                { subject: 'Ética', A: 95, fullMark: 100 },
              ]
            };
          }
          
          const group = groups[area];
          group.total++;
          
          // Psychology Stats
          const psycho = (row['BATERIAS PSICOLOGICAS'] || '').toUpperCase().trim();
          if (psycho === 'COMPLETO') group.psychologyStats.completo++;
          else if (psycho === 'PROCESO') group.psychologyStats.proceso++;
          else group.psychologyStats.falta++;
          
          // Interview Stats
          const interview = (row['ENTREVISTA POR COMPETENCIAS'] || '').toUpperCase().trim();
          if (interview === 'REALIZADO') group.interviewStats.realizado++;
          else group.interviewStats.falta++;
          
          // Status Stats
          const estado = (row.ESTADO || '').toUpperCase().trim();
          if (estado === 'COMPLETO') {
            group.statusStats.completo++;
            group.completed++; // Sync with general metrics
          } else if (estado === 'PROCESO') {
            group.statusStats.proceso++;
            group.inProgress++;
          } else {
            group.statusStats.falta++;
            group.pending++;
          }
        });
        
        // Final calculations
        Object.values(groups).forEach(group => {
          group.avgScore = group.total > 0 ? Math.round((group.completed / group.total) * 100) : 0;
          
          // Randomize radar for visual variety based on score
          group.radarData = group.radarData.map(d => ({
            ...d,
            A: Math.max(40, Math.min(100, group.avgScore + (Math.random() * 20 - 10)))
          }));
        });
        
        resolve(Object.values(groups));
      },
      error: (error: any) => {
        reject(error);
      }
    });
  });
};

export const fetchRawRows = async (sheetId: string): Promise<SheetRow[]> => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch Google Sheet data');
  }

  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<SheetRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error: any) => {
        reject(error);
      }
    });
  });
};

// ============================================
// FUNCION PARSER FINAL DASHBOARD
// ============================================
export const fetchFinalDashboardData = async (sheetId: string): Promise<FinalDashboardData> => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch Google Sheet data');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(csvText, {
      header: false, // Forzado false por las celdas combinadas de Google Sheets
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        const totalRows = Math.max(0, rows.length - 1); // Solo hay una fila de cabecera real
        
        // --- Estructuras Base ---
        const personalityCounter: Record<string, QualityCount> = {
          'Energía': {}, 'Tesón': {}, 'Afabilidad': {}, 'Esta. Emocional': {}, 'Apertura': {}
        };
        const motivationalCounter: Record<string, QualityCount> = {
          'Afiliación': {}, 'Poder': {}, 'Logro': {}, 'Exploración': {}, 'Contribución': {},
          'Autonomía': {}, 'Cooperación': {}, 'Hedonismo': {}, 'Seguridad': {}, 'Conservación': {}
        };
        const teamCounter: Record<string, QualityCount> = {
          'Creativo': {}, 'Evaluador': {}, 'Especialista': {}, 'Coordinador': {}, 'Cohesionador': {},
          'Recursos': {}, 'Impulsor': {}, 'Implementador': {}, 'Finalizador': {}
        };
        const projCounter: Record<string, QualityCount> = {
          'Manejo Emociones': {}, 'Rel. interpers': {}, 'Ctrl Impulsos': {}, 'Adaptación': {}
        };
        
        const leadCounter: QualityCount = {};
        const behCounter: QualityCount = {};
        const individuals: IndividualEvaluation[] = [];

        // Helper para extraer el estado limpio de una cadena (ej: 'ENERGIA PROMEDIO' -> 'PROMEDIO')
        const extractState = (text: string): string => {
          if (!text) return '';
          const upperText = text.toUpperCase();
          const VALID_STATES = [
            'MUY ALTO', 'MUY BAJO', 'PROMEDIO', 'REGULAR', 
            'EN OBSERVACION', 'EN OBSERVACIÓN', 'EN DESARROLLO', 
            'ADECUADO', 'RIESGO', 'ALTO', 'BAJO', 'MEDIO', 
            'AUTORITARIO FLEXIBLE', 'AUTORITARIO', 'CONSULTIVO', 'PARTICIPATIVO'
          ];
          
          // Ordenar por longitud descendente para evitar 'ALTO' antes de 'MUY ALTO'
          const sortedStates = [...VALID_STATES].sort((a, b) => b.length - a.length);
          
          // Buscar el estado en la cadena. Si hay múltiples separados por comas, tomamos el primero para el panel individual
          // Pero para agregados sumamos todos (esto se maneja en addOccurrence)
          for (const state of sortedStates) {
            if (upperText.includes(state)) {
              if (state === 'EN OBSERVACIÓN') return 'EN OBSERVACION';
              return state;
            }
          }
          return upperText; // Fallback al original si no se encuentra match
        };

        // Función Helper para sumar ocurrencias (soporta múltiples valores por celda)
        const addOccurrence = (counter: Record<string, QualityCount> | QualityCount, category: string, value: string) => {
          if (!value || value.trim() === '') return;
          const upperValue = value.toUpperCase();
          const parts = upperValue.split(',').map(p => p.trim());
          
          parts.forEach(part => {
             const cleanVal = extractState(part);
             if (!cleanVal) return;
             
             if (typeof category === 'string' && category !== '' && (counter as Record<string, QualityCount>)[category] !== undefined) {
               const inner = (counter as Record<string, QualityCount>)[category];
               inner[cleanVal] = (inner[cleanVal] || 0) + 1;
             } else {
               const flatCounter = counter as QualityCount;
               flatCounter[cleanVal] = (flatCounter[cleanVal] || 0) + 1;
             }
          });
        };

        // Procesar Filas
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[1] || r[1] === '') continue;

          // Aggregates
          addOccurrence(personalityCounter, 'Energía', r[3]);
          addOccurrence(personalityCounter, 'Tesón', r[4]);
          addOccurrence(personalityCounter, 'Afabilidad', r[5]);
          addOccurrence(personalityCounter, 'Esta. Emocional', r[6]);
          addOccurrence(personalityCounter, 'Apertura', r[7]);
          addOccurrence(motivationalCounter, 'Afiliación', r[8]);
          addOccurrence(motivationalCounter, 'Poder', r[9]);
          addOccurrence(motivationalCounter, 'Logro', r[10]);
          addOccurrence(motivationalCounter, 'Exploración', r[11]);
          addOccurrence(motivationalCounter, 'Contribución', r[12]);
          addOccurrence(motivationalCounter, 'Autonomía', r[13]);
          addOccurrence(motivationalCounter, 'Cooperación', r[14]);
          addOccurrence(motivationalCounter, 'Hedonismo', r[15]);
          addOccurrence(motivationalCounter, 'Seguridad', r[16]);
          addOccurrence(motivationalCounter, 'Conservación', r[17]);
          addOccurrence(teamCounter, 'Creativo', r[18]);
          addOccurrence(teamCounter, 'Evaluador', r[19]);
          addOccurrence(teamCounter, 'Especialista', r[20]);
          addOccurrence(teamCounter, 'Coordinador', r[21]);
          addOccurrence(teamCounter, 'Cohesionador', r[22]);
          addOccurrence(teamCounter, 'Recursos', r[23]);
          addOccurrence(teamCounter, 'Impulsor', r[24]);
          addOccurrence(teamCounter, 'Implementador', r[25]);
          addOccurrence(teamCounter, 'Finalizador', r[26]);
          addOccurrence(projCounter, 'Manejo Emociones', r[27]);
          addOccurrence(projCounter, 'Rel. interpers', r[28]);
          addOccurrence(projCounter, 'Ctrl Impulsos', r[29]);
          addOccurrence(projCounter, 'Adaptación', r[30]);
          addOccurrence(leadCounter, '', r[31]);
          addOccurrence(behCounter, '', r[32]);

          // Individual Data
          individuals.push({
            id: i,
            name: r[1],
            personality: [
              { name: 'Energía', value: extractState(r[3]) },
              { name: 'Tesón', value: extractState(r[4]) },
              { name: 'Afabilidad', value: extractState(r[5]) },
              { name: 'Esta. Emocional', value: extractState(r[6]) },
              { name: 'Apertura', value: extractState(r[7]) }
            ],
            motivational: [
              { name: 'Afiliación', value: extractState(r[8]) },
              { name: 'Poder', value: extractState(r[9]) },
              { name: 'Logro', value: extractState(r[10]) },
              { name: 'Exploración', value: extractState(r[11]) },
              { name: 'Contribución', value: extractState(r[12]) },
              { name: 'Autonomía', value: extractState(r[13]) },
              { name: 'Cooperación', value: extractState(r[14]) },
              { name: 'Hedonismo', value: extractState(r[15]) },
              { name: 'Seguridad', value: extractState(r[16]) },
              { name: 'Conservación', value: extractState(r[17]) }
            ],
            teamwork: [
              { name: 'Creativo', value: extractState(r[18]) },
              { name: 'Evaluador', value: extractState(r[19]) },
              { name: 'Especialista', value: extractState(r[20]) },
              { name: 'Coordinador', value: extractState(r[21]) },
              { name: 'Cohesionador', value: extractState(r[22]) },
              { name: 'Recursos', value: extractState(r[23]) },
              { name: 'Impulsor', value: extractState(r[24]) },
              { name: 'Implementador', value: extractState(r[25]) },
              { name: 'Finalizador', value: extractState(r[26]) }
            ],
            projective: [
              { name: 'Manejo Emociones', value: extractState(r[27]) },
              { name: 'Rel. interpers', value: extractState(r[28]) },
              { name: 'Ctrl Impulsos', value: extractState(r[29]) },
              { name: 'Adaptación', value: extractState(r[30]) }
            ],
            leadership: extractState(r[31]),
            behavioral: extractState(r[32])
          });
        }

        // --- Transformar a ChartData ---
        const mapToChartData = (dict: Record<string, QualityCount>): ChartData[] => {
          return Object.keys(dict).map((key) => {
            return {
              name: key,
              ...dict[key]
            };
          });
        };
        const mapSingleToPie = (dict: QualityCount): ChartData[] => {
          return Object.keys(dict).map(key => ({ name: key, value: dict[key] }));
        };

        resolve({
          totalEvaluated: totalRows,
          personality: mapToChartData(personalityCounter),
          motivational: mapToChartData(motivationalCounter),
          teamwork: mapToChartData(teamCounter),
          projective: mapToChartData(projCounter),
          leadership: mapSingleToPie(leadCounter),
          behavioral: mapSingleToPie(behCounter),
          individuals: individuals
        });
      },
      error: reject
    });
  });
};

// ============================================
// FUNCION PARSER RAURA DASHBOARD
// ============================================
export const fetchRauraData = async (sheetId: string): Promise<RauraDashboardData> => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch Raura data');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(csvText, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        if (rows.length < 2) {
          reject(new Error("No data found in Raura sheet"));
          return;
        }

        const entries: RauraEntry[] = [];
        
        const scoreMap: Record<string, number> = {
          'SIEMPRE': 5,
          'MUCHAS VECES': 4,
          'ALGUNAS VECES': 3,
          'POCAS VECES': 2,
          'NUNCA': 1
        };

        const getScore = (val: string) => scoreMap[val.toUpperCase().trim()] || 0;

        // Question Grouping Indices (0-indexed from CSV)
        const catIndices = {
          liderazgo: [4, 7, 8, 9, 11],
          gestion: [5, 6, 10, 12, 27, 28, 31],
          participacion: [13, 14, 15, 16, 20, 30, 32],
          cultura: [17, 18, 19, 21, 22, 23, 24, 25, 26, 29]
        };

        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[0]) continue;

          const calcAvg = (indices: number[]) => {
            const scores = indices.map(idx => getScore(r[idx])).filter(s => s > 0);
            return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) * 20 : 0; // Convert to 0-100 scale
          };

          const scores = {
            liderazgo: calcAvg(catIndices.liderazgo),
            gestion: calcAvg(catIndices.gestion),
            participacion: calcAvg(catIndices.participacion),
            cultura: calcAvg(catIndices.cultura)
          };

          const totalScore = (scores.liderazgo + scores.gestion + scores.participacion + scores.cultura) / 4;

          entries.push({
            id: i,
            area: r[0],
            fecha: r[1],
            puesto: r[2] || 'No especificado',
            empresa: r[3],
            scores,
            totalScore,
            comentarios: r[33] || '',
            rawResponses: r.slice(4, 33)
          });
        }

        // Aggregate Data
        const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

        const globalAvg = avg(entries.map(e => e.totalScore));
        
        const categories = [
          { name: 'Liderazgo Visible', value: avg(entries.map(e => e.scores.liderazgo)) },
          { name: 'Gestión y Cumplimiento', value: avg(entries.map(e => e.scores.gestion)) },
          { name: 'Participación', value: avg(entries.map(e => e.scores.participacion)) },
          { name: 'Cultura y Comunicación', value: avg(entries.map(e => e.scores.cultura)) }
        ];

        // Group by Area
        const areaGroups: Record<string, number[]> = {};
        entries.forEach(e => {
          if (!areaGroups[e.area]) areaGroups[e.area] = [];
          areaGroups[e.area].push(e.totalScore);
        });

        const areas = Object.keys(areaGroups).map(name => ({
          name,
          score: Math.round(avg(areaGroups[name]))
        }));

        resolve({
          totalRespondents: entries.length,
          globalAverage: globalAvg,
          categories,
          areas,
          entries
        });
      },
      error: reject
    });
  });
};
