import { useEffect, useState } from 'react'
import { useDashboard } from '../hooks/useDashboard.js'
import { countOpen } from '../../domain/stats.js'
import { SummaryStats } from './Stats.jsx'
import { MonitorList, IncidentList, ReliabilityTable } from './Lists.jsx'
import { MonitorForm } from './MonitorForm.jsx'

function ago(ts) {
  if (!ts) return ''
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000))
  return s < 5 ? 'just now' : s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`
}

export function ReportsView({ monitorUC }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    monitorUC.loadReliability(30).then(
      (r) => { if (!cancelled) setRows(r) },
      (ex) => { if (!cancelled) setError(ex.message || 'Failed to load report.') },
    )
    return () => { cancelled = true }
  }, [monitorUC])
  if (error) return <p className="error">{error}</p>
  if (rows === null) return <p className="muted">Loading report…</p>
  return (
    <div>
      <p className="muted">Per-monitor reliability, last 30 days. MTTR averages resolved incidents only.</p>
      <ReliabilityTable rows={rows} />
    </div>
  )
}

export function DashboardScreen({ user, monitorUC, onLogout, onSelect }) {
  const { summary, monitors, incidents, loading, loadError, updatedAt, reload, create, toggle, remove } = useDashboard(monitorUC)
  const [tab, setTab] = useState('monitors')

  if (loading) return <div className="wrap"><p className="muted">Loading monitors…</p></div>
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
        <div>{user.email} <button className="link" onClick={onLogout}>logout</button></div>
      </header>
      <SummaryStats summary={summary} />
      {open > 0 && (
        <button className="banner" onClick={() => setTab('incidents')}>
          <strong>{open} open incident{open === 1 ? '' : 's'}</strong>. Attention needed. View details.
        </button>
      )}
      <nav>
        <button className={tab === 'monitors' ? 'active' : ''} onClick={() => setTab('monitors')}>Monitors</button>
        <button className={tab === 'incidents' ? 'active' : ''} onClick={() => setTab('incidents')}>Incidents ({open})</button>
        <button className={tab === 'reports' ? 'active' : ''} onClick={() => setTab('reports')}>Reports</button>
        <button className={tab === 'new' ? 'active' : ''} onClick={() => setTab('new')}>+ New</button>
      </nav>
      {tab === 'monitors' && <MonitorList monitors={monitors} onSelect={onSelect} onToggle={toggle} onRemove={remove} />}
      {tab === 'incidents' && <IncidentList incidents={incidents} onSelect={onSelect} />}
      {tab === 'reports' && <ReportsView monitorUC={monitorUC} />}
      {tab === 'new' && <MonitorForm onCreate={create} />}
      <p className="muted freshness">Updated {ago(updatedAt)} · <button className="link" onClick={reload}>Refresh now</button></p>
    </div>
  )
}
