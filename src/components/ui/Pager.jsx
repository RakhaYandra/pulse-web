export function Pager({ current, pages, total, onPage }) {
  if (pages <= 1) return null
  return (
    <div className="pager">
      <button disabled={current <= 1} onClick={() => onPage(current - 1)} aria-label="Previous page">
        ← Prev
      </button>
      <span className="muted">
        Page {current} of {pages} · {total} total
      </span>
      <button disabled={current >= pages} onClick={() => onPage(current + 1)} aria-label="Next page">
        Next →
      </button>
    </div>
  )
}
