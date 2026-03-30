import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const breadcrumbMap: Record<string, string> = {
  presentation: "Presentación",
  groups: "Grupos",
  evaluated: "Evaluados",
  evaluations: "Evaluaciones",
  diagram: "Diagrama Individual",
  dashboard: "Dashboard General",
  participants: "Conteo de Participantes",
  diagnostic: "Dashboard Diagnóstico",
  improvement: "Mejora Conductual",
  "action-plan": "Plan de Acción",
  results: "Resultados",
  "final-dashboard": "Dashboard Final",
};

const AppLayout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentSegment = pathSegments[pathSegments.length - 1];
  const currentLabel = breadcrumbMap[currentSegment] || currentSegment;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar - Left side */}
      <AppSidebar />

      {/* Main Content - 80% */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header with breadcrumb */}
        <header className="h-14 border-b border-border bg-card px-6 flex items-center gap-2 shrink-0">
          <Link to="/app/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          <span className="text-sm font-medium text-foreground">{currentLabel}</span>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
