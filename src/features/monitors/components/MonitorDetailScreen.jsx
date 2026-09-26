import { useMonitorDetail } from '../hooks.js'
import { uptimePct, avgResponseMs, checkDisplay, incidentDuration } from '../../../domain/stats.js'
import { formatDateTime, formatCheckTime } from '../../../utils/formatDate.js'
import { Dot } from '../../../components/ui/Dot.jsx'
import { Spark } from '../../../components/ui/Spark.jsx'
import { DetailStats } from '../../../components/ui/Stats.jsx'

export function MonitorDetailScreen({ monitorUC, id, onBack, onChanged }) {
  const { monitor: m, checks, incidents, loading, loadError, reload } = useMonitorDetail(monitorUC, id)

  if (loading)
    return (
      <div className="wrap">
        <p className="muted">Loading monitor…</p>
      </div>
    )
  if (loadError) {
    return (
      <div className="wrap">
        <p className="error">{loadError}</p>
        <button onClick={reload}>Retry</button> <button onClick={onBack}>← back</button>
      </div>
    )
  }

  if (!m)
    return (
      <div className="wrap">
        <p className="muted">Monitor not found. It may have been deleted.</p>
        <button onClick={onBack}>← back</button>
      </div>
    )

  const uptime = uptimePct(checks)
  const avg = avgResponseMs(checks)

  return (
    <div className="wrap">
      <button
        onClick={() => {
          onBack()
          onChanged?.()
        }}
      >
        ← back
      </button>
      <h2>
        {m.name} <Dot status={m.status} />
      </h2>
      <div className="muted">
        {m.url} · every {m.intervalSeconds}s · timeout {m.timeoutSeconds}s
      </div>
      <DetailStats
        uptime={uptime == null ? 'n/a' : uptime.toFixed(2)}
        avg={avg == null ? 'n/a' : avg}
        status={m.status}
      />
      <h3>Response time, last 20 checks</h3>
      <Spark checks={checks} />
      <h3>Recent checks</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Status</th>
              <th scope="col">Code</th>
              <th scope="col">Response</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((c, i) => {
              const d = checkDisplay(c)
              return (
                <tr key={`${c.checkedAt}-${i}`}>
                  <td>{formatCheckTime(c.checkedAt)}</td>
                  <td>
                    {d.mark} {c.status}
                  </td>
                  <td>{d.code}</td>
                  <td className="mono">{d.response}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <h3>Incidents</h3>
      {incidents.length === 0 && <div className="muted">none</div>}
      {incidents.map((in_) => (
        <div key={in_.id} className="card">
          <b>{in_.status}</b>: {in_.reason} ·{' '}
          <span className="mono">{incidentDuration(in_.startedAt, in_.resolvedAt)}</span>
          <br />
          <span className="muted">
            {formatDateTime(in_.startedAt)}
            {in_.resolvedAt ? ' → ' + formatDateTime(in_.resolvedAt) : ' (ongoing)'}
          </span>
        </div>
      ))}
    </div>
  )
}
