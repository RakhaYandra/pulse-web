import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Dot } from '../../../components/ui/Dot.jsx'
import { PulseMark } from '../../../components/ui/PulseMark.jsx'
import { Pager } from '../../../components/ui/Pager.jsx'
import { sortMonitors } from '../../../domain/stats.js'
import { paginate } from '../../../domain/paginate.js'

export function MonitorList({ monitors, pendingId, onToggle, onRemove }) {
  const [confirmId, setConfirmId] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  if (!monitors.length)
    return (
      <div className="muted empty-state">
        <span className="brand-mark">
          <PulseMark size={28} />
        </span>
        <p>No monitors yet. Open + New to create one.</p>
      </div>
    )
  const page = Number(searchParams.get('page')) || 1
  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    setSearchParams(next)
  }
  const { rows, current, pages, total } = paginate(sortMonitors(monitors), page)
  return (
    <>
      {rows.map((m) => {
        return (
          <div key={m.id} className={m.status === 'DOWN' ? 'row attention' : 'row'}>
            <div>
              <Link className="row-open" to={`/monitors/${m.id}`} aria-label={`Open ${m.name}`}>
                <b>{m.name}</b> <Dot status={m.isActive ? m.status : 'PAUSED'} />
              </Link>
              <br />
              <span className="muted">
                {m.url}, every {m.intervalSeconds}s{m.isActive ? '' : ', PAUSED'}
              </span>
            </div>
            <div>
              {m.isActive ? (
                <button disabled={pendingId === m.id} onClick={() => onToggle(m)}>
                  {pendingId === m.id ? 'Pausing…' : 'Pause'}
                </button>
              ) : (
                <button disabled={pendingId === m.id} onClick={() => onToggle(m)}>
                  {pendingId === m.id ? 'Resuming…' : 'Resume'}
                </button>
              )}
              {confirmId === m.id ? (
                <button
                  className="danger"
                  disabled={pendingId === m.id}
                  onClick={() => {
                    setConfirmId(null)
                    onRemove(m.id)
                  }}
                >
                  Confirm delete
                </button>
              ) : (
                <button className="danger" disabled={pendingId === m.id} onClick={() => setConfirmId(m.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        )
      })}
      <Pager current={current} pages={pages} total={total} onPage={setPage} />
    </>
  )
}
