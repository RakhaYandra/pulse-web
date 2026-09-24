import { sparkPoints } from '../../domain/stats.js'

// Pure chart: geometry from domain, SVG only here.
export function Spark({ checks }) {
  const { points, path } = sparkPoints(checks)
  if (!points.length) return <div className="muted">no data yet</div>
  return (
    <svg width={300} height={60} className="spark">
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={p.up ? '#22c55e' : '#ef4444'} />
      ))}
    </svg>
  )
}
