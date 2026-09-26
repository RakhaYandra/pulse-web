import { useEffect, useState } from 'react'
import { createHttpClient } from './infrastructure/httpClient.js'
import { createApiGateway } from './infrastructure/apiGateway.js'
import { createLocalTokenStore } from './infrastructure/tokenStore.js'
import { createAuthUseCases, createMonitorUseCases } from './application/useCases.js'
import { useAuth } from './presentation/hooks/useAuth.js'
import { LoginForm } from './presentation/components/LoginForm.jsx'
import { DashboardScreen } from './presentation/components/DashboardScreen.jsx'
import { MonitorDetailScreen } from './presentation/components/MonitorDetailScreen.jsx'

// Composition root: the only place that wires layers together.
const tokenStore = createLocalTokenStore()
const http = createHttpClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  getToken: () => tokenStore.load(),
})
const gateway = createApiGateway(http)
const authUC = createAuthUseCases({ authGateway: gateway, tokenStore })
const monitorUC = createMonitorUseCases({ monitorGateway: gateway })

function Shell() {
  const auth = useAuth(authUC)
  const [selectedId, setSelectedId] = useState(null)
  const [dashKey, setDashKey] = useState(0)

  // Restore once on mount (restore is ref-stable, see useAuth).
  const { restore } = auth
  useEffect(() => {
    restore()
  }, [restore])

  if (auth.checking) return <div className="wrap muted">loading…</div>
  if (!auth.user) {
    return <LoginForm onLogin={auth.login} onRegister={auth.register} error={auth.error} />
  }
  if (selectedId) {
    return (
      <MonitorDetailScreen
        monitorUC={monitorUC}
        id={selectedId}
        onBack={() => setSelectedId(null)}
        onChanged={() => setDashKey((k) => k + 1)}
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
    />
  )
}

export default function App() {
  return <Shell />
}
