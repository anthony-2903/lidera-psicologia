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
        const totalRows = Math.max(0, rows.length - 2); // Omitimos las filas de título/cabeceras
        
        // --- Estructuras Base ---
        // { Eje: { 'MUY BAJO': 0, 'BAJO': 0, ... } }
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
          'Manejo Emo.': {}, 'Relaciones': {}, 'Impulsos': {}, 'Adaptación': {}
        };
        
        const leadCounter: QualityCount = {};
        const behCounter: QualityCount = {};

        // Función Helper para sumar ocurrencias
        const addOccurrence = (counter: Record<string, QualityCount> | QualityCount, category: string, value: string) => {
          if (!value || value.trim() === '') return;
          const val = value.toUpperCase().trim();
          
          if (typeof category === 'string' && counter[category] !== undefined) {
            // Es un récord anidado
            const inner = (counter as Record<string, QualityCount>)[category];
            inner[val] = (inner[val] || 0) + 1;
          } else {
            // Es un quality array base
            const flatCounter = counter as QualityCount;
            flatCounter[val] = (flatCounter[val] || 0) + 1;
          }
        };

        // Procesar Filas (Empezamos en el index 2 porque la 0 y 1 son cabeceras en G-Sheets con merged cells)
        for (let i = 2; i < rows.length; i++) {
          const r = rows[i];
          if (!r[1] || r[1] === '') continue; // Si no hay nombre, saltar

          // PERSONALIDAD (3 al 7)
          addOccurrence(personalityCounter, 'Energía', r[3]);
          addOccurrence(personalityCounter, 'Tesón', r[4]);
          addOccurrence(personalityCounter, 'Afabilidad', r[5]);
          addOccurrence(personalityCounter, 'Esta. Emocional', r[6]);
          addOccurrence(personalityCounter, 'Apertura', r[7]);

          // MOTIVACIONAL (8 al 17)
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

          // EQUIPO (18 al 26)
          addOccurrence(teamCounter, 'Creativo', r[18]);
          addOccurrence(teamCounter, 'Evaluador', r[19]);
          addOccurrence(teamCounter, 'Especialista', r[20]);
          addOccurrence(teamCounter, 'Coordinador', r[21]);
          addOccurrence(teamCounter, 'Cohesionador', r[22]);
          addOccurrence(teamCounter, 'Recursos', r[23]);
          addOccurrence(teamCounter, 'Impulsor', r[24]);
          addOccurrence(teamCounter, 'Implementador', r[25]);
          addOccurrence(teamCounter, 'Finalizador', r[26]);

          // PROYECTIVO (27 al 30)
          addOccurrence(projCounter, 'Manejo Emo.', r[27]);
          addOccurrence(projCounter, 'Relaciones', r[28]);
          addOccurrence(projCounter, 'Impulsos', r[29]);
          addOccurrence(projCounter, 'Adaptación', r[30]);

          // DIRECTOS (31, 32)
          addOccurrence(leadCounter, '', r[31]);
          addOccurrence(behCounter, '', r[32]);
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
        });
      },
      error: reject
    });
  });
};
