import { useState } from 'react'
import { PulseMark } from '../../../components/ui/PulseMark.jsx'

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

  const submitLabel = busy ? 'Authenticating…' : 'Enter ops deck'

  return (
    <div className="center">
      <form className="card auth-card" onSubmit={submit}>
        <h1 className="brand">
          <span className="brand-mark">
            <PulseMark />
          </span>
          Pulse
        </h1>
        <p className="muted">API monitoring and incidents console</p>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        <div className="seg" role="group" aria-label="Auth mode">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            aria-pressed={mode === 'login'}
            onClick={() => setMode('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            aria-pressed={mode === 'register'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        <label>
          <span className="label-caps">SRE identity / work email</span>
          <input
            type="email"
            name="email"
            aria-label="Email"
            autoComplete="email"
            spellCheck={false}
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span className="label-caps">Master cipher / passkey</span>
          <input
            type="password"
            name={mode === 'login' ? 'current-password' : 'new-password'}
            aria-label="Password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {mode === 'register' && (
          <label>
            <span className="label-caps">Callsign / display name</span>
            <input
              name="name"
              aria-label="Display name"
              autoComplete="name"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        )}
        <button className="btn-block" type="submit" disabled={busy}>
          {submitLabel}
        </button>
      </form>
    </div>
  )
}
