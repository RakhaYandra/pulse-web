import { useState } from 'react'
import { usePolling } from '../../../hooks/usePolling.js'
import { ReliabilityTable } from './ReliabilityTable.jsx'

export function ReportsView({ monitorUC }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  async function reload() {
    const r = await monitorUC.loadReliability(30)
    setRows(r)
    setError('')
  }

  usePolling(reload, 60000, [monitorUC], (ex) => {
    if (rows === null) setError(ex.message || 'Failed to load report.')
  })

  if (error) {
    return (
      <div>
        <p className="error" role="alert">{error}</p>
        <button onClick={() => { setError(''); reload().catch((ex) => setError(ex.message)) }}>Retry</button>
      </div>
    )
  }
  if (rows === null) return <p className="muted">Loading report…</p>
  return (
    <div>
      <p className="muted">Per-monitor reliability, last 30 days. MTTR averages resolved incidents only.</p>
      <ReliabilityTable rows={rows} />
    </div>
  )
}
