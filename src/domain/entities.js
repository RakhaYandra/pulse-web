// Domain entities. Plain data, no React, no fetch.
// Shapes mirror the API contract but belong to the app, not the transport.

export const MonitorStatus = { UNKNOWN: 'UNKNOWN', UP: 'UP', DOWN: 'DOWN', PAUSED: 'PAUSED' }
export const CheckStatus = { UP: 'UP', DOWN: 'DOWN', TIMEOUT: 'TIMEOUT', ERROR: 'ERROR' }
export const IncidentStatus = { OPEN: 'OPEN', RESOLVED: 'RESOLVED' }

// createMonitor: { name, url, intervalSeconds, timeoutSeconds, failureThreshold, recoveryThreshold }
export function normalizeMonitorInput(raw = {}) {
  const num = (v, d) => {
    const n = Number(v)
    return Number.isFinite(n) && n !== 0 ? n : d
  }
  return {
    name: String(raw.name ?? '').trim(),
    url: String(raw.url ?? '').trim(),
    intervalSeconds: num(raw.intervalSeconds, 300),
    timeoutSeconds: num(raw.timeoutSeconds, 5),
    failureThreshold: num(raw.failureThreshold, 3),
    recoveryThreshold: num(raw.recoveryThreshold, 2),
  }
}
