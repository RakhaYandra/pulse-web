import { useState } from 'react'
import { useDashboard } from '../hooks/useDashboard.js'
import { countOpen } from '../../domain/stats.js'
import { SummaryStats } from './Stats.jsx'
import { MonitorList, IncidentList } from './Lists.jsx'
import { MonitorForm } from './MonitorForm.jsx'

export function DashboardScreen({ user, monitorUC, onLogout, onSelect }) {
  const { summary, monitors, incidents, create, toggle, remove } = useDashboard(monitorUC)
  const [tab, setTab] = useState('monitors')

  return (
    <div className="wrap">
      <header>
        <h1>Pulse</h1>
        <div>{user.email} <button className="link" onClick={onLogout}>logout</button></div>
      </header>
      <SummaryStats summary={summary} />
      <nav>
        <button className={tab === 'monitors' ? 'active' : ''} onClick={() => setTab('monitors')}>Monitors</button>
        <button className={tab === 'incidents' ? 'active' : ''} onClick={() => setTab('incidents')}>Incidents ({countOpen(incidents)})</button>
        <button className={tab === 'new' ? 'active' : ''} onClick={() => setTab('new')}>+ New</button>
      </nav>
      {tab === 'monitors' && <MonitorList monitors={monitors} onSelect={onSelect} onToggle={toggle} onRemove={remove} />}
      {tab === 'incidents' && <IncidentList incidents={incidents} />}
      {tab === 'new' && <MonitorForm onCreate={create} />}
    </div>
  )
}
