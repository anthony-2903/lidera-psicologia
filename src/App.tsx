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
const PresentationPage = lazy(() => import("./pages/app/PresentationPage"));
const GroupsPage = lazy(() => import("./pages/app/GroupsPage"));
const TestApplicationPage = lazy(() => import("./pages/app/TestApplicationPage"));
const EvaluatedPage = lazy(() => import("./pages/app/EvaluatedPage"));
const EvaluationsPage = lazy(() => import("./pages/app/EvaluationsPage"));
const DiagramPage = lazy(() => import("./pages/app/DiagramPage"));
const ParticipantsPage = lazy(() => import("./pages/app/ParticipantsPage"));
const DiagnosticPage = lazy(() => import("./pages/app/DiagnosticPage"));
const ImprovementPage = lazy(() => import("./pages/app/ImprovementPage"));
const ActionPlanPage = lazy(() => import("./pages/app/ActionPlanPage"));
const ResultsPage = lazy(() => import("./pages/app/ResultsPage"));
const FinalDashboardPage = lazy(() => import("./pages/app/FinalDashboardPage"));
const DpmsRauraPage = lazy(() => import("./pages/app/dpms-raura/DpmsRauraPage"));
const LocusControlPage = lazy(() => import("./pages/app/locus-control/LocusControlPage"));
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
                  <Route path="presentation" element={<PresentationPage />} />
                  <Route path="groups" element={<GroupsPage />} />
                  <Route path="test-application" element={<TestApplicationPage />} />
                  <Route path="evaluations" element={<EvaluationsPage />} />
                  <Route path="diagram" element={<DiagramPage />} />
                  <Route path="participants" element={<ParticipantsPage />} />
                  <Route path="diagnostic" element={<DiagnosticPage />} />
                  <Route path="improvement" element={<ImprovementPage />} />
                  <Route path="action-plan" element={<ActionPlanPage />} />
                  <Route path="results" element={<ResultsPage />} />
                  <Route path="final-dashboard" element={<FinalDashboardPage />} />
                  <Route path="dpms-raura" element={<DpmsRauraPage />} />
                  <Route path="dpms-raura/upload-interview" element={<UploadDpmsPage />} />
                  <Route path="locus-control" element={<LocusControlPage />} />
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
