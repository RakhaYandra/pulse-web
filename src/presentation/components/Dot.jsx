export function Dot({ status }) {
  const color = status === 'UP' ? '#22c55e' : status === 'DOWN' ? '#ef4444' : '#9ca3af'
  return <span style={{ color }}>●</span>
}
