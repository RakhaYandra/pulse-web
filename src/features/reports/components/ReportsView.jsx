import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { usePolling } from '../../../hooks/usePolling.js'
import { formatDurationSecs } from '../../../domain/stats.js'
import { ReliabilityTable } from './ReliabilityTable.jsx'

const RANGES = [7, 30, 90]

export function ReportsView({ monitorUC }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  const parsed = Number(searchParams.get('days'))
  const days = RANGES.includes(parsed) ? parsed : 30
  const setDays = (d) => {
    const next = new URLSearchParams(searchParams)
    if (d === 30) next.delete('days')
    else next.set('days', String(d))
    setSearchParams(next)
    setRows(null)
  }

  async function reload() {
    const r = await monitorUC.loadReliability(days)
    setRows(r)
    setError('')
  }

  usePolling(reload, 60000, [monitorUC, days], (ex) => {
    if (rows === null) setError(ex.message || 'Failed to load report.')
  })

  if (error) {
    return (
      <div>
        <p className="error" role="alert">
          {error}
        </p>
        <button
          onClick={() => {
            setError('')
            reload().catch((ex) => setError(ex.message))
          }}
        >
          Retry
        </button>
      </div>
    )
  }
  if (rows === null) return <p className="muted">Loading report…</p>
  const withData = rows.filter((r) => r.checksTotal > 0)
  const fleetUptime = withData.length
    ? (withData.reduce((s, r) => s + r.uptimePct, 0) / withData.length).toFixed(2)
    : null
  const totalIncidents = rows.reduce((s, r) => s + r.incidentsTotal, 0)
  const totalChecks = rows.reduce((s, r) => s + r.checksTotal, 0)
  const withMttr = rows.filter((r) => r.incidentsTotal > 0 && r.mttrSeconds > 0)
  const fleetMttr = withMttr.length
    ? Math.round(withMttr.reduce((s, r) => s + r.mttrSeconds, 0) / withMttr.length)
    : null
  return (
    <div>
      <div className="stats">
        <div className="stat">
          <span className="label-caps">fleet uptime ({days}d)</span>
          <b>{fleetUptime == null ? 'n/a' : `${fleetUptime}%`}</b>
          <span className="sub">{rows.length} monitors</span>
        </div>
        <div className="stat">
          <span className="label-caps">fleet mttr</span>
          <b className="mono sm">{fleetMttr == null ? 'n/a' : formatDurationSecs(fleetMttr)}</b>
          <span className="sub">resolved incidents only</span>
        </div>
        <div className="stat">
          <span className="label-caps">incidents</span>
          <b>{totalIncidents}</b>
          <span className="sub">{totalChecks} checks</span>
        </div>
      </div>
      <div className="range-switch" role="group" aria-label="Report range">
        {RANGES.map((d) => (
          <button
            key={d}
            className={d === days ? 'active' : ''}
            aria-pressed={d === days}
            onClick={() => setDays(d)}
          >
            {d}d
          </button>
        ))}
      </div>
      <p className="muted">
        Per-monitor reliability, last {days} days. MTTR averages resolved incidents only.
      </p>
      <ReliabilityTable rows={rows} />
    </div>
  )
}
