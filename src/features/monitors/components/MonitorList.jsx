import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Dot } from '../../../components/ui/Dot.jsx'
import { PulseMark } from '../../../components/ui/PulseMark.jsx'
import { Pager } from '../../../components/ui/Pager.jsx'
import { sortMonitors } from '../../../domain/stats.js'
import { paginate } from '../../../domain/paginate.js'
import { ago } from '../../../utils/formatDate.js'

const FILTERS = ['all', 'down', 'up', 'paused']

function matches(m, f) {
  if (f === 'all') return true
  if (f === 'paused') return !m.isActive
  return m.isActive && m.status === (f === 'down' ? 'DOWN' : 'UP')
}

export function MonitorList({ monitors, pendingId, uptimeMap = {}, onToggle, onRemove, onEdit }) {
  const [confirmId, setConfirmId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
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
  const counts = Object.fromEntries(FILTERS.map((f) => [f, monitors.filter((m) => matches(m, f)).length]))
  const page = Number(searchParams.get('page')) || 1
  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    setSearchParams(next)
  }
  const pick = (f) => {
    setFilter(f)
    setPage(1)
  }
  const q = query.trim().toLowerCase()
  const visible = sortMonitors(monitors)
    .filter((m) => matches(m, filter))
    .filter((m) => !q || m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q))
  const { rows, current, pages, total } = paginate(visible, page)
  const exportCsv = () => {
    const head = 'name,method,url,interval_seconds,status,active,uptime_24h_pct,last_checked_at'
    const lines = visible.map((m) =>
      [
        m.name,
        m.method || '',
        m.url,
        m.intervalSeconds,
        m.status,
        m.isActive,
        uptimeMap[m.id]?.toFixed(2) ?? '',
        m.lastCheckedAt || '',
      ]
        .map((v) => `"${String(v).replaceAll('"', '""')}"`)
        .join(','),
    )
    const blob = new Blob([[head, ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'pulse-monitors.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  return (
    <>
      <div className="chips" role="group" aria-label="Filter monitors">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={f === filter ? 'active' : ''}
            aria-pressed={f === filter}
            onClick={() => pick(f)}
          >
            {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)} <span className="n">({counts[f]})</span>
          </button>
        ))}
      </div>
      <div className="list-tools">
        <input
          aria-label="Search monitors"
          placeholder="Search name or URL…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
        />
        <button className="secondary" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      <div className="table-scroll">
        <table className="fleet">
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">State</th>
              <th scope="col">Target</th>
              <th scope="col">Uptime 24h</th>
              <th scope="col">Last checked</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const paused = !m.isActive
              return (
                <tr key={m.id} className={m.status === 'DOWN' && m.isActive ? 'row attention' : 'row'}>
                  <td>
                    <Link className="row-open" to={`/monitors/${m.id}`} aria-label={`Open ${m.name}`}>
                      <b>{m.name}</b>
                    </Link>
                  </td>
                  <td>
                    <Dot status={paused ? 'PAUSED' : m.status} />
                  </td>
                  <td>
                    {m.method && <span className="method">{m.method}</span>}
                    <span className="mono">{m.url}</span>
                    <br />
                    <span className="muted">
                      every {m.intervalSeconds}s{paused ? ', PAUSED' : ''}
                    </span>
                  </td>
                  <td>
                    <span className="mono">
                      {uptimeMap[m.id] == null ? '—' : `${uptimeMap[m.id].toFixed(2)}%`}
                    </span>
                  </td>
                  <td>
                    <span className="mono">{ago(m.lastCheckedAt)}</span>
                  </td>
                  <td>
                    <button disabled={pendingId === m.id} onClick={() => onEdit?.(m)}>
                      Edit
                    </button>
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
                      <button
                        className="danger"
                        disabled={pendingId === m.id}
                        onClick={() => setConfirmId(m.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pager current={current} pages={pages} total={total} onPage={setPage} />
    </>
  )
}
