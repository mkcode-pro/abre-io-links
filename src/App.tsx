import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import Index from "@/pages/Index";
import { Dashboard } from "@/pages/Dashboard";
import { Auth } from "@/pages/Auth";
import BioPage from "@/pages/BioPage";
import Pricing from "@/pages/Pricing";
import { BioEditor } from "@/components/bio/BioEditor";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

// Admin imports
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { UserManagement } from "@/pages/admin/UserManagement";
import { AdvancedAnalytics } from "@/pages/admin/AdvancedAnalytics";
import FinancialManagement from "@/pages/admin/FinancialManagement";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/bio/:username" element={<BioPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/app" element={<Index />} />
              
              {/* Rotas protegidas de usuários */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/bio-editor" 
                element={
                  <ProtectedRoute>
                    <div className="p-6">
                      <BioEditor />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas administrativas independentes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="analytics" element={<AdvancedAnalytics />} />
                <Route path="financial" element={<FinancialManagement />} />
                {/* Outras rotas admin serão adicionadas nas próximas etapas */}
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
