import { useEffect, useState } from 'react'
import { createHttpClient } from '../lib/httpClient.js'
import { createLocalTokenStore } from '../lib/tokenStore.js'
import { createAuthApi } from '../features/auth/api.js'
import { createMonitorApi } from '../features/monitors/api.js'
import { createAuthUseCases } from '../features/auth/usecases.js'
import { createMonitorUseCases } from '../features/monitors/usecases.js'
import { useAuth } from '../features/auth/hooks.js'
import { LoginForm } from '../features/auth/components/LoginForm.jsx'
import { DashboardScreen } from './DashboardScreen.jsx'
import { MonitorDetailScreen } from '../features/monitors/components/MonitorDetailScreen.jsx'

// Composition root: the only place that wires layers together.
const tokenStore = createLocalTokenStore()
const http = createHttpClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  getToken: () => tokenStore.load(),
})
const authUC = createAuthUseCases({ authGateway: createAuthApi(http), tokenStore })
const monitorUC = createMonitorUseCases({ monitorGateway: createMonitorApi(http) })

function Shell() {
  const auth = useAuth(authUC)
  const [selectedId, setSelectedId] = useState(null)
  const [dashKey, setDashKey] = useState(0)
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('pulse_theme')
      if (stored === 'light' || stored === 'dark') return stored
    } catch {
      /* private mode: fall through */
    }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('pulse_theme', theme)
    } catch {
      /* private mode: theme just won't persist */
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#ffffff' : '#121212')
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  // Restore once on mount (restore is ref-stable, see useAuth).
  const { restore } = auth
  useEffect(() => {
    restore()
  }, [restore])

  if (auth.checking) return <div className="wrap muted">loading…</div>
  if (!auth.user) {
    return <LoginForm onLogin={auth.login} onRegister={auth.register} error={auth.error} busy={auth.busy} />
  }
  if (selectedId) {
    return (
      <MonitorDetailScreen
        monitorUC={monitorUC}
        id={selectedId}
        onBack={() => setSelectedId(null)}
        onChanged={() => setDashKey((k) => k + 1)}
        user={auth.user}
        onLogout={auth.logout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }
  return (
    <DashboardScreen
      key={dashKey}
      user={auth.user}
      monitorUC={monitorUC}
      onLogout={auth.logout}
      onSelect={setSelectedId}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}

export default function App() {
  return <Shell />
}
