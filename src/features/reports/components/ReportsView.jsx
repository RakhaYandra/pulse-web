import { useEffect, useState } from 'react'
import { ReliabilityTable } from './ReliabilityTable.jsx'

export function ReportsView({ monitorUC }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    monitorUC.loadReliability(30).then(
      (r) => {
        if (!cancelled) setRows(r)
      },
      (ex) => {
        if (!cancelled) setError(ex.message || 'Failed to load report.')
      },
    )
    return () => {
      cancelled = true
    }
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
