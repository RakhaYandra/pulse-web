// Pure statistics. No React, no fetch, no Date rendering.

export function uptimePct(checks = []) {
  if (!checks.length) return null
  const ups = checks.filter((c) => c.status === 'UP').length
  return (100 * ups) / checks.length
}

export function avgResponseMs(checks = []) {
  const timed = checks.filter((c) => c.responseTimeMs != null)
  if (!timed.length) return null
  return Math.round(timed.reduce((a, c) => a + c.responseTimeMs, 0) / timed.length)
}

export function countOpen(incidents = []) {
  return incidents.filter((i) => i.status === 'OPEN').length
}

// Newest-last points for the response-time sparkline.
export function sparkPoints(checks = [], width = 300, height = 60) {
  const pts = [...checks].reverse().filter((c) => c.responseTimeMs != null)
  if (!pts.length) return { points: [], path: '', max: 1 }
  const max = Math.max(...pts.map((c) => c.responseTimeMs), 1)
  const at = (i) => ({
    x: (i / Math.max(pts.length - 1, 1)) * width,
    y: height - (pts[i].responseTimeMs / max) * (height - 6) - 3,
    up: pts[i].status === 'UP',
  })
  const points = pts.map((_, i) => at(i))
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  return { points, path, max }
}

export function checkDisplay(check) {
  return {
    mark: check.status === 'UP' ? '✓' : '✗',
    code: check.statusCode ?? 'n/a',
    response: check.responseTimeMs != null ? `${check.responseTimeMs} ms` : check.error || 'n/a',
  }
}

// Attention order: DOWN first, then paused, then the rest (stable).
export function sortMonitors(monitors = []) {
  const rank = (m) => (m.status === 'DOWN' ? 0 : !m.isActive ? 1 : 2)
  return [...monitors]
    .map((m, i) => [m, i])
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1])
    .map(([m]) => m)
}

// Human duration between two ISO timestamps: "45s", "12m", "3h 5m", "2d 1h".
export function incidentDuration(startedAt, resolvedAt, nowMs = Date.now()) {
  const end = resolvedAt ? new Date(resolvedAt).getTime() : nowMs
  let s = Math.max(0, Math.round((end - new Date(startedAt).getTime()) / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 48) return `${h}h ${m % 60}m`
  return `${Math.floor(h / 24)}d ${h % 24}h`
}

// Format a seconds count like incidentDuration ("45s", "12m", "3h 5m").
export function formatDurationSecs(total) {
  if (total == null) return 'n/a'
  let s = Math.max(0, Math.round(total))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 48) return `${h}h ${m % 60}m`
  return `${Math.floor(h / 24)}d ${h % 24}h`
}
