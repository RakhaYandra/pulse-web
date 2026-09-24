import { useEffect, useRef } from 'react'

// Single polling primitive for the whole app.
export function usePolling(fn, ms, deps = []) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    ref.current().catch(() => {})
    const t = setInterval(() => ref.current().catch(() => {}), ms)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
