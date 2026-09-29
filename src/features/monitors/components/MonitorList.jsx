import { useState } from 'react'
import { Link } from 'react-router'
import { Dot } from '../../../components/ui/Dot.jsx'
import { PulseMark } from '../../../components/ui/PulseMark.jsx'
import { sortMonitors } from '../../../domain/stats.js'

export function MonitorList({ monitors, pendingId, onToggle, onRemove }) {
  const [confirmId, setConfirmId] = useState(null)
  if (!monitors.length)
    return (
      <div className="muted empty-state">
        <span className="brand-mark">
          <PulseMark size={28} />
        </span>
        <p>No monitors yet. Open + New to create one.</p>
      </div>
    )
  return sortMonitors(monitors).map((m) => {
    return (
      <div key={m.id} className={m.status === 'DOWN' ? 'row attention' : 'row'}>
      <div>
        <Link className="row-open" to={`/monitors/${m.id}`} aria-label={`Open ${m.name}`}>
          <b>{m.name}</b> <Dot status={m.isActive ? m.status : 'PAUSED'} />
        </Link>
        <br />
          <span className="muted">
            {m.url}, every {m.intervalSeconds}s{m.isActive ? '' : ', PAUSED'}
          </span>
        </div>
        <div>
          {m.isActive ? (
            <button disabled={pendingId === m.id} onClick={() => onToggle(m)}>
              {pendingId === m.id ? 'Pausing…' : 'Pause'}
            </button>
          ) : (
            <button disabled={pendingId === m.id} onClick={() => onToggle(m)}>
              {pendingId === m.id ? 'Resuming…' : 'Resume'}
            </button>
          )}
          {confirmId === m.id ? (
            <button
              className="danger"
              disabled={pendingId === m.id}
              onClick={() => {
                setConfirmId(null)
                onRemove(m.id)
              }}
            >
              Confirm delete
            </button>
          ) : (
            <button className="danger" disabled={pendingId === m.id} onClick={() => setConfirmId(m.id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    )
  })
}
