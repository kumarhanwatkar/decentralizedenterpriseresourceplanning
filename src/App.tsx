import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/context/Web3Context";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { OrganizationProvider } from "@/context/OrganizationContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import PayrollPage from "./pages/admin/PayrollPage";
import ResourcesPage from "./pages/admin/ResourcesPage";
import TransactionsPage from "./pages/admin/TransactionsPage";
import AIConfigPage from "./pages/admin/AIConfigPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import EmployeeEarningsPage from "./pages/employee/EmployeeEarningsPage";
import EmployeeTransactionsPage from "./pages/employee/EmployeeTransactionsPage";
import EmployeeSettingsPage from "./pages/employee/EmployeeSettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Web3Provider>
        <AuthProvider>
          <OrganizationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <HashRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/payroll" element={<PayrollPage />} />
                  <Route path="/admin/resources" element={<ResourcesPage />} />
                  <Route path="/admin/transactions" element={<TransactionsPage />} />
                  <Route path="/admin/ai-config" element={<AIConfigPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                  
                  {/* Employee Routes */}
                  <Route path="/employee" element={<EmployeeDashboard />} />
                  <Route path="/employee/earnings" element={<EmployeeEarningsPage />} />
                  <Route path="/employee/transactions" element={<EmployeeTransactionsPage />} />
                  <Route path="/employee/settings" element={<EmployeeSettingsPage />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </HashRouter>
            </TooltipProvider>
          </OrganizationProvider>
        </AuthProvider>
      </Web3Provider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
