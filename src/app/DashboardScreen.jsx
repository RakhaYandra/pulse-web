import { useState } from 'react'
import { useDashboard } from '../features/monitors/hooks.js'
import { countOpen } from '../domain/stats.js'
import { ago } from '../utils/formatDate.js'
import { SummaryStats } from '../components/ui/Stats.jsx'
import { MonitorList } from '../features/monitors/components/MonitorList.jsx'
import { IncidentList } from '../features/incidents/components/IncidentList.jsx'
import { ReportsView } from '../features/reports/components/ReportsView.jsx'
import { MonitorForm } from '../features/monitors/components/MonitorForm.jsx'

export function DashboardScreen({ user, monitorUC, onLogout, onSelect }) {
  const { summary, monitors, incidents, loading, loadError, updatedAt, reload, create, toggle, remove } =
    useDashboard(monitorUC)
  const [tab, setTab] = useState('monitors')

  if (loading)
    return (
      <div className="wrap">
        <p className="muted">Loading monitors…</p>
      </div>
    )
  if (loadError) {
    return (
      <div className="wrap">
        <p className="error">{loadError}</p>
        <button onClick={reload}>Retry</button>
      </div>
    )
  }

  const open = countOpen(incidents)

  return (
    <div className="wrap">
      <header>
        <h1>Pulse</h1>
        <div>
          {user.email}{' '}
          <button className="link" onClick={onLogout}>
            logout
          </button>
        </div>
      </header>
      <SummaryStats summary={summary} />
      {open > 0 && (
        <button className="banner" onClick={() => setTab('incidents')}>
          <strong>
            {open} open incident{open === 1 ? '' : 's'}
          </strong>
          . Attention needed. View details.
        </button>
      )}
      <nav>
        <button className={tab === 'monitors' ? 'active' : ''} onClick={() => setTab('monitors')}>
          Monitors
        </button>
        <button className={tab === 'incidents' ? 'active' : ''} onClick={() => setTab('incidents')}>
          Incidents ({open})
        </button>
        <button className={tab === 'reports' ? 'active' : ''} onClick={() => setTab('reports')}>
          Reports
        </button>
        <button className={tab === 'new' ? 'active' : ''} onClick={() => setTab('new')}>
          + New
        </button>
      </nav>
      {tab === 'monitors' && (
        <MonitorList monitors={monitors} onSelect={onSelect} onToggle={toggle} onRemove={remove} />
      )}
      {tab === 'incidents' && <IncidentList incidents={incidents} onSelect={onSelect} />}
      {tab === 'reports' && <ReportsView monitorUC={monitorUC} />}
      {tab === 'new' && <MonitorForm onCreate={create} />}
      <p className="muted freshness">
        Updated {ago(updatedAt)} ·{' '}
        <button className="link" onClick={reload}>
          Refresh now
        </button>
      </p>
    </div>
  )
}
