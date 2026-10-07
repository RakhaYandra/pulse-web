import { useEffect, useRef } from 'react'

// Right slide-over drawer for the create-monitor form.
// Focus moves to the first field on open, Esc closes, focus returns on close.
export function Drawer({ title, onClose, children }) {
  const panelRef = useRef(null)
  const prevFocus = useRef(null)

  useEffect(() => {
    prevFocus.current = document.activeElement
    const panel = panelRef.current
    const first = panel?.querySelector('input')
    ;(first || panel)?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prevFocus.current?.focus?.()
    }
  }, [onClose])

  return (
    <>
      <button className="scrim" aria-label="Close dialog" onClick={onClose} tabIndex={-1} />
      <div className="drawer" role="dialog" aria-modal="true" aria-label={title} ref={panelRef} tabIndex={-1}>
        <div className="drawer-head">
          <h2>{title}</h2>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </>
  )
}
