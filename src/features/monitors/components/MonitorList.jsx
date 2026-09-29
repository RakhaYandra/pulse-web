import { useState } from 'react'
import { Dot } from '../../../components/ui/Dot.jsx'
import { sortMonitors } from '../../../domain/stats.js'

export function MonitorList({ monitors, pendingId, onSelect, onToggle, onRemove }) {
  const [confirmId, setConfirmId] = useState(null)
  if (!monitors.length) return <div className="muted">No monitors yet. Open + New to create one.</div>
  return sortMonitors(monitors).map((m) => {
    return (
    <div
      key={m.id}
      className={m.status === 'DOWN' ? 'row attention' : 'row'}
      role="button"
      tabIndex={0}
      aria-label={`Open ${m.name}`}
      onClick={() => onSelect(m.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(m.id)
        }
      }}
    >
      <div>
        <b>{m.name}</b> <Dot status={m.status} />
        <br />
        <span className="muted">
          {m.url} · every {m.intervalSeconds}s{m.isActive ? '' : ' · PAUSED'}
        </span>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
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
  })}
