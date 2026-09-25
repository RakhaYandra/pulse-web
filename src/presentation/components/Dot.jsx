export function Dot({ status }) {
  const cls = status === 'UP' ? 'dot-up' : status === 'DOWN' ? 'dot-down' : 'dot-idle'
  return <span className={cls}>●</span>
}
