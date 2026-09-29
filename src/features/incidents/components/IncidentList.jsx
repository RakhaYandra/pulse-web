import { Link, useSearchParams } from 'react-router'
import { incidentDuration } from '../../../domain/stats.js'
import { formatDateTime } from '../../../utils/formatDate.js'
import { Pager } from '../../../components/ui/Pager.jsx'
import { paginate } from '../../../domain/paginate.js'

export function IncidentList({ incidents }) {
  const [searchParams, setSearchParams] = useSearchParams()
  if (!incidents.length) return <div className="muted">No incidents. All monitored APIs are responding.</div>
  const page = Number(searchParams.get('page')) || 1
  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    setSearchParams(next)
  }
  const { rows, current, pages, total } = paginate(incidents, page)
  return (
    <>
      {rows.map((in_) => (
        <div key={in_.id} className="row">
          <div>
            <Link
              className="row-open"
              to={`/monitors/${in_.monitorId}`}
              aria-label={`Open monitor ${in_.monitorName}`}
            >
              <b>{in_.status}</b>: {in_.monitorName}
            </Link>{' '}
            <span className="mono">{incidentDuration(in_.startedAt, in_.resolvedAt)}</span>
            <br />
            <span className="muted">
              {in_.reason}, {formatDateTime(in_.startedAt)}
              {in_.resolvedAt ? ' → resolved' : ''}
            </span>
          </div>
        </div>
      ))}
      <Pager current={current} pages={pages} total={total} onPage={setPage} />
    </>
  )
}
