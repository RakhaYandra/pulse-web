export function SummaryStats({ summary }) {
  if (!summary) return null
  return (
    <div className="stats">
      <div className="stat primary"><b>{Number(summary.uptime24h).toFixed(2)}%</b><span>uptime 24h</span></div>
      <div className={`stat${summary.activeIncidents > 0 ? ' alert' : ''}`}><b>{summary.activeIncidents}</b><span>active incidents</span></div>
      <div className={`stat${summary.down > 0 ? ' alert' : ''}`}><b>{summary.down}</b><span>down</span></div>
      <div className="stat"><b>{summary.up}</b><span>up</span></div>
      <div className="stat"><b>{summary.totalMonitors}</b><span>monitors</span></div>
    </div>
  )
}

export function DetailStats({ uptime, avg, status }) {
  return (
    <div className="stats">
      <div className="stat"><b>{uptime}%</b><span>uptime</span></div>
      <div className="stat"><b className="mono">{avg} ms</b><span>avg response</span></div>
      <div className="stat"><b>{status}</b><span>status</span></div>
    </div>
  )
}
