// Auth use-cases. Pure orchestration over injected ports —
// no React, no fetch, no localStorage.

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
