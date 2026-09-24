import { describe, it, expect, vi } from 'vitest'
import { createAuthUseCases, createMonitorUseCases } from './useCases.js'

function fakeGateways() {
  const calls = []
  const store = { token: 't0', save(t) { this.token = t }, clear() { this.token = null }, load() { return this.token } }
  const authGateway = {
    login: vi.fn(async () => ({ token: 'tok-1', user: { id: 'u1', email: 'a@b.c', name: 'A' } })),
    register: vi.fn(async () => ({ token: 'tok-2', user: { id: 'u2', email: 'n@b.c', name: 'N' } })),
    me: vi.fn(async () => ({ id: 'u1', email: 'a@b.c', name: 'A' })),
  }
  const monitors = [
    { id: 'm1', name: 'One', isActive: true, status: 'UP' },
    { id: 'm2', name: 'Two', isActive: false, status: 'DOWN' },
  ]
  const monitorGateway = {
    summary: vi.fn(async () => ({ totalMonitors: 2 })),
    monitors: vi.fn(async () => monitors),
    incidents: vi.fn(async () => [{ status: 'OPEN' }]),
    createMonitor: vi.fn(async (input) => { calls.push(input); return { id: 'm3', ...input } }),
    setActive: vi.fn(async (id, active) => ({ id, isActive: active })),
    removeMonitor: vi.fn(async () => ({})),
    checks: vi.fn(async () => [{ status: 'UP' }]),
    monitorIncidents: vi.fn(async () => []),
  }
  return { store, authGateway, monitorGateway, calls }
}

describe('auth use-cases', () => {
  it('login saves token and returns user', async () => {
    const { store, authGateway } = fakeGateways()
    const auth = createAuthUseCases({ authGateway, tokenStore: store })
    const user = await auth.login('a@b.c', 'secret123')
    expect(user.email).toBe('a@b.c')
    expect(store.token).toBe('tok-1')
  })
  it('restoreSession clears bad token', async () => {
    const { store, authGateway } = fakeGateways()
    authGateway.me.mockRejectedValueOnce(new Error('401'))
    const auth = createAuthUseCases({ authGateway, tokenStore: store })
    expect(await auth.restoreSession()).toBeNull()
    expect(store.token).toBeNull()
  })
  it('restoreSession without token skips gateway', async () => {
    const { store, authGateway } = fakeGateways()
    store.token = null
    const auth = createAuthUseCases({ authGateway, tokenStore: store })
    expect(await auth.restoreSession()).toBeNull()
    expect(authGateway.me).not.toHaveBeenCalled()
  })
})

describe('monitor use-cases', () => {
  it('loadDashboard aggregates three calls', async () => {
    const { monitorGateway } = fakeGateways()
    const uc = createMonitorUseCases({ monitorGateway })
    const d = await uc.loadDashboard()
    expect(d.monitors).toHaveLength(2)
    expect(d.summary.totalMonitors).toBe(2)
  })
  it('createMonitor normalizes before sending', async () => {
    const { monitorGateway, calls } = fakeGateways()
    const uc = createMonitorUseCases({ monitorGateway })
    await uc.createMonitor({ name: ' N ', url: 'https://x.com', intervalSeconds: '120' })
    expect(calls[0]).toMatchObject({ name: 'N', intervalSeconds: 120, timeoutSeconds: 5 })
  })
  it('togglePause flips active flag', async () => {
    const { monitorGateway } = fakeGateways()
    const uc = createMonitorUseCases({ monitorGateway })
    const out = await uc.togglePause({ id: 'm1', isActive: true })
    expect(monitorGateway.setActive).toHaveBeenCalledWith('m1', false)
    expect(out.isActive).toBe(false)
  })
  it('loadMonitorDetail picks monitor by id', async () => {
    const { monitorGateway } = fakeGateways()
    const uc = createMonitorUseCases({ monitorGateway })
    const d = await uc.loadMonitorDetail('m2')
    expect(d.monitor.name).toBe('Two')
    expect(d.checks).toHaveLength(1)
  })
})
