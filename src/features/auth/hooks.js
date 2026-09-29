import { useCallback, useState } from 'react'

export function useAuth(authUC) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Stable across renders (only stable setters + module singleton inside).
  const restore = useCallback(async () => {
    setChecking(true)
    const u = await authUC.restoreSession()
    setUser(u)
    setChecking(false)
  }, [authUC])

  async function login(email, password) {
    setError('')
    setBusy(true)
    try {
      setUser(await authUC.login(email, password))
    } catch (ex) {
      setError(ex.message)
    } finally {
      setBusy(false)
    }
  }

  async function register(email, password, name) {
    setError('')
    setBusy(true)
    try {
      setUser(await authUC.register(email, password, name))
    } catch (ex) {
      setError(ex.message)
    } finally {
      setBusy(false)
    }
  }

  function logout() {
    authUC.logout()
    setUser(null)
  }

  return { user, checking, error, busy, restore, login, register, logout }
}
