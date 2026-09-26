import { Dot } from '../../../components/ui/Dot.jsx'
import { sortMonitors } from '../../../domain/stats.js'

export function MonitorList({ monitors, onSelect, onToggle, onRemove }) {
  if (!monitors.length) return <div className="muted">No monitors yet. Open + New to create one.</div>
  return sortMonitors(monitors).map((m) => (
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
          <button onClick={() => onToggle(m)}>Pause</button>
        ) : (
          <button onClick={() => onToggle(m)}>Resume</button>
        )}
        <button
          className="danger"
          onClick={() => {
            if (confirm('Delete?')) onRemove(m.id)
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ))
}
