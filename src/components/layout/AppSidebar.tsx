import { NavLink, useLocation } from "react-router-dom";
import {
  Presentation,
  Users,
  UserCheck,
  ClipboardList,
  BarChart3,
  PieChart,
  TrendingUp,
  Target,
  CheckSquare,
  LayoutDashboard,
  UsersRound,
  Activity,
  HardHat,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Presentación", icon: Presentation, path: "/app/presentation" },
  { label: "Grupos", icon: UsersRound, path: "/app/groups" },
  { label: "Evaluados", icon: UserCheck, path: "/app/evaluated" },
  { label: "Evaluaciones", icon: ClipboardList, path: "/app/evaluations" },
  { label: "Diagrama Individual", icon: Activity, path: "/app/diagram" },
  { label: "Dashboard General", icon: LayoutDashboard, path: "/app/dashboard" },
  { label: "Conteo Participantes", icon: PieChart, path: "/app/participants" },
  { label: "Dashboard Diagnóstico", icon: BarChart3, path: "/app/diagnostic" },
  { label: "Mejora Conductual", icon: Target, path: "/app/improvement" },
  { label: "Plan de Acción", icon: CheckSquare, path: "/app/action-plan" },
  { label: "Resultados", icon: TrendingUp, path: "/app/results" },
  { label: "Dashboard Final", icon: LayoutDashboard, path: "/app/final-dashboard" },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col gradient-primary transition-all duration-300 border-l border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shrink-0">
          <HardHat className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-sidebar-foreground tracking-tight">
            LideraMina
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-foreground/15 text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5 w-full transition-all duration-200"
        >
          {collapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          {!collapsed && <span>Colapsar</span>}
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 w-full transition-all duration-200"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
