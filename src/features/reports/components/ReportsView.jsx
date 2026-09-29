import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { usePolling } from '../../../hooks/usePolling.js'
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
  return (
    <div>
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
