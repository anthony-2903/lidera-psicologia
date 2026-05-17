import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = () => {
  const { session, profile, loading: authLoading } = useAuth();
  const location = useLocation();
  // El timeout inseguro fue removido para garantizar deny-by-default

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si no tenemos perfil cargado, mostramos loading state (sin límite de tiempo inseguro)
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Verificando Credenciales...</p>
      </div>
    );
  }

  const allowedViews = profile?.allowed_views || [];
  const currentPath = location.pathname;

  // Si es admin, permitimos paso
  if (profile?.is_admin) {
    return <Outlet />;
  }

  // Redirección especial para la raíz de /app
  if (currentPath === "/app" || currentPath === "/app/") {
    if (allowedViews.includes("/app/dashboard")) {
      return <Navigate to="/app/dashboard" replace />;
    } else if (allowedViews.length > 0) {
      return <Navigate to={allowedViews[0]} replace />;
    }
  }

  // Verificar si tiene permiso para la ruta actual
  // EXCEPT: Welcome page is always allowed for authenticated users
  const isWelcomePage = currentPath === "/app/welcome";
  const isAllowed = isWelcomePage || allowedViews.some(view => currentPath.startsWith(view));

  if (!isAllowed && allowedViews.length > 0) {
    return <Navigate to={allowedViews[0]} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
