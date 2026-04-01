export interface EvaluatedPerson {
  id: number;
  name: string;
  status: "Completado" | "En curso" | "Pendiente";
  score: number;
  group: string;
  position: string;
  email: string;
  // - [x] Update Test Application Tabs
  // - [/] New Evaluation Management Module
  // - [ ] Add 'Evaluación' to Sidebar
  // - [ ] Create `EvaluationsPage.tsx` with registration form
  // - [ ] Implement evaluation items/fields list
  // - [ ] Implement table of created evaluation templates
  // - [ ] Remove 'Lista de Evaluaciones' tab from TestApplicationPage
  preDescription: string;
  postDescription: string;
  actionPlan: string;
}

export interface RadarDataItem {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

export interface ComparisonRadarItem {
  subject: string;
  pre: number;
  post: number;
  fullMark: number;
  target: number;
}

export interface BarDataItem {
  name: string;
  valor: number;
}

export interface ResultItem {
  id: string;
  name: string;
  group: string;
  score: number;
  status: string;
  date: string;
  avatar: string;
}

export interface EvaluationLog {
  id: string;
  testName: string;
  evaluatedName: string;
  group: string;
  date: string;
  type: "PRE" | "POST" | "PERIÓDICA";
  status: "Completado" | "En Proceso" | "Expira Pronto";
}

export interface WorkGroup {
  id: string;
  name: string;
  icon: any; // Lucide icon
  count: number;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  risk: string;
  avatar: string;
}
