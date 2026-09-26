import { formatDurationSecs } from '../../../domain/stats.js'

export function ReliabilityTable({ rows }) {
  if (!rows.length) return <div className="muted">No monitors in this window.</div>
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">Monitor</th>
            <th scope="col">Uptime</th>
            <th scope="col">MTTR</th>
            <th scope="col">Incidents</th>
            <th scope="col">Checks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.monitorId}>
              <td>
                {r.monitorName}
                {r.incidentsOpen > 0 && (
                  <span className="dot-down" aria-label="has open incidents">
                    {' '}
                    ●
                  </span>
                )}
              </td>
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
