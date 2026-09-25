import { useEffect, useRef } from 'react'

// Single polling primitive for the whole app.
// onError receives fetch failures (otherwise the UI would fail silently).
export function usePolling(fn, ms, deps = [], onError) {
  const ref = useRef(fn)
  ref.current = fn
  const errRef = useRef(onError)
  errRef.current = onError
  useEffect(() => {
    const run = () => ref.current().catch((ex) => errRef.current?.(ex));
    run()
    const t = setInterval(run, ms)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
