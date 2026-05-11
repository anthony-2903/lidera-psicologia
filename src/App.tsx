import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RecoveryPage = lazy(() => import("./pages/RecoveryPage"));
const AppLayout = lazy(() => import("./components/layout/AppLayout"));
const DashboardPage = lazy(() => import("./pages/app/DashboardPage"));
const DiagnosticPage = lazy(() => import("./pages/app/DiagnosticPage"));
const FinalDashboardPage = lazy(() => import("./pages/app/FinalDashboardPage"));
const DpmsRauraPage = lazy(() => import("./pages/app/dpms-raura/DpmsRauraPage"));
const DriverSafetyPage = lazy(() => import("./pages/app/driver-safety/DriverSafetyPage"));
const AdminUsersPage = lazy(() => import("./pages/app/AdminUsersPage"));
const DimensionesPage = lazy(() => import("./pages/app/DimensionesPage"));
const UploadDpmsPage = lazy(() => import("./pages/app/dpms-raura/UploadDpmsPage"));
const WelcomePage = lazy(() => import("./pages/app/WelcomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/recovery" element={<RecoveryPage />} />
              
              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<AppLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="diagnostic" element={<DiagnosticPage />} />
                  <Route path="final-dashboard" element={<FinalDashboardPage />} />
                  <Route path="dpms-raura" element={<DpmsRauraPage />} />
                  <Route path="dpms-raura/upload-interview" element={<UploadDpmsPage />} />
                  <Route path="driver-safety" element={<DriverSafetyPage />} />
                   <Route path="dimensiones" element={<DimensionesPage />} />
                   <Route path="admin" element={<AdminUsersPage />} />
                   <Route path="welcome" element={<WelcomePage />} />
                 </Route>
               </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
