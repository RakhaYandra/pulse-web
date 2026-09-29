import { useState } from 'react'

export function LoginForm({ onLogin, onRegister, error, busy }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  function submit(e) {
    e.preventDefault()
    if (busy) return
    if (mode === 'login') onLogin(email, password)
    else onRegister(email, password, name)
  }

  const submitLabel = mode === 'login' ? (busy ? 'Logging in…' : 'Login') : busy ? 'Registering…' : 'Register'

  return (
    <div className="center">
      <form className="card" onSubmit={submit}>
        <h1>Pulse</h1>
        <p className="muted">API monitoring & incidents</p>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            spellCheck={false}
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password (min 8)
          <input
            type="password"
            name={mode === 'login' ? 'current-password' : 'new-password'}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {mode === 'register' && (
          <label>
            Display name
            <input
              name="name"
              autoComplete="name"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        )}
        <button type="submit" disabled={busy}>
          {submitLabel}
        </button>
        <button
          type="button"
          className="link"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  )
}
