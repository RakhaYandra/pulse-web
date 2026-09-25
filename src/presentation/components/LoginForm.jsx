import { useState } from 'react'

export function LoginForm({ onLogin, onRegister, error }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  function submit(e) {
    e.preventDefault()
    if (mode === 'login') onLogin(email, password)
    else onRegister(email, password, name)
  }

  return (
    <div className="center">
      <form className="card" onSubmit={submit}>
        <h1>Pulse</h1>
        <p className="muted">API monitoring & incidents</p>
        {error && <div className="error">{error}</div>}
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password (min 8)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {mode === 'register' && <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />}
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
        <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  )
}
