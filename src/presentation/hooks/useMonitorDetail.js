import { useState } from 'react'
import { usePolling } from './usePolling.js'

export function useMonitorDetail(monitorUC, id) {
  const [monitor, setMonitor] = useState(null)
  const [checks, setChecks] = useState([])
  const [incidents, setIncidents] = useState([])

  async function reload() {
    const d = await monitorUC.loadMonitorDetail(id)
    setMonitor(d.monitor)
    setChecks(d.checks)
    setIncidents(d.incidents)
  }

  usePolling(reload, 15000, [id])

  return { monitor, checks, incidents, reload }
}
