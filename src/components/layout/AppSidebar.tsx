import { NavLink, useLocation } from "react-router-dom";
import {
  Presentation,
  UsersRound,
  ClipboardCheck,
  LayoutDashboard,
  PieChart,
  BarChart3,
  Target,
  CheckSquare,
  TrendingUp,
  HardHat,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Presentación", icon: Presentation, path: "/app/presentation" },
  { label: "Grupos", icon: UsersRound, path: "/app/groups" },
  { label: "Evaluación", icon: FileText, path: "/app/evaluations" },
  { label: "Aplicación de Pruebas", icon: ClipboardCheck, path: "/app/test-application" },
  { label: "Dashboard General", icon: LayoutDashboard, path: "/app/dashboard" },
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
        "h-screen sticky top-0 flex flex-col gradient-primary transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section - Premium Design */}
      <div className={cn(
        "flex flex-col items-center justify-center py-10 px-4 border-b border-sidebar-border relative overflow-hidden transition-all duration-500",
        collapsed ? "py-6" : "py-10"
      )}>
        {/* Subtle background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl opacity-50" />
        
        <div className={cn(
          "relative group transition-all duration-500",
          collapsed ? "mb-0" : "mb-5"
        )}>
          {/* Outer ring for elegance */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/30 to-accent/30 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative bg-white/5 backdrop-blur-xl rounded-[28px] p-2 border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
             <img 
               src={logo} 
               alt="LideraMina" 
               className={cn(
                 "transition-all duration-500 rounded-[20px] object-contain",
                 collapsed ? "w-10 h-10" : "w-20 h-20"
               )}
             />
          </div>
        </div>

        {!collapsed && (
          <div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-700">
            <span className="text-xl font-black text-sidebar-foreground tracking-[-0.05em] uppercase italic bg-clip-text">
              Lidera<span className="text-accent italic">Mina</span>
            </span>
            <div className="h-[2px] w-8 bg-gradient-to-r from-transparent via-accent/60 to-transparent rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-sidebar-foreground/40 mt-1">
              Safety Leadership
            </span>
          </div>
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
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
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
