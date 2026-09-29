export function SummaryStats({ summary }) {
  if (!summary) return null
  return (
    <div className="stats">
      <div className="stat">
        <b>{Number(summary.uptime24h).toFixed(2)}%</b>
        <span>uptime 24h</span>
      </div>
      <div className={`stat${summary.activeIncidents > 0 ? ' alert' : ''}`}>
        <b>{summary.activeIncidents}</b>
        <span>active incidents</span>
      </div>
      <div className={`stat${summary.down > 0 ? ' alert' : ''}`}>
        <b>{summary.down}</b>
        <span>down</span>
      </div>
      <div className="stat">
        <b>{summary.up}</b>
        <span>up</span>
      </div>
      <div className="stat">
        <b>{summary.totalMonitors}</b>
        <span>monitors</span>
      </div>
    </div>
  )
}

export function DetailStats({ uptime, avg, status, p50, p95 }) {
  const pending = status === 'UNKNOWN'
  return (
    <div className="stats">
      <div className="stat">
        <b>{uptime == null ? 'n/a' : `${uptime}%`}</b>
        <span>uptime</span>
      </div>
      <div className="stat">
        <b className="mono">{avg == null ? 'n/a' : `${avg} ms`}</b>
        <span>avg response</span>
      </div>
      <div className="stat">
        <b className="mono">{p50 == null ? 'n/a' : `${p50} / ${p95} ms`}</b>
        <span>p50 / p95</span>
      </div>
      <div className="stat">
        <b className={pending ? 'muted' : ''}>{pending ? 'waiting for first check' : status}</b>
        <span>status</span>
      </div>
    </div>
  )
}
