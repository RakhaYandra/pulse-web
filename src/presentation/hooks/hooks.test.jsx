// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePolling } from './usePolling.js'
import { useDashboard } from './useDashboard.js'
import { useMonitorDetail } from './useMonitorDetail.js'

function fakeUC(over = {}) {
  return {
    loadDashboard: async () => ({
      summary: { totalMonitors: 1, up: 1, down: 0, activeIncidents: 0, uptime24h: 100 },
      monitors: [{ id: 'm1', name: 'One', status: 'UP', isActive: true }],
      incidents: [],
    }),
    createMonitor: async () => ({ id: 'm2' }),
    togglePause: async () => {},
    removeMonitor: async () => {},
    loadMonitorDetail: async () => ({
      monitor: { id: 'm1', name: 'One', status: 'UP' },
      checks: [{ status: 'UP' }],
      incidents: [],
    }),
    ...over,
  }
}

describe('usePolling', () => {
  it('runs immediately then on interval, routes errors', async () => {
    const fn = vi.fn(async () => {})
    const onError = vi.fn()
    const { unmount } = renderHook(() => usePolling(fn, 50, [], onError))
    await waitFor(() => expect(fn.mock.calls.length).toBeGreaterThanOrEqual(1))
    const errFn = vi.fn(async () => {
      throw new Error('boom')
    })
    const r2 = renderHook(() => usePolling(errFn, 50, [], onError))
    await waitFor(() => expect(onError).toHaveBeenCalledWith(expect.any(Error)))
    unmount()
    r2.unmount()
  })
})

describe('useDashboard', () => {
  it('loads summary, monitors, incidents', async () => {
    const { result } = renderHook(() => useDashboard(fakeUC()))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.monitors).toHaveLength(1)
    expect(result.current.summary.totalMonitors).toBe(1)
    expect(result.current.loadError).toBe('')
  })

  it('surfaces load failure when nothing loaded yet', async () => {
    const { result } = renderHook(() =>
      useDashboard(
        fakeUC({
          loadDashboard: async () => {
            throw new Error('down')
          },
        }),
      ),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.loadError).toBe('down')
  })

  it('create returns server message on failure', async () => {
    const { result } = renderHook(() =>
      useDashboard(
        fakeUC({
          createMonitor: async () => {
            throw new Error('bad url')
          },
        }),
      ),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    let msg
    await act(async () => {
      msg = await result.current.create({})
    })
    expect(msg).toBe('bad url')
    expect(result.current.error).toBe('bad url')
  })
})

describe('useMonitorDetail', () => {
  it('loads monitor, checks, incidents', async () => {
    const { result } = renderHook(() => useMonitorDetail(fakeUC(), 'm1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.monitor.name).toBe('One')
    expect(result.current.checks).toHaveLength(1)
  })

  it('shows not-found style error state on failure', async () => {
    const { result } = renderHook(() =>
      useMonitorDetail(
        fakeUC({
          loadMonitorDetail: async () => {
            throw new Error('gone')
          },
        }),
        'm1',
      ),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.loadError).toBe('gone')
    expect(result.current.monitor).toBeNull()
  })
})
