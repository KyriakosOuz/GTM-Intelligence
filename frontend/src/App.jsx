import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import NavPanel from './components/NavPanel'
import TopNavbar from './components/TopNavbar'
import Dashboard from './pages/Dashboard'
import Deals from './pages/Deals'
import Intelligence from './pages/Intelligence'
import Network from './pages/Network'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/deals': 'Deals',
  '/intelligence': 'Intelligence',
  '/network': 'Network',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

function AppLayout() {
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <div className="flex">
      <Sidebar />
      <NavPanel />
      <main className="flex-1 ml-[272px] min-h-screen pb-[80px]">
        <TopNavbar pageTitle={pageTitle} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/network" element={<Network />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
