export function SummaryStats({ summary, incidents = [] }) {
  if (!summary) return null
  const firstOpen = incidents.find((i) => i.status === 'OPEN')
  return (
    <div className="stats">
      <div className="stat">
        <span className="label-caps">uptime 24h</span>
        <b>{Number(summary.uptime24h).toFixed(2)}%</b>
        <span className="sub">
          {summary.down} down · {summary.up} up
        </span>
      </div>
      <div className={`stat${summary.activeIncidents > 0 ? ' alert' : ''}`}>
        <span className="label-caps">active incidents</span>
        <b>{summary.activeIncidents}</b>
        <span className="sub">{firstOpen ? firstOpen.monitorName : 'all clear'}</span>
      </div>
      <div className={`stat${summary.down > 0 ? ' alert' : ''}`}>
        <span className="label-caps">down</span>
        <b>{summary.down}</b>
        <span className="sub">of {summary.totalMonitors} total</span>
      </div>
      <div className="stat">
        <span className="label-caps">up</span>
        <b>{summary.up}</b>
        <span className="sub">healthy execution</span>
      </div>
      <div className="stat">
        <span className="label-caps">monitors</span>
        <b>{summary.totalMonitors}</b>
        <span className="sub">poll every 15s</span>
      </div>
    </div>
  )
}

export function DetailStats({ uptime, avg, status, p50, p95 }) {
  const pending = status === 'UNKNOWN'
  return (
    <div className="stats">
      <div className="stat">
        <span className="label-caps">uptime</span>
        <b>{uptime == null ? 'n/a' : `${uptime}%`}</b>
      </div>
      <div className="stat">
        <span className="label-caps">avg response</span>
        <b className="mono">{avg == null ? 'n/a' : `${avg} ms`}</b>
      </div>
      <div className="stat">
        <span className="label-caps">p50 / p95</span>
        <b className="mono">{p50 == null ? 'n/a' : `${p50} / ${p95} ms`}</b>
      </div>
      <div className="stat">
        <span className="label-caps">status</span>
        <b className={pending ? 'muted' : ''}>{pending ? 'waiting for first check' : status}</b>
      </div>
    </div>
  )
}
