import { Dot } from './Dot.jsx'

export function MonitorList({ monitors, onSelect, onToggle, onRemove }) {
  if (!monitors.length) return <div className="muted">No monitors yet — create one.</div>
  return monitors.map((m) => (
    <div key={m.id} className="row" onClick={() => onSelect(m.id)}>
      <div><b>{m.name}</b> <Dot status={m.status} /><br /><span className="muted">{m.url} · every {m.intervalSeconds}s{m.isActive ? '' : ' · PAUSED'}</span></div>
      <div onClick={(e) => e.stopPropagation()}>
        {m.isActive
          ? <button onClick={() => onToggle(m)}>pause</button>
          : <button onClick={() => onToggle(m)}>resume</button>}
        <button onClick={() => { if (confirm('Delete?')) onRemove(m.id) }}>del</button>
      </div>
    </div>
  ))
}

export function IncidentList({ incidents }) {
  return incidents.map((in_) => (
    <div key={in_.id} className="row">
      <div><b>{in_.status}</b> — {in_.monitorName}<br /><span className="muted">{in_.reason} · {new Date(in_.startedAt).toLocaleString()}{in_.resolvedAt ? ' → resolved' : ''}</span></div>
    </div>
  ))
}
