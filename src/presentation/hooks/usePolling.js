import { useEffect, useRef } from 'react'

// Single polling primitive for the whole app.
// onError receives fetch failures (otherwise the UI would fail silently).
export function usePolling(fn, ms, deps = [], onError) {
  const ref = useRef(fn)
  ref.current = fn
  const errRef = useRef(onError)
  errRef.current = onError
  useEffect(() => {
    const run = () => {
      if (document.hidden) return Promise.resolve()
      return ref.current().catch((ex) => errRef.current?.(ex))
    }
    run()
    const t = setInterval(run, ms)
    const onVisible = () => { if (!document.hidden) run() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVisible) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
