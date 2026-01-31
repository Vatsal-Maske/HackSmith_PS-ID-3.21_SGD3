import { useMemo, useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import MapPage from './pages/MapPage.jsx'
import RiskAnalysisPage from './pages/RiskAnalysisPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const pageTitle = {
  dashboard: 'Dashboard',
  map: 'Live AQI Map',
  risk: 'Disease Risk Analysis',
  reports: 'Reports',
}

export default function App() {
  const [active, setActive] = useState('dashboard')
  const [city, setCity] = useState('New Delhi')

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      if (hash && hash !== '/') {
        const route = hash.replace('/', '');
        if (pageTitle[route]) {
          setActive(route);
        }
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigation = (page) => {
    setActive(page);
    window.location.hash = `/${page}`;
  };

  const main = useMemo(() => {
    if (active === 'dashboard') return <DashboardPage city={city} />
    if (active === 'map') return <MapPage city={city} />
    if (active === 'risk') return <RiskAnalysisPage city={city} />
    if (active === 'reports') return <ReportsPage city={city} />
    return <ComingSoon title={pageTitle[active] || 'Page'} />
  }, [active, city])

  return (
  <ErrorBoundary>
    <AuthProvider>
      <ProtectedRoute>
        <div className="h-full">
          <div className="flex h-full">
            <Sidebar activeKey={active} onChange={setActive} />

            <div className="flex h-full min-w-0 flex-1 flex-col">
              <Header city={city} onCityChange={setCity} onNavigate={handleNavigation} />

              <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-6 md:px-6">
                {main}
              </main>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  </ErrorBoundary>
)
}
