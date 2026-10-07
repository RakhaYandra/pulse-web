import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMonitorDetail } from '../hooks.js'
import {
  countOpen,
  uptimePct,
  avgResponseMs,
  latencyStats,
  checkDisplay,
  incidentDuration,
} from '../../../domain/stats.js'
import { formatDateTime, formatCheckTime } from '../../../utils/formatDate.js'
import { Dot } from '../../../components/ui/Dot.jsx'
import { Spark } from '../../../components/ui/Spark.jsx'
import { DetailStats } from '../../../components/ui/Stats.jsx'
import { Topbar } from '../../../components/ui/Topbar.jsx'
import { Sidebar } from '../../../components/ui/Sidebar.jsx'
import { Drawer } from '../../../components/ui/Drawer.jsx'
import { MonitorForm } from './MonitorForm.jsx'

export function MonitorDetailScreen({ monitorUC, user, onLogout, theme, onToggleTheme }) {
  const { id } = useParams()
  const navigate = useNavigate()
  // Direct loads have no in-app history: fall back to the dashboard.
  const onBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }
  const {
    monitor: m,
    checks,
    incidents,
    loading,
    loadError,
    stale,
    actionError,
    pending,
    reload,
    toggle,
  } = useMonitorDetail(monitorUC, id)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const goTab = (t) => navigate(t === 'monitors' ? '/' : `/?tab=${t}`)
  const createHere = async (form) => {
    try {
      await monitorUC.createMonitor(form)
      setDrawerOpen(false)
      navigate('/')
      return null
    } catch (ex) {
      return ex.message || 'Failed to create monitor.'
    }
  }

  if (loading)
    return (
      <>
        <Topbar email={user.email} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />
        <div className="wrap wrap-wide">
          <p className="muted">Loading monitor…</p>
        </div>
      </>
    )
  if (loadError) {
    return (
      <>
        <Topbar email={user.email} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />
        <div className="wrap wrap-wide">
          <p className="error">{loadError}</p>
          <button onClick={reload}>Retry</button> <button onClick={onBack}>← Back</button>
        </div>
      </>
    )
  }

  if (!m)
    return (
      <>
        <Topbar email={user.email} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />
        <div className="wrap wrap-wide">
          <p className="muted">Monitor not found. It may have been deleted.</p>
          <button onClick={onBack}>← Back</button>
        </div>
      </>
    )

  const uptime = uptimePct(checks)
  const avg = avgResponseMs(checks)
  const lat = latencyStats(checks)

  return (
    <>
      <Topbar email={user.email} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="shell">
        <Sidebar tab="" onTab={goTab} openCount={countOpen(incidents)} onNew={() => setDrawerOpen(true)} />
        <div className="main">
          <div className="wrap wrap-wide">
            <button className="secondary" onClick={onBack}>
              ← Back
            </button>
            <h2>
              {m.name} <Dot status={m.isActive ? m.status : 'PAUSED'} />
            </h2>
            {stale && (
              <div className="error" role="status">
                Live update failed ({stale}). Data may be stale.
              </div>
            )}
            {actionError && (
              <div className="error" role="alert">
                {actionError}
              </div>
            )}
            <div className="muted">
              {m.method && <span className="method">{m.method}</span>}
              {m.url}, every {m.intervalSeconds}s, timeout {m.timeoutSeconds}s{!m.isActive && ', PAUSED'}
            </div>
            <div>
              <button className="secondary" disabled={pending} onClick={toggle}>
                {m.isActive
                  ? pending
                    ? 'Pausing…'
                    : 'Pause probes'
                  : pending
                    ? 'Resuming…'
                    : 'Resume probes'}
              </button>
            </div>
            {(() => {
              const last = checks[0]
              const open = incidents.find((i) => i.status === 'OPEN')
              if (!last || (last.status === 'UP' && !open)) return null
              return (
                <div className="breach" role="alert">
                  <b>
                    {last.status === 'UP' ? 'INCIDENT ACTIVE' : `BREACH: ${last.statusCode ?? last.status}`}
                  </b>{' '}
                  <span className="mono">
                    {last.error || (last.responseTimeMs != null ? `${last.responseTimeMs} ms` : '')}
                  </span>
                  {open && (
                    <span>
                      {' '}
                      · ongoing {incidentDuration(open.startedAt, open.resolvedAt)} · started{' '}
                      {formatDateTime(open.startedAt)}
                    </span>
                  )}
                </div>
              )
            })()}
            <DetailStats
              uptime={uptime == null ? null : uptime.toFixed(2)}
              avg={avg}
              p50={lat?.p50}
              p95={lat?.p95}
              status={m.status}
            />
            <h3>Response time, last 20 checks</h3>
            <Spark checks={checks} timeoutMs={m.timeoutSeconds != null ? m.timeoutSeconds * 1000 : null} />
            <details className="chart-data">
              <summary>Chart data (table)</summary>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Time</th>
                      <th scope="col">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checks
                      .filter((c) => c.responseTimeMs != null)
                      .map((c, i) => (
                        <tr key={`${c.checkedAt}-${i}`}>
                          <td>{formatCheckTime(c.checkedAt)}</td>
                          <td className="mono">{c.responseTimeMs} ms</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </details>
            <h3>Recent checks</h3>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">Code</th>
                    <th scope="col">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.map((c, i) => {
                    const d = checkDisplay(c)
                    return (
                      <tr key={`${c.checkedAt}-${i}`}>
                        <td>{formatCheckTime(c.checkedAt)}</td>
                        <td>
                          {d.mark} {c.status}
                        </td>
                        <td>{d.code}</td>
                        <td className="mono">{d.response}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <h3>Incidents</h3>
            {incidents.length === 0 && <div className="muted">none</div>}
            <div className="timeline">
              {incidents.map((in_) => (
                <div key={in_.id} className={in_.status === 'OPEN' ? 'card open-incident' : 'card'}>
                  <b className={in_.status === 'OPEN' ? 'st-open' : 'st-resolved'}>{in_.status}</b>:{' '}
                  {in_.reason} ·{' '}
                  <span className="mono">{incidentDuration(in_.startedAt, in_.resolvedAt)}</span>
                  <br />
                  <span className="muted">
                    {formatDateTime(in_.startedAt)}
                    {in_.resolvedAt ? ' → ' + formatDateTime(in_.resolvedAt) : ' (ongoing)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {drawerOpen && (
        <Drawer title="New monitor" onClose={() => setDrawerOpen(false)}>
          <MonitorForm onCreate={createHere} />
        </Drawer>
      )}
    </>
  )
}
