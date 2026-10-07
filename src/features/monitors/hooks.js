import { useRef, useState } from 'react'
import { usePolling } from '../../hooks/usePolling.js'

export function useDashboard(monitorUC) {
  const [summary, setSummary] = useState(null)
  const [monitors, setMonitors] = useState([])
  const [incidents, setIncidents] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [stale, setStale] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [actionError, setActionError] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [uptimeMap, setUptimeMap] = useState({})
  // 24h uptime barely moves: fetch once per mount + after mutations, never on poll.
  const uptimeStale = useRef(true)

  async function reload() {
    setSyncing(true)
    try {
      const d = await monitorUC.loadDashboard()
      setSummary(d.summary)
      setMonitors(d.monitors)
      setIncidents(d.incidents)
      setUpdatedAt(Date.now())
      setLoadError('')
      setStale('')
    } catch (ex) {
      if (summary === null) setLoadError(ex.message || 'Failed to load dashboard.')
    } finally {
      setSyncing(false)
      setLoading(false)
    }
    if (uptimeStale.current) {
      uptimeStale.current = false
      try {
        const rows = await monitorUC.loadReliability(1)
        setUptimeMap(Object.fromEntries(rows.map((r) => [r.monitorId, r.uptimePct])))
      } catch {
        /* uptime column stays blank; dashboard still works */
        uptimeStale.current = true
      }
    }
  }

  usePolling(reload, 15000, [], (ex) => {
    if (summary === null) setLoadError(ex.message || 'Failed to load dashboard.')
    else setStale(ex.message || 'Update failed.')
  })

  async function mutate(fn) {
    setError('')
    uptimeStale.current = true
    try {
      await fn()
      await reload()
      return null
    } catch (ex) {
      setError(ex.message)
      return ex.message
    }
  }

  async function create(raw) {
    return mutate(() => monitorUC.createMonitor(raw))
  }

  async function update(id, raw) {
    return mutate(() => monitorUC.updateMonitor(id, raw))
  }

  async function toggle(monitor) {
    setActionError('')
    setPendingId(monitor.id)
    try {
      await monitorUC.togglePause(monitor)
      await reload()
    } catch (ex) {
      setActionError(ex.message || 'Failed to update monitor.')
    } finally {
      setPendingId(null)
    }
  }

  async function remove(id) {
    setActionError('')
    setPendingId(id)
    try {
      await monitorUC.removeMonitor(id)
      await reload()
    } catch (ex) {
      setActionError(ex.message || 'Failed to delete monitor.')
    } finally {
      setPendingId(null)
    }
  }

  return {
    summary,
    monitors,
    incidents,
    error,
    loading,
    loadError,
    stale,
    syncing,
    actionError,
    pendingId,
    updatedAt,
    uptimeMap,
    reload,
    create,
    update,
    toggle,
    remove,
  }
}
export function useMonitorDetail(monitorUC, id) {
  const [monitor, setMonitor] = useState(null)
  const [checks, setChecks] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [stale, setStale] = useState('')
  const [actionError, setActionError] = useState('')
  const [pending, setPending] = useState(false)

  async function reload() {
    try {
      const d = await monitorUC.loadMonitorDetail(id)
      setMonitor(d.monitor)
      setChecks(d.checks)
      setIncidents(d.incidents)
      setLoadError('')
      setStale('')
    } catch (ex) {
      if (monitor === null) setLoadError(ex.message || 'Failed to load monitor.')
    } finally {
      setLoading(false)
    }
  }

  usePolling(reload, 15000, [id], (ex) => {
    if (monitor === null) setLoadError(ex.message || 'Failed to load monitor.')
    else setStale(ex.message || 'Update failed.')
  })

  return { monitor, checks, incidents, loading, loadError, stale, actionError, pending, reload, toggle }

  async function toggle() {
    if (!monitor) return
    setActionError('')
    setPending(true)
    try {
      await monitorUC.togglePause(monitor)
      await reload()
    } catch (ex) {
      setActionError(ex.message || 'Failed to update monitor.')
    } finally {
      setPending(false)
    }
  }
}
