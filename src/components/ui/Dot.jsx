export function Dot({ status }) {
  const cls = status === 'UP' ? 'dot-up' : status === 'DOWN' ? 'dot-down' : 'dot-idle'
  const label = status === 'UP' ? 'Up' : status === 'DOWN' ? 'Down' : status === 'PAUSED' ? 'Paused' : 'Unknown'
  return (
    <>
      <span className={cls} aria-hidden="true">
        ●
      </span>
      <span className="sr-only">{label}</span>
    </>
  )
}
