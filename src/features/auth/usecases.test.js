import { describe, it, expect, vi } from 'vitest'
import { createAuthUseCases } from './usecases.js'

function fakeGateways() {
  const calls = []
  const store = {
    token: 't0',
    save(t) {
      this.token = t
    },
    clear() {
      this.token = null
    },
    load() {
      return this.token
    },
  }
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
    createMonitor: vi.fn(async (input) => {
      calls.push(input)
      return { id: 'm3', ...input }
    }),
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
