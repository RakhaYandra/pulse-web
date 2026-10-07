# Pulse Web — Design Direction (DESIGN.md)

Owner: Rakha Putra Pebri Yandra · Status: approved · Dials: ENERGY 2 / RHYTHM 2 / MOTION 2
Source: Stitch `Pulse API Monitor Console` → system `Telemetry Command Deck`.

## Identity

Ops command deck for a solo developer. Dark-first (monitoring at night,
dev tool), light mode fully verified, never degraded. One accent (cyan
`#00e5ff` dark / deep teal `#007a8a` light, AA on every surface). One motif:
the ECG tick (`PulseMark`), exactly three places (brand, attention banner,
empty state). Fixed left rail (240px, icon-row under 900px) + 52px topbar;
create-monitor lives in a right slide-over drawer, not a tab.

## Decisions (R-31, one line each)

- Dark + light, both AA-verified by script: user choice beats owner taste; R-34 gate on every UI change.
- Sidebar rail + drawer: navigation stays visible, creation never loses list context.
- Accent only at key moments (primary action, focus ring, active rail marker, chart line): everywhere-accent is slop.
- Mono only for measured values (latency, timestamps, URLs, counts): mono labels are an AI tell.
- Stat titles in 11px uppercase caps, values in mono-metric: hierarchy without decoration.
- Status as bordered badge (pip + UP/DOWN/PAUSED): a bare dot is ambiguous at a glance.
- Commas, not middle dots, in meta strings: dots-as-decoration is a tell.
- Threshold line always on the chart: closeness-to-timeout is the question the chart answers.
- p50/p95 from real checks, no invented deltas: R-17, no trend without a series.
- Empty/error/stale states are first-class: an ops console that hides failure is dishonest.
- Legacy `?tab=new` opens the drawer: old links keep working.
- Fleet table over cards for monitors: service, state badge, method + target, uptime 24h, last checked, actions; filter chips All/Down/Up/Paused are client-side.
- Uptime column reads `reliability?days=1` once per mount + after mutations, never on the 15s poll: 24h data must not cost per-poll requests (rate-limit honesty).
- Edit reuses the create drawer via existing `PATCH /monitors/:id`; search and CSV export are client-side over loaded rows.
- Login speaks ops-cant (SRE identity, master cipher) but keeps Email/Password/Display name accessible names: tests read semantics, humans read flavor.
- Breach callout on detail derives from the latest check + open incident: no invented series.
- Fleet aggregates (uptime mean, MTTR mean, totals) derive from loaded rows only.
- MOTION 2 (one entrance per view, drawer slide, hover feedback, sync dot in flight only): motion answers actions.
- No gradients-as-identity, no glass, no glow, no bento, no emoji, no fake data, no batch actions: technique needs purpose.
- Zero new dependencies: tokens + hand-rolled primitives only; no Tailwind (preflight risk exceeds utility at this size).

## Type

Inter (UI, tabular-nums globally) + JetBrains Mono (instruments only).
Single external load (Google Fonts), system fallback.

## Non-goals

Light-mode-only users get full parity (no degraded mode). No marketing
landing patterns inside the app. No new palette without re-running contrast
on all pairs, both themes.
