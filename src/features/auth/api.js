// Auth endpoints. Takes the shared http client; maps wire → domain here.

function mapUser(u) {
  return { id: u.id, email: u.email, name: u.name }
}

export function createAuthApi(http) {
  return {
    async login(email, password) {
      const data = await http.post('/api/v1/auth/login', { email, password })
      return { token: data.token, user: mapUser(data.user) }
    },
    async register(email, password, name) {
      const data = await http.post('/api/v1/auth/register', { email, password, name })
      return { token: data.token, user: mapUser(data.user) }
    },
    me: async () => mapUser(await http.get('/api/v1/auth/me')),
  }
}
