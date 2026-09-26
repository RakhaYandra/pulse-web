// Raw transport. Knows fetch, base URL, and token injection — nothing about
// domain shapes (returns parsed `data` verbatim for the gateway to map).

export function createHttpClient({ baseUrl, getToken }) {
  async function req(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
    const token = getToken()
    if (token) headers.Authorization = 'Bearer ' + token
    const res = await fetch(baseUrl + path, { ...opts, headers })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error || 'request failed')
    return body.data
  }
  return {
    get: (path) => req(path),
    post: (path, data) => req(path, { method: 'POST', body: JSON.stringify(data ?? {}) }),
    patch: (path, data) => req(path, { method: 'PATCH', body: JSON.stringify(data) }),
    del: (path) => req(path, { method: 'DELETE' }),
  }
}
