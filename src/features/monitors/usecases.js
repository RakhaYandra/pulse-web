// Monitor use-cases (dashboard, detail, reports). Pure orchestration over
// the injected monitor gateway — no React, no fetch, no localStorage.

import { normalizeMonitorInput } from '../../domain/entities.js'

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
