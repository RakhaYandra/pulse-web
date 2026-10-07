import { useState } from 'react'

const EMPTY = {
  name: '',
  url: '',
  intervalSeconds: 300,
  timeoutSeconds: 5,
  failureThreshold: 3,
  recoveryThreshold: 2,
}

export function MonitorForm({ onCreate, initial, submitLabel = 'Create monitor' }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...initial }))
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
      <div className="fsection">
        <span className="fno">01</span>Identity
      </div>
      <label>
        <span className="label-caps">Target identifier</span>
        <input
          aria-label="Name"
          placeholder="e.g. Payment API"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>
      <div className="fsection">
        <span className="fno">02</span>Endpoint
      </div>
      <label>
        <span className="label-caps">Target URL</span>
        <input
          aria-label="URL"
          placeholder="e.g. https://api.example.com/health"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
      </label>
      <div className="fsection">
        <span className="fno">03</span>Cadence & guardrails
      </div>
      <label>
        <span className="label-caps">Interval (s, ≥60)</span>
        <input
          aria-label="Interval"
          type="number"
          value={form.intervalSeconds}
          onChange={(e) => setForm({ ...form, intervalSeconds: e.target.value })}
        />
      </label>
      <label>
        <span className="label-caps">Timeout (s)</span>
        <input
          aria-label="Timeout"
          type="number"
          value={form.timeoutSeconds}
          onChange={(e) => setForm({ ...form, timeoutSeconds: e.target.value })}
        />
      </label>
      <label>
        <span className="label-caps">Failure threshold</span>
        <input
          aria-label="Failure threshold"
          type="number"
          value={form.failureThreshold}
          onChange={(e) => setForm({ ...form, failureThreshold: e.target.value })}
        />
      </label>
      <label>
        <span className="label-caps">Recovery threshold</span>
        <input
          aria-label="Recovery threshold"
          type="number"
          value={form.recoveryThreshold}
          onChange={(e) => setForm({ ...form, recoveryThreshold: e.target.value })}
        />
      </label>
      <button className="btn-block" type="submit">
        {submitLabel}
      </button>
    </form>
  )
}
