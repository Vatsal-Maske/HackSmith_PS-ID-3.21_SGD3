import { useMemo, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import './firebase.js'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AuthPopup from './components/AuthPopup.jsx'

const pageTitle = {
  dashboard: 'Dashboard',
  map: 'Live AQI Map',
  risk: 'Disease Risk Analysis',
  reports: 'Reports',
  api: 'API Access',
  settings: 'Settings',
}

export default function App() {
  const [active, setActive] = useState('dashboard')
  const [city, setCity] = useState('Nagpur')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const main = useMemo(() => {
    if (active === 'dashboard') return <DashboardPage city={city} />
    return <ComingSoon title={pageTitle[active] || 'Page'} />
  }, [active, city])

  return (
    <div className="h-full">
      <div className="flex h-full">
        <Sidebar activeKey={active} onChange={setActive} />

        <div className="flex h-full min-w-0 flex-1 flex-col">
          <Header city={city} onCityChange={setCity}>
            <AuthPopup user={user} onAuthChange={setUser} />
          </Header>

          <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-6 md:px-6">
            {main}
          </main>
        </div>
      </div>
    </div>
  )
}
