# Pulse Web — Design Audit

Date: 2026-09-29 · Scope: 7 views + 6 shared components (`src/`, 29-line tokens)
Method: code inspection + Playwright screenshots (desktop 1280 + mobile 390,
live stack) + contrast-checker runs. No code changed.

## Passes (keep)

- Contrast: all pairs AA (muted 5.81, accent 12.18, white 16.67, ok 8.70,
  bad 4.89 on surfaces).
- `focus-visible` ring + offset (`index.css:60`), `tabular-nums` on numbers,
  `prefers-reduced-motion` disables transitions, labels wrap inputs,
  keyboard handler on rows, empty states present, no em dash, no fake data.

## Findings

### HIGH

1. `MonitorDetailScreen.jsx:66` — fresh monitor renders **"n/a%"** uptime
   (string `'n/a'` + hard-coded `%` suffix) and **"UNKNOWN"** status.
   Screenshot-proof (`audit-detail.png`). Fix: conditional suffix, real
   initial status copy.
2. `hooks.js:21-30,82-91` — post-load poll failures swallowed; UI freezes
   on stale data with a frozen `ago()`. No error banner, no stale badge.
   Fix: surface poll errors (banner + `aria-live="polite"`), tick `ago()`.
3. `hooks.js:44-52` + `MonitorList.jsx:28-42` — toggle/remove have no
   try/catch, no pending state; delete uses native `confirm('Delete?')`
   (destructive without undo/modal). Fix: pending/disabled, inline confirm
   or undo window, error toast.
4. `LoginForm.jsx:9-13,21-35` — no client validation, no
   `type="email"`/`autocomplete`/`required`, no busy state, double-submit
   possible. Fix per web-interface-guidelines Forms rules.

### MEDIUM

5. No URL routing (`App.jsx:62` state-routed): back button exits detail,
   no deep-link/shareable monitor link, tab resets. Fix: minimal hash or
   router routes (`#/monitors/:id`).
6. `LoginForm.jsx:35` + banner `DashboardScreen.jsx:40` — generic labels
   ("Login", "View details"); error text raw from API (no next-step copy).
   Fix: specific labels ("Log in to Pulse"), errors with fix instructions.
7. `DashboardScreen.jsx:47-91` — `<nav>` duplicated in two branches;
   banner is full-width `<button>` (a11y smell). Fix: single nav, banner as
   region with link.
8. `MonitorList.jsx:7-20` — row is `div[role=button]` containing real
   `<button>`s (nested-interactive smell, stopPropagation crutch).
   Fix: row as link/button + separate action cell, or real `<a href>`.
9. Status color-only: `Dot.jsx` renders `●` with no text alternative.
   Fix: visually-hidden status text.
10. Mobile 390px (`audit-mobile.png`): long email wraps in topbar crowding
    logout; tabs wrap pushing "+ New" to second row. No horizontal leak
    (pass), but nav needs reflow pattern. Also missing
    `color-scheme: dark` + `theme-color` meta.

### LOW

11. Claim correction: repo was described as having a dark/light toggle;
    code is dark-only (`tokens.css`, no `data-theme`). Either ship the
    toggle (both modes verified) or stop claiming it.
12. `ReportsView` one-shot fetch (no polling), detail refetches all
    monitors per poll, lists unpaginated, `Spark` chart has min/max label
    but no data table.

## Recommendations (priority order)

1. Session A (correctness): fix #1, #3, #4. Real bugs, small.
2. Session B (trust): fix #2 (stale-data honesty) + #9 + #11.
3. Session C (navigation): #5 routing; unlocks shareable links for incidents.
4. Visual redesign only after A–C. Direction needed first (`DESIGN.md` or
   one decisive question); current WattVision dark clinical is coherent,
   non-generic, and passes contrast, so redesign is optional polish, not
   rescue. Honest dials today: ENERGY 1 / RHYTHM 1 / MOTION 1.

## Evidence

`/tmp/audit-dash.png`, `/tmp/audit-detail.png`, `/tmp/audit-mobile.png`
(throwaway run, not committed). Contrast via
`antislop-human/contrast-check.py` (5 pairs, all PASS).
