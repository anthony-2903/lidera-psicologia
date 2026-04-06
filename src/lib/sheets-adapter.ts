import Papa from 'papaparse';

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
