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

// Robust Gender Detection based on Spanish name patterns (Shared utility)
export const detectGender = (fullName: string): 'MASCULINO' | 'FEMENINO' => {
    const name = fullName.trim().toUpperCase();
    // Handling "APELLIDOS, NOMBRES" or "NOMBRE APELLIDO"
    let mainName = '';
    if (name.includes(',')) {
        const parts = name.split(',');
        const namesPart = parts[1]?.trim();
        mainName = namesPart ? namesPart.split(' ')[0] : '';
    } else {
        // Assume first name is the first word
        mainName = name.split(' ')[0];
    }

    if (!mainName) return 'MASCULINO';

    // Common female endings in Spanish
    const femaleEndings = ['A', 'INA', 'ITA', 'ELA', 'ICA', 'NZA', 'ORA'];
    const isFemaleEnding = femaleEndings.some(ending => mainName.endsWith(ending));

    // Exceptions (Male names ending in A)
    const maleExceptions = ['JOSHUA', 'LUCA', 'BAUTISTA', 'MATTIA', 'NICOLA', 'BORJA', 'ANDREA', 'ELIA'];
    if (maleExceptions.includes(mainName)) return 'MASCULINO';
    
    if (isFemaleEnding || mainName.endsWith('MARIA')) return 'FEMENINO';
    
    // Common female names that don't end in A
    const femaleNames = ['LUZ', 'ESTHER', 'ISABEL', 'BEATRIZ', 'CARMEN', 'RAQUEL', 'RUTH', 'MIRIAM', 'NIEVES', 'CONCEPCION', 'MARIVÍ'];
    if (femaleNames.includes(mainName)) return 'FEMENINO';

    return 'MASCULINO';
};

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
  questions?: string[];
}

export interface RauraDashboardData {
  totalRespondents: number;
  globalAverage: number;
  categories: { name: string; value: number }[];
  areas: ChartData[];
  entries: RauraEntry[];
}

export interface LocusControlEntry {
  id: number;
  name: string;
  company: string;
  position: string;
  internalScore: number;
  externalScore: number;
  result: string;
  date: string;
}

export interface LocusControlData {
  totalEvaluated: number;
  avgInternal: number;
  avgExternal: number;
  riskDistribution: { name: string; value: number }[];
  entries: LocusControlEntry[];
}

export interface DimensionReport {
  tipo: string;
  fortalezas: string;
  riesgos: string;
  enfoque: string;
}

export interface DimensionesEntry {
  id: number;
  nombre: string;
  dni: string;
  empresa: string;
  area: string;
  cargo: string;
  puntuacionLiderazgo: number;
  puntuacionPercepcion: number;
  total: number;
  nivel: string;
  perfil: string;
  genero: 'MASCULINO' | 'FEMENINO';
  lbaScore: number;
  belbinScore: number;
  emaScore: number;
  bigFiveScore: number;
  entrevistaScore: number;
  insightPercepcion?: string;
  // Reportes cualitativos de las hojas adicionales
  culturaReport?: DimensionReport;
  comunicacionReport?: DimensionReport;
  percepcionReport?: DimensionReport;
  liderazgoReport?: DimensionReport;
}

export interface DimensionesDashboardData {
  entries: DimensionesEntry[];
  totalEvaluated: number;
  avgScore: number;
}

export interface SheetRow {
  N: string;
  'APELLIDOS Y NOMBRES': string;
  DNI: string;
  EMPRESA: string;
  AREA: string;
  'ÁREA'?: string;
  PUESTO: string;
  'GRADO DE INSTRUCCIÓN': string;
  'BATERIAS PSICOLOGICAS': string;
  'ENTREVISTA POR COMPETENCIAS': string;
  ESTADO: string;
  'FECHA DE EVALUACIÓN': string;
  'FECHA DE EVALUACION'?: string;
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
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#06b6d4", // Cyan
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
          const empresa = row.EMPRESA || 'Sin Empresa';
          if (!groups[empresa]) {
            groups[empresa] = {
              id: Object.keys(groups).length + 1,
              name: empresa,
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
          
          const group = groups[empresa];
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

          // Real Gender Detection
          const gender = detectGender(row['APELLIDOS Y NOMBRES'] || '');
          if (gender === 'MASCULINO') {
            group.genderData[0].value++;
          } else {
            group.genderData[1].value++;
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
        const questions = rows[0].slice(6, 35);
        
        const scoreMap: Record<string, number> = {
          'SIEMPRE': 5,
          'MUCHAS VECES': 4,
          'ALGUNAS VECES': 3,
          'POCAS VECES': 2,
          'NUNCA': 1
        };

        const getScore = (val: string) => {
          const v = (val || "").trim();
          if (/^[1-5]$/.test(v)) return parseInt(v);
          return scoreMap[v.toUpperCase()] || 0;
        };

        // Question Grouping Indices (0-indexed from CSV) - SHIFTED BY 2 (Col G start)
        const catIndices = {
          liderazgo: [6, 9, 10, 11, 13],
          gestion: [7, 8, 12, 14, 29, 30, 33],
          participacion: [15, 16, 17, 18, 22, 32, 34],
          cultura: [19, 20, 21, 23, 24, 25, 26, 27, 28, 31]
        };

        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[1]) continue;

          const calcAvg = (indices: number[]) => {
            const scores = indices.map(idx => getScore(r[idx])).filter(s => s > 0);
            return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) * 20 : 0; 
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
            area: (r[1] || 'SIN ÁREA').trim().toUpperCase(),
            fecha: r[2],
            puesto: r[3] || 'No especificado',
            empresa: r[5] || 'No especificada', // FILTRO COLUMNA F (index 5)
            scores,
            totalScore,
            comentarios: r[35] || '',
            rawResponses: r.slice(6, 35),
            questions
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

// ============================================
// FUNCION PARSER LOCUS DE CONTROL
// ============================================
export const fetchLocusControlData = async (sheetId: string): Promise<LocusControlData> => {
  // Use the specific GID for "BASE DE CONTROL"
  const gid = "246660500";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch Locus de Control data');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(csvText, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        // The sheet has headers in the first row
        if (rows.length < 2) {
          reject(new Error("No data found in Locus de Control sheet"));
          return;
        }

        const internalKey: Record<number, string> = {
          1: 'b', 2: 'a', 3: 'a', 4: 'a', 5: 'b', 6: 'b', 7: 'b', 8: 'a', 9: 'a', 10: 'a',
          11: 'a', 12: 'a', 13: 'b', 14: 'b', 15: 'b', 16: 'b', 17: 'b', 18: 'a', 19: 'b', 20: 'b',
          21: 'a', 22: 'a', 23: 'b'
        };

        const entries: LocusControlEntry[] = [];
        const riskCounts = { 'RIESGO ALTO': 0, 'RIESGO MEDIO': 0, 'APTO': 0 };

        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[0] || r[0] === 'APELLIDOS Y NOMBRES') continue;

          let internalScore = 0;
          // Questions P1 to P23 are in columns D to Z (indices 3 to 25)
          for (let q = 1; q <= 23; q++) {
            const responseValue = (r[q + 2] || '').trim().toLowerCase();
            if (responseValue === internalKey[q]) {
              internalScore++;
            }
          }

          const externalScore = 23 - internalScore;
          
          // User Classification:
          // 19 to 23 points: Apto
          // 13 to 18 points: Riesgo medio
          // 12 points or less: Riesgo alto
          let result: string;
          if (internalScore >= 19) {
            result = 'APTO';
          } else if (internalScore >= 13) {
            result = 'RIESGO MEDIO';
          } else {
            result = 'RIESGO ALTO';
          }

          if (riskCounts[result as keyof typeof riskCounts] !== undefined) {
            riskCounts[result as keyof typeof riskCounts]++;
          }

          entries.push({
            id: i,
            name: r[0],
            company: r[1],
            position: r[2],
            internalScore,
            externalScore,
            result,
            date: '2024-04-17' // Placeholder or extracting from somewhere if available
          });
        }

        const avgInternal = entries.length > 0 ? entries.reduce((acc, curr) => acc + curr.internalScore, 0) / entries.length : 0;
        const avgExternal = entries.length > 0 ? entries.reduce((acc, curr) => acc + curr.externalScore, 0) / entries.length : 0;

        const riskDistribution = [
          { name: 'RIESGO ALTO', value: riskCounts['RIESGO ALTO'] },
          { name: 'RIESGO MEDIO', value: riskCounts['RIESGO MEDIO'] },
          { name: 'APTO', value: riskCounts['APTO'] }
        ];

        resolve({
          totalEvaluated: entries.length,
          avgInternal,
          avgExternal,
          riskDistribution,
          entries
        });
      },
      error: reject
    });
  });
};

// ============================================
// FUNCION PARSER DIMENSIONES
// ============================================
// Helper: fetch and parse a report sheet into a name→report map
const fetchReportSheet = async (
  sheetId: string,
  gid: string
): Promise<Map<string, DimensionReport>> => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return new Map();
    const csv = await res.text();
    const map = new Map<string, DimensionReport>();
    await new Promise<void>((resolve) => {
      Papa.parse(csv, {
        header: false,
        skipEmptyLines: false,
        complete: (results) => {
          const rows = results.data as string[][];
          // Row 0 is header, data starts from row 1
          for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            const name = (r[1] || '').trim();
            if (!name) continue;
            map.set(name.toUpperCase(), {
              tipo: (r[2] || '').trim(),
              fortalezas: (r[3] || '').trim(),
              riesgos: (r[4] || '').trim(),
              enfoque: (r[5] || '').trim(),
            });
          }
          resolve();
        },
      });
    });
    return map;
  } catch {
    return new Map();
  }
};

export const fetchDimensionesData = async (sheetId: string): Promise<DimensionesDashboardData> => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=pagina%20principal`;

  // Fetch all sheets in parallel
  const [mainRes, culturaMap, comunicacionMap, percepcionMap, liderazgoMap] = await Promise.all([
    fetch(url),
    fetchReportSheet(sheetId, '1175296027'),
    fetchReportSheet(sheetId, '656786103'),
    fetchReportSheet(sheetId, '495762530'),
    fetchReportSheet(sheetId, '1509919201'),
  ]);

  if (!mainRes.ok) throw new Error('Failed to fetch Dimensiones data');
  const csvText = await mainRes.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        if (rows.length === 0) {
          reject(new Error("No data found in Dimensiones sheet (pagina principal)"));
          return;
        }

        // Clean headers from meta.fields (more reliable than Object.keys)
        const keys = (results.meta.fields || []);
        
        // Helper to find column key by keywords
        const getK = (keywords: string[]) => keys.find(k => {
           const s = k.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
           return keywords.some(kw => s.includes(kw));
        });

        // Dynamic mapping based on header analysis
        const map = {
            nombre: getK(["NOMBRE", "APELLIDOS", "COLABORADOR", "PACIENTE", "EVALUADO"]) || keys[0],
            dni: getK(["DNI", "NUMERO DNI", "NRO DNI", "D.N.I."]) || keys[2], // Columna C (index 2)
            empresa: getK(["EMPRESA"]),
            area: getK(["AREA", "ÁREA"]),
            cargo: getK(["CARGO", "PUESTO", "CARGO ACTUAL"]),
            lba: getK(["LIDERAZGO %", "% LIDERAZGO", "LBA"]) || keys[7], // Columna H (index 7)
            lbaNivel: getK(["NIVEL LIDERAZGO", "LIDERAZGO NIVEL", "VALOR LIDERAZGO"]) || keys[8], // Columna I (index 8)
            percepcion: getK(["PERCEPCION %", "% PERCEPCION", "RIESGOS %", "RIESGO %"]) || keys[10], // Columna K (index 10)
            percepcionNivel: getK(["NIVEL PERCEPCION", "RIESGOS NIVEL", "VALOR RIESGO"]) || keys[11], // Columna L (index 11)
            belbin: getK(["BELBIN"]),
            ema: getK(["EMA"]),
            bf: getK(["BIG FIVE", "BF", "PERSONALIDAD"]),
            entrevista: getK(["ENTREVISTA"]),
            total: getK(["TOTAL", "PUNTUACION"]),
            nivel: getK(["NIVEL"]),
            perfil: getK(["PERFIL"]),
            sexo: getK(["SEXO", "GENERO", "SEX", "H/M"]),
            insightPercepcion: getK(["INSIGHT PERCEPCION", "COMENTARIO RIESGO", "ACCION RIESGO"]) || keys[12] // Columna M (index 12)
        };

        const entries: DimensionesEntry[] = [];
        
        rows.forEach((r, i) => {
          if (!r[map.nombre] || r[map.nombre].trim() === "") return;

          const cleanPct = (val: any) => {
             if (val === undefined || val === null) return 0;
             const v = String(val).replace('%', '').trim();
             return parseFloat(v) || 0;
          };

          // Calculation logic based on mapped columns
          const lbaPct = cleanPct(r[map.lba || ""]);
          const percepcionPct = cleanPct(r[map.percepcion || ""]);
          
          // Priorizamos los porcentajes directos proporcionados por el usuario
          const liderazgoReal = lbaPct;
          const percepcionReal = percepcionPct;

          const totalScore = cleanPct(r[map.total || ""]);
          
          // EMA or Big Five as proxy for other scores if needed, but for perception we use percepcionReal
          const bfVal = cleanPct(r[map.bf || ""]);
          const emaVal = cleanPct(r[map.ema || ""]);
          
          let genero: 'MASCULINO' | 'FEMENINO' = 'MASCULINO';
          const sexoVal = (r[map.sexo || ""] || "").trim().toUpperCase();
          
          if (sexoVal === 'M' || sexoVal === 'MASCULINO' || sexoVal === 'HOMBRE') {
            genero = 'MASCULINO';
          } else if (sexoVal === 'F' || sexoVal === 'FEMENINO' || sexoVal === 'MUJER') {
            genero = 'FEMENINO';
          } else {
            // Fallback al detector por nombre si la columna sexo está vacía o es ambigua
            genero = detectGender(r[map.nombre] || '');
          }

          // Extracción inteligente de DNI: Debe contener números y no parecer un nombre largo
          let dniVal = "";
          const dniCandidates = [map.dni, keys[2], keys[1], keys[0]]; 
          for (const cand of dniCandidates) {
            if (!cand) continue;
            let val = String(r[cand] || "").trim();
            
            // Normalización: Corregir 'O' por '0' (error común de tipeo)
            val = val.replace(/O/g, '0');

            // Si contiene al menos un número y no tiene ráfagas de letras largas (evita nombres)
            if (/\d/.test(val) && !/[a-zA-Z]{5,}/.test(val)) {
              // Si parece un DNI peruano de 8 dígitos y le falta el cero inicial
              if (/^\d{7}$/.test(val)) val = "0" + val;
              dniVal = val;
              break;
            }
          }

          const nameKey = (r[map.nombre] || '').trim().toUpperCase();

          entries.push({
            id: i + 1,
            nombre: r[map.nombre],
            dni: dniVal || "No registrado",
            empresa: (r[map.empresa || ""] || r[keys[4]] || "").trim(),
            area: (r[map.area || ""] || r[keys[5]] || "").trim(),
            cargo: (r[map.cargo || ""] || r[keys[6]] || "").trim(),
            puntuacionLiderazgo: liderazgoReal,
            puntuacionPercepcion: percepcionReal,
            total: totalScore,
            nivel: (r[map.nivel || ""] || r[map.lbaNivel || ""] || "Normal").trim(),
            perfil: (r[map.perfil || ""] || r[map.percepcionNivel || ""] || "").trim(),
            genero,
            lbaScore: lbaPct,
            belbinScore: cleanPct(r[map.belbin || ""]),
            emaScore: emaVal,
            bigFiveScore: bfVal,
            entrevistaScore: cleanPct(r[map.entrevista || ""]),
            insightPercepcion: (r[map.insightPercepcion || ""] || "").trim(),
            // JOIN con las hojas de reporte cualitativo
            culturaReport: culturaMap.get(nameKey),
            comunicacionReport: comunicacionMap.get(nameKey),
            percepcionReport: percepcionMap.get(nameKey),
            liderazgoReport: liderazgoMap.get(nameKey),
          });
        });

        resolve({
          entries,
          totalEvaluated: entries.length,
          avgScore: entries.length > 0 ? entries.reduce((acc, e) => acc + e.total, 0) / entries.length : 0
        });
      },
      error: reject
    });
  });
};
