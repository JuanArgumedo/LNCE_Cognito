import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/auth-context";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Landing from "./pages/landing";
import News from "./pages/news";
import Login from "./pages/login";
import Register from "./pages/register";
import AdminDashboard from "./pages/admin-dashboard";
import CommunityDashboard from "./pages/community-dashboard";
import MonitoringDashboard from "./pages/monitoring-dashboard";
import NotFound from "./pages/not-found";
import ProtectedRoute from "./components/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/news" component={News} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin">
        <ProtectedRoute allowedRoles={['administrador']}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/community">
        <ProtectedRoute allowedRoles={['comunidad']}>
          <CommunityDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/monitoring">
        <ProtectedRoute allowedRoles={['administrador', 'comunidad']}>
          <MonitoringDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
