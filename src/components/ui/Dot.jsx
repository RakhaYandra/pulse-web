// Status badge: 8px pip + uppercase mono label, tinted 12% background.
// Colors come from ops tokens (--ok/--bad/--idle), never decorative.
export function Dot({ status }) {
  const kind =
    status === 'UP' ? 'up' : status === 'DOWN' ? 'down' : status === 'PAUSED' ? 'paused' : 'unknown'
  const label =
    status === 'UP' ? 'Up' : status === 'DOWN' ? 'Down' : status === 'PAUSED' ? 'Paused' : 'Unknown'
  return (
    <span className={`badge badge-${kind}`}>
      <span className="pip" aria-hidden="true" />
      {label}
    </span>
  )
}
