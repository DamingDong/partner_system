import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Cards from '@/pages/Cards';
import RevenueSharing from '@/pages/RevenueSharing';
import Reconciliation from '@/pages/Reconciliation';
import Partners from '@/pages/Partners';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import { Orders } from '@/pages/Orders';

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            } />
            <Route path="/forgot-password" element={
              isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />
            } />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="cards" element={<Cards />} />
              <Route path="orders" element={<Orders />} />
              <Route path="revenue-sharing" element={<RevenueSharing />} />
              <Route path="reconciliation" element={<Reconciliation />} />
              <Route path="partners" element={<Partners />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;