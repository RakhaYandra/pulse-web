import { useState } from 'react'
import { usePolling } from './usePolling.js'

export function useDashboard(monitorUC) {
  const [summary, setSummary] = useState(null)
  const [monitors, setMonitors] = useState([])
  const [incidents, setIncidents] = useState([])
  const [error, setError] = useState('')

  async function reload() {
    const d = await monitorUC.loadDashboard()
    setSummary(d.summary)
    setMonitors(d.monitors)
    setIncidents(d.incidents)
  }

  usePolling(reload, 15000, [])

  async function create(raw) {
    setError('')
    try {
      await monitorUC.createMonitor(raw)
      await reload()
      return null
    } catch (ex) {
      setError(ex.message)
      return ex.message
    }
  }

  async function toggle(monitor) {
    await monitorUC.togglePause(monitor)
    await reload()
  }

  async function remove(id) {
    await monitorUC.removeMonitor(id)
    await reload()
  }

  return { summary, monitors, incidents, error, reload, create, toggle, remove }
}
