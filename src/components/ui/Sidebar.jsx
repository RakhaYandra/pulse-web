export function Sidebar({ tab, onTab, openCount, onNew }) {
  return (
    <aside className="sidebar" aria-label="Pulse navigation">
      <button className="side-new" onClick={onNew}>
        + New
      </button>
      <nav aria-label="Dashboard sections">
        <button
          className={tab === 'monitors' ? 'side-link active' : 'side-link'}
          onClick={() => onTab('monitors')}
        >
          Monitors
        </button>
        <button
          className={tab === 'incidents' ? 'side-link active' : 'side-link'}
          onClick={() => onTab('incidents')}
        >
          Incidents <span className="side-count">({openCount})</span>
        </button>
        <button
          className={tab === 'reports' ? 'side-link active' : 'side-link'}
          onClick={() => onTab('reports')}
        >
          Reports
        </button>
      </nav>
    </aside>
  )
}
