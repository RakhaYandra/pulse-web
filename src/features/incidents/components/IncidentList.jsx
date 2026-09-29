import { incidentDuration } from '../../../domain/stats.js'
import { formatDateTime } from '../../../utils/formatDate.js'

export function IncidentList({ incidents, onSelect }) {
  if (!incidents.length) return <div className="muted">No incidents. All monitored APIs are responding.</div>
  return incidents.map((in_) => (
    <div key={in_.id} className="row">
      <div>
        <button
          className="row-open"
          onClick={() => onSelect?.(in_.monitorId)}
          aria-label={`Open monitor ${in_.monitorName}`}
        >
          <b>{in_.status}</b>: {in_.monitorName}
        </button>{' '}
        <span className="mono">{incidentDuration(in_.startedAt, in_.resolvedAt)}</span>
        <br />
        <span className="muted">
          {in_.reason}, {formatDateTime(in_.startedAt)}
          {in_.resolvedAt ? ' → resolved' : ''}
        </span>
      </div>
    </div>
  ))
}
