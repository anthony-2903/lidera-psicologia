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
  Activity,
  Brain,
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
  { label: "Seguimiento de Aplicación", icon: BarChart3, path: "/app/diagnostic" },
  { label: "Mejora Conductual", icon: Target, path: "/app/improvement" },
  { label: "Plan de Acción", icon: CheckSquare, path: "/app/action-plan" },
  { label: "Resultados", icon: TrendingUp, path: "/app/results" },
  { label: "Dashboard Final", icon: LayoutDashboard, path: "/app/final-dashboard" },
  { label: "DPMS-Raura", icon: Activity, path: "/app/dpms-raura" },
  { label: "Locus de Control", icon: Brain, path: "/app/locus-control" },
];

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../auth/AuthProvider";

export const SidebarContent = ({ collapsed = false, onItemClick }: { collapsed?: boolean, onItemClick?: () => void }) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const allowedViews = profile?.allowed_views || [];
  const isAdmin = profile?.is_admin || false;
  const isActive = profile?.is_active !== false;

  // Filtrar los nav items según lo que tenga permitido
  const visibleNavItems = navItems.filter((item) => {
    if (!profile) return false; // Mientras carga el perfil, no mostramos nada para seguridad
    if (!isActive) return false;
    return allowedViews.includes(item.path);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section - Compact horizontal strip */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-sidebar-border relative overflow-hidden transition-all duration-500",
        collapsed ? "justify-center px-2" : ""
      )}>
        <div className="absolute -top-6 -left-6 w-20 h-20 bg-accent/20 rounded-full blur-2xl opacity-30 pointer-events-none" />

        <div className="relative shrink-0 group">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/30 to-accent/30 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-1.5 border border-white/10 shadow-lg ring-1 ring-white/5">
            <img
              src={logo}
              alt="LideraMina"
              className={cn(
                "transition-all duration-500 rounded-lg object-contain",
                collapsed ? "w-8 h-8" : "w-9 h-9"
              )}
            />
          </div>
        </div>

        {!collapsed && (
          <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-500">
            <span className="text-sm font-black text-sidebar-foreground tracking-[-0.04em] uppercase italic leading-tight truncate">
              Lidera<span className="text-accent">Mina</span>
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-sidebar-foreground/40 leading-tight">
              Safety Leadership
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {visibleNavItems.map((item) => {
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
        {isAdmin && (
          <NavLink
            to="/app/admin"
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 mt-4 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10",
              location.pathname === "/app/admin" && "bg-emerald-500/20 shadow-lg ring-1 ring-emerald-500/50"
            )}
            title={collapsed ? "Admin Panel" : undefined}
          >
            <UsersRound className={cn("shrink-0 transition-transform duration-300")} />
            {!collapsed && <span className="truncate">Panel de Accesos</span>}
          </NavLink>
        )}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
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
        "h-[calc(100vh-3rem)] sticky top-6 hidden md:flex flex-col ml-6 my-6 transition-all duration-700 ease-mac z-40 group",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-[2.5rem] shadow-2xl shadow-black/30 overflow-hidden border border-white/5 ring-1 ring-white/10">
         {/* Animated Background Pulse */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent)] animate-pulse" />
         <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-12 -translate-x-[50%] animate-[slow-pan_15s_infinite_linear]" />
         
         <div className="relative h-full flex flex-col backdrop-blur-2xl">
            <SidebarContent collapsed={collapsed} />
         </div>
      </div>
      {/* Collapse Toggle Button - Desktop Only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-sidebar-foreground hover:bg-white/20 transition-all shadow-2xl z-50 group/toggle"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover/toggle:opacity-100 transition-opacity" />
        {collapsed ? <ChevronRight className="w-5 h-5 relative z-10" /> : <ChevronLeft className="w-5 h-5 relative z-10" />}
      </button>
    </aside>
  );
};

export default AppSidebar;
