// API gateway: endpoint knowledge + JSON (snake_case) → domain (camelCase)
// mapping. Only layer that knows the wire shapes.

function mapMonitor(m) {
  return {
    id: m.id, name: m.name, url: m.url, method: m.method,
    intervalSeconds: m.interval_seconds, timeoutSeconds: m.timeout_seconds,
    failureThreshold: m.failure_threshold, recoveryThreshold: m.recovery_threshold,
    status: m.status, isActive: m.is_active, lastCheckedAt: m.last_checked_at,
  }
}

function mapCheck(c) {
  return {
    status: c.status, statusCode: c.status_code ?? null,
    responseTimeMs: c.response_time_ms ?? null,
    error: c.error || '', checkedAt: c.checked_at,
  }
}

function mapIncident(i) {
  return {
    id: i.id, monitorName: i.monitor_name, status: i.status, reason: i.reason,
    startedAt: i.started_at, resolvedAt: i.resolved_at ?? null,
    failureCount: i.failure_count, recoveryCount: i.recovery_count,
  }
}

function toWire(input) {
  return {
    name: input.name, url: input.url,
    interval_seconds: input.intervalSeconds, timeout_seconds: input.timeoutSeconds,
    failure_threshold: input.failureThreshold, recovery_threshold: input.recoveryThreshold,
  }
}

export function createApiGateway(http) {
  return {
    // auth
    async login(email, password) {
      const data = await http.post('/api/v1/auth/login', { email, password })
      return { token: data.token, user: { id: data.user.id, email: data.user.email, name: data.user.name } }
    },
    async register(email, password, name) {
      const data = await http.post('/api/v1/auth/register', { email, password, name })
      return { token: data.token, user: { id: data.user.id, email: data.user.email, name: data.user.name } }
    },
    me: () => http.get('/api/v1/auth/me'),
    // monitors
    monitors: async () => (await http.get('/api/v1/monitors')).map(mapMonitor),
    createMonitor: async (input) => mapMonitor(await http.post('/api/v1/monitors', toWire(input))),
    async setActive(id, active) {
      return mapMonitor(await http.post(`/api/v1/monitors/${id}/${active ? 'resume' : 'pause'}`))
    },
    removeMonitor: (id) => http.del(`/api/v1/monitors/${id}`),
    // reads
    checks: async (id) => (await http.get(`/api/v1/monitors/${id}/checks?limit=20`)).map(mapCheck),
    monitorIncidents: async (id) => (await http.get(`/api/v1/monitors/${id}/incidents`)).map(mapIncident),
    incidents: async () => (await http.get('/api/v1/incidents')).map(mapIncident),
    summary: () => http.get('/api/v1/dashboard/summary').then((s) => ({
      totalMonitors: s.total_monitors, up: s.up, down: s.down,
      activeIncidents: s.active_incidents, uptime24h: s.uptime_24h,
    })),
  }
}
