import { Outlet, useLocation } from "react-router-dom";
import AppSidebar, { SidebarContent } from "./AppSidebar";
import { ChevronRight, Home, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const breadcrumbMap: Record<string, string> = {
  presentation: "Presentación",
  groups: "Grupos",
  evaluated: "Evaluados",
  evaluations: "Evaluaciones",
  diagram: "Diagrama Individual",
  dashboard: "Dashboard General",
  participants: "Conteo de Participantes",
  diagnostic: "Seguimiento de Aplicación",
  improvement: "Mejora Conductual",
  "action-plan": "Plan de Acción",
  results: "Resultados",
  "final-dashboard": "Dashboard Final",
};

const AppLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentSegment = pathSegments[pathSegments.length - 1];
  const currentLabel = breadcrumbMap[currentSegment] || currentSegment;

  return (
    <div className="flex min-h-screen w-full bg-background selection:bg-primary/10">
      {/* Desktop Sidebar Container - Fixed/Sticky Wrapper */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header / Top Navigation - Now Sticky but Floating style optionally */}
        <header className="h-16 md:h-20 border-b border-border/10 bg-background/60 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-all border-none">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10 hover:text-primary">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-r-0 w-72 bg-transparent overflow-hidden">
                <div className="h-full gradient-primary">
                   <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <nav className="flex items-center gap-2 md:gap-3">
              <Link to="/app/dashboard" className="p-2 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all">
                <Home className="w-5 h-5" />
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
              <span className="text-sm md:text-base font-bold text-foreground tracking-tight px-3 py-1 rounded-lg bg-muted text-muted-foreground">
                {currentLabel}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Additional header items could go here */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">Sistema Activo</span>
            </div>
          </div>
        </header>

        {/* Content Area - Now part of the main scroll */}
        <div className="flex-1">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
