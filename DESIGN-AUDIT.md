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

### HIGH — all fixed Sesi A (commit `14f57fe`, verified e2e 7/7)

1. ~~`MonitorDetailScreen.jsx:66` "n/a%" + "UNKNOWN"~~ → `n/a`, `waiting for
   first check` (screenshot-proof).
2. ~~Post-load poll failures swallowed~~ → open, tracked below as Fase 1 item.
3. ~~toggle/remove tanpa try/catch; native `confirm()`~~ → pending states,
   error banner, two-step delete.
4. ~~Login tanpa validasi/busy~~ → `type=email`, autocomplete, required,
   minLength 8, busy labels.

### Follow-up phases (this document's second life)

Fase 1 (commit `e03b430`): stale banner + ticking `ago()`, single nav,
section banner, row semantics (no nested buttons), Dot SR text, mobile
topbar truncate, `color-scheme` + `theme-color`, Reports polling.
Fase 2a-L (commit `101f518`): light theme, all pairs AA-reverified by
script, toggle + persistence, e2e theme test.
Fase 2 visual (this commit): `PulseMark` motif ×3, cyan restraint (active
tab neutral + underline, secondary Back), sans stat numerals, mono only for
measured values, comma meta separators, attention focal (name + duration +
open link), p50/p95, threshold line + label, chart data table, incident
timeline, MOTION 2 (view entrance, row hover, sync dot).
Direction locked in `DESIGN.md` (ENERGY 2 / RHYTHM 2 / MOTION 2).

### Residual (accepted, not planned)

- Lists unpaginated; detail refetches all monitors per poll; `Spark`
  min/max labels overlap the threshold line at extreme ratios (labeled,
  readable, accepted).
- Full URL routing (`#/monitors/:id`) deferred — rows are real buttons now,
  router is a clean follow-up.

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
