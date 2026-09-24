import { useState } from 'react'

const EMPTY = { name: '', url: '', intervalSeconds: 300, timeoutSeconds: 5, failureThreshold: 3, recoveryThreshold: 2 }

export function MonitorForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY)
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault()
    const msg = await onCreate(form)
    if (msg) setErr(msg)
    else {
      setErr('')
      setForm(EMPTY)
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      {err && <div className="error">{err}</div>}
      <input placeholder="Name: Payment API" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="URL: https://api.example.com/health" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
      <label>Interval (s, ≥60)<input type="number" value={form.intervalSeconds} onChange={(e) => setForm({ ...form, intervalSeconds: e.target.value })} /></label>
      <label>Timeout (s)<input type="number" value={form.timeoutSeconds} onChange={(e) => setForm({ ...form, timeoutSeconds: e.target.value })} /></label>
      <label>Failure threshold<input type="number" value={form.failureThreshold} onChange={(e) => setForm({ ...form, failureThreshold: e.target.value })} /></label>
      <label>Recovery threshold<input type="number" value={form.recoveryThreshold} onChange={(e) => setForm({ ...form, recoveryThreshold: e.target.value })} /></label>
      <button type="submit">Create monitor</button>
    </form>
  )
}
