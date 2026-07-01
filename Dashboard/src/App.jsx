import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import SplashScreen from './pages/Auth/SplashScreen';

const HomePage = lazy(() => import('./pages/HomePage'));
const GlobalRiskMapPage = lazy(() => import('./pages/GlobalRiskMapPage'));
const CountryAnalyticsPage = lazy(() => import('./pages/CountryAnalyticsPage'));
const CommodityAnalyticsPage = lazy(() => import('./pages/CommodityAnalyticsPage'));
const MLInsightsPage = lazy(() => import('./pages/MLInsightsPage'));
const RecommendationPage = lazy(() => import('./pages/RecommendationPage'));
const ForecastPage = lazy(() => import('./pages/ForecastPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Admin Pages
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const SystemLogsPage = lazy(() => import('./pages/admin/SystemLogsPage'));

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingSpinner text="Checking authentication..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<SplashScreen />} />
            
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Suspense fallback={<LoadingSpinner />}><HomePage /></Suspense>} />
              <Route path="/global-risk-map" element={<Suspense fallback={<LoadingSpinner />}><GlobalRiskMapPage /></Suspense>} />
              <Route path="/country-analytics" element={<Suspense fallback={<LoadingSpinner />}><CountryAnalyticsPage /></Suspense>} />
              <Route path="/commodity-analytics" element={<Suspense fallback={<LoadingSpinner />}><CommodityAnalyticsPage /></Suspense>} />
              <Route path="/ml-insights" element={<Suspense fallback={<LoadingSpinner />}><MLInsightsPage /></Suspense>} />
              <Route path="/recommendations" element={<Suspense fallback={<LoadingSpinner />}><RecommendationPage /></Suspense>} />
              <Route path="/forecast" element={<Suspense fallback={<LoadingSpinner />}><ForecastPage /></Suspense>} />
              <Route path="/reports" element={<Suspense fallback={<LoadingSpinner />}><ReportsPage /></Suspense>} />
              <Route path="/profile" element={<Suspense fallback={<LoadingSpinner />}><ProfilePage /></Suspense>} />
              
              {/* Admin Routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin>
                  <Suspense fallback={<LoadingSpinner />}><UserManagementPage /></Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/logs" element={
                <ProtectedRoute requireAdmin>
                  <Suspense fallback={<LoadingSpinner />}><SystemLogsPage /></Suspense>
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
