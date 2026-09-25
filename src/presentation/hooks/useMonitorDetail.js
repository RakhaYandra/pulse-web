import { useState } from 'react'
import { usePolling } from './usePolling.js'

export function useMonitorDetail(monitorUC, id) {
  const [monitor, setMonitor] = useState(null)
  const [checks, setChecks] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  async function reload() {
    try {
      const d = await monitorUC.loadMonitorDetail(id)
      setMonitor(d.monitor)
      setChecks(d.checks)
      setIncidents(d.incidents)
      setLoadError('')
    } catch (ex) {
      if (monitor === null) setLoadError(ex.message || 'Failed to load monitor.')
    } finally {
      setLoading(false)
    }
  }

  usePolling(reload, 15000, [id], (ex) => {
    if (monitor === null) setLoadError(ex.message || 'Failed to load monitor.')
  })

  return { monitor, checks, incidents, loading, loadError, reload }
}
