import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = () => {
  const { session, profile, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Fallback para evitar bloqueo permanente si el perfil no carga
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (session && !profile && !authLoading) {
      timer = setTimeout(() => {
        setIsTimedOut(true);
      }, 5000); // 5 segundos de gracia
    }
    return () => clearTimeout(timer);
  }, [session, profile, authLoading]);

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

  // Si tenemos sesión pero no perfil y no ha pasado el tiempo de espera, esperamos
  if (!profile && !isTimedOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Verificando Credenciales...</p>
      </div>
    );
  }

  const allowedViews = profile?.allowed_views || [];
  const currentPath = location.pathname;

  // Si es admin o ha expirado el tiempo, permitimos paso o dashboard por defecto
  if (profile?.is_admin || isTimedOut) {
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
  const isAllowed = allowedViews.some(view => currentPath.startsWith(view));

  if (!isAllowed && allowedViews.length > 0) {
    return <Navigate to={allowedViews[0]} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
