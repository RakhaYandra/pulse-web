// Identity motif: single ECG tick. One color (currentColor), three usages
// (topbar logo, attention divider, empty state). Reason (R-31): binds the
// product name to the visual; everything else stays quiet.
export function PulseMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="1,13 7,13 10,5 13,21 16,13 23,13" />
    </svg>
  )
}
