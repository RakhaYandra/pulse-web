import { useState } from 'react'

export function useAuth(authUC) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')

  async function restore() {
    setChecking(true)
    const u = await authUC.restoreSession()
    setUser(u)
    setChecking(false)
  }

  async function login(email, password) {
    setError('')
    try {
      setUser(await authUC.login(email, password))
    } catch (ex) {
      setError(ex.message)
    }
  }

  async function register(email, password, name) {
    setError('')
    try {
      setUser(await authUC.register(email, password, name))
    } catch (ex) {
      setError(ex.message)
    }
  }

  function logout() {
    authUC.logout()
    setUser(null)
  }

  return { user, checking, error, restore, login, register, logout }
}
