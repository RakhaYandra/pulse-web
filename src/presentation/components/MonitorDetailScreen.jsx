import { useMonitorDetail } from '../hooks/useMonitorDetail.js'
import { uptimePct, avgResponseMs, checkDisplay } from '../../domain/stats.js'
import { Dot } from './Dot.jsx'
import { Spark } from './Spark.jsx'
import { DetailStats } from './Stats.jsx'

export function MonitorDetailScreen({ monitorUC, id, onBack, onChanged }) {
  const { monitor: m, checks, incidents, reload } = useMonitorDetail(monitorUC, id)

  if (!m) return <div className="wrap"><button onClick={onBack}>← back</button></div>

  const uptime = uptimePct(checks)
  const avg = avgResponseMs(checks)

  return (
    <div className="wrap">
      <button onClick={() => { onBack(); onChanged?.() }}>← back</button>
      <h2>{m.name} <Dot status={m.status} /></h2>
      <div className="muted">{m.url} · every {m.intervalSeconds}s · timeout {m.timeoutSeconds}s</div>
      <DetailStats uptime={uptime == null ? '—' : uptime.toFixed(2)} avg={avg == null ? '—' : avg} status={m.status} />
      <h3>Response time</h3>
      <Spark checks={checks} />
      <h3>Recent checks</h3>
      <table>
        <thead><tr><th>Time</th><th>Status</th><th>Code</th><th>Response</th></tr></thead>
        <tbody>
          {checks.map((c, i) => {
            const d = checkDisplay(c)
            return (
              <tr key={i}>
                <td>{new Date(c.checkedAt).toLocaleTimeString()}</td>
                <td>{d.mark} {c.status}</td>
                <td>{d.code}</td>
                <td>{d.response}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <h3>Incidents</h3>
      {incidents.length === 0 && <div className="muted">none</div>}
      {incidents.map((in_) => (
        <div key={in_.id} className="card">
          <b>{in_.status}</b> — {in_.reason}<br />
          <span className="muted">{new Date(in_.startedAt).toLocaleString()}
            {in_.resolvedAt ? ' → ' + new Date(in_.resolvedAt).toLocaleString() : ' (ongoing)'}</span>
        </div>
      ))}
    </div>
  )
}
