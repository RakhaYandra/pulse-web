// Application use-cases. Pure orchestration over injected ports —
// no React, no fetch, no localStorage. Ports (shapes only):
//   authGateway: { login, register, me }
//   monitorGateway: { monitors, createMonitor, setActive, removeMonitor,
//                     checks, monitorIncidents, incidents, summary }
//   tokenStore: { load, save, clear }

import { normalizeMonitorInput } from '../domain/entities.js'

export function createAuthUseCases({ authGateway, tokenStore }) {
  return {
    async login(email, password) {
      const { token, user } = await authGateway.login(email, password)
      tokenStore.save(token)
      return user
    },
    async register(email, password, name) {
      const { token, user } = await authGateway.register(email, password, name)
      tokenStore.save(token)
      return user
    },
    async restoreSession() {
      if (!tokenStore.load()) return null
      try {
        return await authGateway.me()
      } catch {
        tokenStore.clear()
        return null
      }
    },
    logout() {
      tokenStore.clear()
    },
  }
}

export function createMonitorUseCases({ monitorGateway }) {
  return {
    loadDashboard: () =>
      Promise.all([monitorGateway.summary(), monitorGateway.monitors(), monitorGateway.incidents()]).then(
        ([summary, monitors, incidents]) => ({ summary, monitors, incidents }),
      ),
    createMonitor: (raw) => monitorGateway.createMonitor(normalizeMonitorInput(raw)),
    togglePause: (monitor) => monitorGateway.setActive(monitor.id, !monitor.isActive),
    removeMonitor: (id) => monitorGateway.removeMonitor(id),
    loadMonitorDetail: (id) =>
      Promise.all([
        monitorGateway.monitors(),
        monitorGateway.checks(id),
        monitorGateway.monitorIncidents(id),
      ]).then(([monitors, checks, incidents]) => ({
        monitor: monitors.find((m) => m.id === id) ?? null,
        checks,
        incidents,
      })),
    loadReliability: (days = 30) => monitorGateway.reliability(days),
  }
}
