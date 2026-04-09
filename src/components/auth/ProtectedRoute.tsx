import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = () => {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const allowedViews = profile?.allowed_views || [];
  const currentPath = location.pathname;

  // Si el usuario intenta ir a /app directamente, lo mandamos al dashboard o a su primera vista
  if (currentPath === "/app" || currentPath === "/app/") {
      if (allowedViews.includes("/app/dashboard")) {
          return <Navigate to="/app/dashboard" replace />;
      } else if (allowedViews.length > 0) {
          return <Navigate to={allowedViews[0]} replace />;
      }
  }

  // Verificar si tiene permiso para la ruta actual
  // Nota: Las rutas hijas en App.tsx no incluyen el prefijo /app en su path definido, 
  // pero location.pathname sí lo incluye.
  const isAllowed = allowedViews.some(view => currentPath.startsWith(view));

  if (profile && !isAllowed && allowedViews.length > 0) {
    console.warn(`Access denied for ${currentPath}. Redirecting to ${allowedViews[0]}`);
    return <Navigate to={allowedViews[0]} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
