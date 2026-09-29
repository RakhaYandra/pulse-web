import { useEffect, useState } from 'react'
import { useDashboard } from '../features/monitors/hooks.js'
import { countOpen } from '../domain/stats.js'
import { ago } from '../utils/formatDate.js'
import { SummaryStats } from '../components/ui/Stats.jsx'
import { Topbar } from '../components/ui/Topbar.jsx'
import { MonitorList } from '../features/monitors/components/MonitorList.jsx'
import { IncidentList } from '../features/incidents/components/IncidentList.jsx'
import { ReportsView } from '../features/reports/components/ReportsView.jsx'
import { MonitorForm } from '../features/monitors/components/MonitorForm.jsx'

export function DashboardScreen({ user, monitorUC, onLogout, onSelect, theme, onToggleTheme }) {
  const { summary, monitors, incidents, loading, loadError, stale, actionError, pendingId, updatedAt, reload, create, toggle, remove } =
    useDashboard(monitorUC)
  const [tab, setTab] = useState('monitors')
  // Tick so "Updated Ns ago" stays honest between 15s polls.
  const [, setNow] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(t)
  }, [])

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

  const tabs = (
    <nav aria-label="Dashboard sections">
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
  )

  return (
    <>
      <Topbar email={user.email} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="wrap wrap-wide">
        <SummaryStats summary={summary} />
        {stale && (
          <div className="error" role="status">
            Live update failed ({stale}). Showing data from {ago(updatedAt)}.
          </div>
        )}
        {actionError && (
          <div className="error" role="alert">
            {actionError}
          </div>
        )}
        {open > 0 && (
          <section aria-label="Attention" className="banner">
            <strong>
              {open} open incident{open === 1 ? '' : 's'}
            </strong>
            . Attention needed.{' '}
            <button className="link" onClick={() => setTab('incidents')}>
              View incidents
            </button>
          </section>
        )}
        {tab === 'monitors' && open > 0 ? (
          <div className="dash-grid">
            {tabs}
            <h3 className="attention-title">Attention</h3>
            <div className="tab-body">
              <MonitorList monitors={monitors} pendingId={pendingId} onSelect={onSelect} onToggle={toggle} onRemove={remove} />
            </div>
            <aside aria-label="Open incidents">
              <IncidentList incidents={incidents.filter((i) => i.status === 'OPEN')} onSelect={onSelect} />
            </aside>
          </div>
        ) : (
          <>
            {tabs}
            {tab === 'monitors' && (
              <MonitorList monitors={monitors} pendingId={pendingId} onSelect={onSelect} onToggle={toggle} onRemove={remove} />
            )}
          </>
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
    </>
  )
}
