import { Dot } from './Dot.jsx'
import { formatDurationSecs } from '../../domain/stats.js'
import { sortMonitors, incidentDuration } from '../../domain/stats.js'

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
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(m.id) } }}
    >
      <div><b>{m.name}</b> <Dot status={m.status} /><br /><span className="muted">{m.url} · every {m.intervalSeconds}s{m.isActive ? '' : ' · PAUSED'}</span></div>
      <div onClick={(e) => e.stopPropagation()}>
        {m.isActive
          ? <button onClick={() => onToggle(m)}>Pause</button>
          : <button onClick={() => onToggle(m)}>Resume</button>}
        <button className="danger" onClick={() => { if (confirm('Delete?')) onRemove(m.id) }}>Delete</button>
      </div>
    </div>
  ))
}

export function IncidentList({ incidents, onSelect }) {
  if (!incidents.length) return <div className="muted">No incidents. All monitored APIs are responding.</div>
  return incidents.map((in_) => (
    <div
      key={in_.id}
      className="row"
      role="button"
      tabIndex={0}
      aria-label={`Open monitor ${in_.monitorName}`}
      onClick={() => onSelect?.(in_.monitorId)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(in_.monitorId) } }}
    >
      <div><b>{in_.status}</b>: {in_.monitorName} · <span className="mono">{incidentDuration(in_.startedAt, in_.resolvedAt)}</span><br /><span className="muted">{in_.reason} · {new Date(in_.startedAt).toLocaleString()}{in_.resolvedAt ? ' → resolved' : ''}</span></div>
    </div>
  ))
}

export function ReliabilityTable({ rows }) {
  if (!rows.length) return <div className="muted">No monitors in this window.</div>
  return (
    <div className="table-scroll">
      <table>
        <thead><tr><th scope="col">Monitor</th><th scope="col">Uptime</th><th scope="col">MTTR</th><th scope="col">Incidents</th><th scope="col">Checks</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.monitorId}>
              <td>{r.monitorName}{r.incidentsOpen > 0 && <span className="dot-down" aria-label="has open incidents"> ●</span>}</td>
              <td className="mono">{r.uptimePct.toFixed(2)}%</td>
              <td className="mono">{formatDurationSecs(r.mttrSeconds)}</td>
              <td>{r.incidentsTotal}</td>
              <td>{r.checksTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
