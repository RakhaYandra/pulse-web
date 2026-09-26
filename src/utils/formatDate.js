// Display date formatting (single source; was inline-duplicated in 3 spots).

export function formatDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString()
}

export function formatCheckTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })} ${d.toLocaleTimeString()}`
}

export function ago(ts) {
  if (!ts) return ''
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000))
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}
