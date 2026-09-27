import { useId } from 'react'
import { sparkPoints } from '../../domain/stats.js'

// Area chart (WattVision Do: area fill softens peaks). Geometry from domain,
// SVG only here. Grid + gradient only; DOWN points marked red.
const W = 300
const H = 60

export function Spark({ checks }) {
  const { points, path } = sparkPoints(checks)
  const gid = useId()
  if (!points.length) return <div className="muted">no data yet</div>
  const last = points[points.length - 1]
  const area = `${path} L${last.x.toFixed(1)},${H} L0,${H} Z`
  const timed = checks.filter((c) => c.responseTimeMs != null).map((c) => c.responseTimeMs)
  const max = Math.max(...timed)
  const min = Math.min(...timed)
  return (
    <svg
      width={W}
      height={H}
      className="spark"
      role="img"
      aria-label={`Response time, min ${min} ms, max ${max} ms`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} className="spark-grid" />
      ))}
      <path d={area} fill={`url(#${gid})`} stroke="none" />
      <path d={path} fill="none" strokeWidth="2" />
      {points.map((p, i) =>
        p.up ? null : (
          <circle
            key={`${p.x.toFixed(1)}-${p.y.toFixed(1)}-${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            className="dot-down"
            fill="currentColor"
          />
        ),
      )}
      <text x="4" y="10" className="spark-label">
        {max} ms
      </text>
      <text x="4" y={H - 4} className="spark-label">
        {min} ms
      </text>
    </svg>
  )
}
