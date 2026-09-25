import { describe, it, expect } from 'vitest'
import { normalizeMonitorInput } from './entities.js'
import { uptimePct, avgResponseMs, countOpen, sparkPoints, checkDisplay } from './stats.js'

describe('normalizeMonitorInput', () => {
  it('applies defaults', () => {
    expect(normalizeMonitorInput({ name: ' P ', url: ' https://x.com ' })).toEqual({
      name: 'P', url: 'https://x.com', intervalSeconds: 300,
      timeoutSeconds: 5, failureThreshold: 3, recoveryThreshold: 2,
    })
  })
  it('coerces numeric strings', () => {
    const out = normalizeMonitorInput({ name: 'a', url: 'https://x.com', intervalSeconds: '120', timeoutSeconds: '4' })
    expect(out.intervalSeconds).toBe(120)
    expect(out.timeoutSeconds).toBe(4)
  })
})

describe('stats', () => {
  const checks = [
    { status: 'UP', responseTimeMs: 100 },
    { status: 'UP', responseTimeMs: 200 },
    { status: 'DOWN', responseTimeMs: 400 },
  ]
  it('uptimePct', () => {
    expect(uptimePct(checks)).toBeCloseTo(66.67, 1)
    expect(uptimePct([])).toBeNull()
  })
  it('avgResponseMs ignores missing', () => {
    expect(avgResponseMs(checks)).toBe(233)
    expect(avgResponseMs([{ status: 'ERROR', responseTimeMs: null }])).toBeNull()
  })
  it('countOpen', () => {
    expect(countOpen([{ status: 'OPEN' }, { status: 'RESOLVED' }])).toBe(1)
  })
  it('sparkPoints empty', () => {
    expect(sparkPoints([]).points).toEqual([])
  })
  it('sparkPoints geometry', () => {
    const { points, path } = sparkPoints(checks, 300, 60)
    expect(points).toHaveLength(3)
    expect(path.startsWith('M')).toBe(true)
    expect(points[0].up).toBe(false) // reversed: oldest (DOWN) first
    expect(points[2].up).toBe(true)
  })
  it('checkDisplay', () => {
    expect(checkDisplay({ status: 'UP', responseTimeMs: 50 })).toMatchObject({ mark: '✓', response: '50 ms' })
    expect(checkDisplay({ status: 'ERROR', error: 'boom' })).toMatchObject({ mark: '✗', code: 'n/a', response: 'boom' })
  })
})

describe('sortMonitors', () => {
  it('orders DOWN, paused, then rest, stable', async () => {
    const { sortMonitors } = await import('./stats.js')
    const ms = [
      { id: 'a', status: 'UP', isActive: true },
      { id: 'b', status: 'DOWN', isActive: true },
      { id: 'c', status: 'UP', isActive: false },
      { id: 'd', status: 'UP', isActive: true },
    ]
    expect(sortMonitors(ms).map((m) => m.id)).toEqual(['b', 'c', 'a', 'd'])
  })
})

describe('incidentDuration', () => {
  it('formats durations', async () => {
    const { incidentDuration } = await import('./stats.js')
    expect(incidentDuration('2026-09-25T10:00:00Z', '2026-09-25T10:00:45Z')).toBe('45s')
    expect(incidentDuration('2026-09-25T10:00:00Z', '2026-09-25T10:12:00Z')).toBe('12m')
    expect(incidentDuration('2026-09-25T10:00:00Z', '2026-09-25T13:05:00Z')).toBe('3h 5m')
  })
})

describe('formatDurationSecs', () => {
  it('formats seconds', async () => {
    const { formatDurationSecs } = await import('./stats.js')
    expect(formatDurationSecs(null)).toBe('n/a')
    expect(formatDurationSecs(45)).toBe('45s')
    expect(formatDurationSecs(720)).toBe('12m')
    expect(formatDurationSecs(11100)).toBe('3h 5m')
  })
})
