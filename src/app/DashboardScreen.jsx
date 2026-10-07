import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useDashboard } from '../features/monitors/hooks.js'
import { countOpen, incidentDuration } from '../domain/stats.js'
import { ago } from '../utils/formatDate.js'
import { SummaryStats } from '../components/ui/Stats.jsx'
import { Topbar } from '../components/ui/Topbar.jsx'
import { Sidebar } from '../components/ui/Sidebar.jsx'
import { Drawer } from '../components/ui/Drawer.jsx'
import { PulseMark } from '../components/ui/PulseMark.jsx'
import { MonitorList } from '../features/monitors/components/MonitorList.jsx'
import { IncidentList } from '../features/incidents/components/IncidentList.jsx'
import { ReportsView } from '../features/reports/components/ReportsView.jsx'
import { MonitorForm } from '../features/monitors/components/MonitorForm.jsx'

export function DashboardScreen({ user, monitorUC, onLogout, theme, onToggleTheme }) {
  const {
    summary,
    monitors,
    incidents,
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
  } = useDashboard(monitorUC)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = searchParams.get('tab') || 'monitors'
  const setTab = (t) => setSearchParams(t === 'monitors' ? {} : { tab: t })
  const onSelect = (id) => navigate(`/monitors/${id}`)
  const [drawer, setDrawer] = useState(null)
  // Legacy ?tab=new links open the create drawer instead (derived, no effect).
  const legacyNew = searchParams.get('tab') === 'new'
  const drawerOpen = drawer !== null || legacyNew
  const closeDrawer = () => {
    setDrawer(null)
    if (legacyNew) setSearchParams({})
  }
  const saveDrawer = async (form) => {
    const msg = drawer?.mode === 'edit' ? await update(drawer.monitor.id, form) : await create(form)
    if (!msg) {
      closeDrawer()
      setTab('monitors')
    }
    return msg
  }
  // Tick so "Updated Ns ago" stays honest between 15s polls.
  const [, setNow] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(t)
  }, [])

  const chrome = { email: user.email, onLogout, theme, onToggleTheme }
  if (loading)
    return (
      <>
        <Topbar {...chrome} />
        <div className="wrap">
          <p className="muted">Loading monitors…</p>
        </div>
      </>
    )
  if (loadError) {
    return (
      <>
        <Topbar {...chrome} />
        <div className="wrap">
          <p className="error">{loadError}</p>
          <button onClick={reload}>Retry</button>
        </div>
      </>
    )
  }

  const open = countOpen(incidents)

  return (
    <>
      <Topbar {...chrome} />
      <div className="shell">
        <Sidebar tab={tab} onTab={setTab} openCount={open} onNew={() => setDrawer({ mode: 'create' })} />
        <div className="main">
          <div className="wrap wrap-wide">
            <SummaryStats summary={summary} incidents={incidents} />
            {stale && (
              <div className="error" role="status">
                Live update failed ({stale}). Showing data from {ago(updatedAt)}.
              </div>
            )}
            {actionError && (
              <div className="error" role="alert">
                {actionError}
              </div>
            )}
            {open > 0 && (
              <section aria-label="Attention" className="banner attention-focal">
                <span className="brand-mark" aria-hidden="true">
                  <PulseMark />
                </span>
                <div>
                  <span className="banner-title">
                    {open} open incident{open === 1 ? '' : 's'}
                  </span>
                  {(() => {
                    const first = incidents.find((i) => i.status === 'OPEN')
                    if (!first) return null
                    return (
                      <span>
                        {' '}
                        — {first.monitorName} down for {incidentDuration(first.startedAt, first.resolvedAt)}.
                      </span>
                    )
                  })()}
                </div>
                {(() => {
                  const first = incidents.find((i) => i.status === 'OPEN')
                  if (!first) return null
                  return (
                    <div className="banner-actions">
                      <button className="btn-alert" onClick={() => onSelect(first.monitorId)}>
                        Open monitor →
                      </button>
                    </div>
                  )
                })()}
              </section>
            )}
            {tab === 'monitors' && (
              <div className="tab-body">
                <div className="section-head">
                  <h2>Monitored endpoints</h2>
                  <span className="muted mono">sorted by severity</span>
                </div>
                <MonitorList
                  monitors={monitors}
                  pendingId={pendingId}
                  uptimeMap={uptimeMap}
                  onToggle={toggle}
                  onRemove={remove}
                  onEdit={(m) => setDrawer({ mode: 'edit', monitor: m })}
                />
              </div>
            )}
            {tab === 'incidents' && <IncidentList incidents={incidents} />}
            {tab === 'reports' && <ReportsView monitorUC={monitorUC} />}
            <p className="muted freshness">
              {syncing ? (
                <span className="syncing">
                  <span className="sync-dot" aria-hidden="true" /> Checking…
                </span>
              ) : (
                <>Updated {ago(updatedAt)} · </>
              )}
              <button className="link" onClick={reload}>
                Refresh now
              </button>
            </p>
          </div>
        </div>
      </div>
      {drawerOpen && (
        <Drawer
          title={drawer?.mode === 'edit' ? `Edit ${drawer.monitor.name}` : 'New monitor'}
          onClose={closeDrawer}
        >
          <MonitorForm
            key={drawer?.mode === 'edit' ? drawer.monitor.id : 'new'}
            initial={drawer?.mode === 'edit' ? drawer.monitor : undefined}
            submitLabel={drawer?.mode === 'edit' ? 'Save changes' : 'Create monitor'}
            onCreate={saveDrawer}
          />
        </Drawer>
      )}
    </>
  )
}
