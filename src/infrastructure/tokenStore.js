// Token storage adapter. Application sees only { load, save, clear }.
export function createLocalTokenStore(key = 'pulse_token') {
  return {
    load: () => localStorage.getItem(key),
    save: (token) => localStorage.setItem(key, token),
    clear: () => localStorage.removeItem(key),
  }
}
