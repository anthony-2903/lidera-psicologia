import { Activity, LayoutDashboard, Shield, Star, Users, Zap } from "lucide-react";

export const SHEET_ID = "16keeTLLxphGx7QtfRbtDC7yG1ACxyyQui1KypTX43o4";

export const GROUPS = [
  { id: "catalina", label: "Catalina Huanca", color: "bg-blue-600" },
  { id: "contratistas-a", label: "Contratistas - A", color: "bg-red-500" },
  { id: "contratistas-b", label: "Contratistas - B", color: "bg-cyan-500" },
  { id: "contratistas-c", label: "Contratistas - C", color: "bg-amber-500" },
];

export const ROLES = [
  { id: "supervisor", label: "Supervisor", color: "bg-cyan-500" },
  { id: "trabajador", label: "Trabajador", color: "bg-emerald-500" },
];

export type DiagnosticTab =
  | "cultura"
  | "rol"
  | "comunicacion"
  | "percepcion"
  | "liderazgo"
  | "motivacion";

export const DIAGNOSTIC_TABS = [
  { id: "cultura", label: "Cultura de seguridad", icon: Zap, color: "text-amber-500" },
  { id: "rol", label: "Rol de equipo", icon: Users, color: "text-cyan-500" },
  { id: "comunicacion", label: "Comunicación", icon: Shield, color: "text-indigo-500" },
  { id: "percepcion", label: "Percepción de riesgos", icon: LayoutDashboard, color: "text-primary" },
  { id: "liderazgo", label: "Liderazgo", icon: Activity, color: "text-rose-500" },
  { id: "motivacion", label: "Motivación", icon: Star, color: "text-violet-500" },
] satisfies {
  id: DiagnosticTab;
  label: string;
  icon: typeof Zap;
  color: string;
}[];
