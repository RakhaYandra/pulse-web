// Pure pagination slice. Page is 1-based; out-of-range clamps.
export const PAGE_SIZE = 20

export function paginate(items = [], page = 1, size = PAGE_SIZE) {
  const total = items.length
  const pages = Math.max(1, Math.ceil(total / size))
  const current = Math.min(Math.max(1, page), pages)
  return {
    rows: items.slice((current - 1) * size, current * size),
    current,
    pages,
    total,
  }
}
