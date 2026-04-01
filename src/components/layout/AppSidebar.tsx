import { NavLink, useLocation } from "react-router-dom";
import {
  Presentation,
  UsersRound,
  ClipboardCheck,
  LayoutDashboard,
  BarChart3,
  Target,
  CheckSquare,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export const navItems = [
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

export const SidebarContent = ({ collapsed = false, onItemClick }: { collapsed?: boolean, onItemClick?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section - Premium Design */}
      <div className={cn(
        "flex flex-col items-center justify-center py-10 px-4 border-b border-sidebar-border relative overflow-hidden transition-all duration-500",
        collapsed ? "py-6" : "py-10"
      )}>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl opacity-50" />
        
        <div className={cn(
          "relative group transition-all duration-500",
          collapsed ? "mb-0" : "mb-5"
        )}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/30 to-accent/30 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-[28px] p-2 border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
             <img 
               src={logo} 
               alt="LideraMina" 
               className={cn(
                 "transition-all duration-500 rounded-[20px] object-contain",
                 collapsed ? "w-10 h-10" : "w-16 h-16"
               )}
             />
          </div>
        </div>

        {!collapsed && (
          <div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-700">
            <span className="text-xl font-black text-sidebar-foreground tracking-[-0.05em] uppercase italic">
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
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                isActive
                  ? "bg-sidebar-foreground/20 text-sidebar-foreground shadow-lg shadow-black/10 ring-1 ring-white/10"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("shrink-0 transition-transform duration-300", isActive ? "w-5 h-5 scale-110" : "w-5 h-5")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive/80 hover:text-white hover:bg-destructive transition-all duration-300 w-full group"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 hidden md:flex flex-col gradient-primary transition-all duration-500 border-r border-sidebar-border shadow-2xl relative z-40",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <SidebarContent collapsed={collapsed} />
      
      {/* Collapse Toggle Button - Desktop Only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-sidebar-border border border-sidebar-border flex items-center justify-center text-sidebar-foreground hover:bg-primary transition-colors shadow-lg z-50"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default AppSidebar;
