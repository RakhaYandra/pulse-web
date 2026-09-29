# Pulse Web — Design Direction (DESIGN.md)

Owner: Rakha Putra Pebri Yandra · Status: approved · Dials: ENERGY 2 / RHYTHM 2 / MOTION 2

## Identity

Clinical ops console for a solo developer. Dark-first (legitimate R-21
reason: monitoring at night, dev tool), light mode shipped as a verified
choice, not a default. One accent (cyan: `#00e5ff` dark / `#007a8a` light,
AA-verified via script both modes). One motif: the ECG tick (`PulseMark`),
used in exactly three places (brand, attention divider, empty state).

## Decisions (R-31, one line each)

- Dark + light, both verified: user choice beats owner taste; R-34 gate on every UI change.
- Accent only at key moments (UP status, primary action, focus ring, motif): everywhere-accent is slop.
- Active tab neutral + accent underline: location indicator without painting the whole tab.
- Mono only for measured values (latency, timestamps, URLs): mono labels are an AI tell.
- Commas, not middle dots, in meta strings: dots-as-decoration is a tell.
- Stat numbers in sans, tabular: Inter carries hierarchy; mono is for instruments.
- Threshold line always on the chart: closeness-to-timeout is the question the chart answers.
- p50/p95 from real checks, no invented deltas: R-17, no trend without a series.
- Empty/error/stale states are first-class: an ops console that hides failure is dishonest.
- MOTION 2 (one entrance per view, hover feedback, sync dot in flight only): motion answers actions.
- No gradients-as-identity, no glass, no glow, no bento, no emoji, no fake data: technique needs purpose.

## Type

Inter (UI, reason: dense data readability) + JetBrains Mono (instruments only).
Single external load (Google Fonts), system fallback.

## Non-goals

Light-mode-only users get full parity (no degraded mode). No marketing
landing patterns inside the app. No new palette without re-running contrast
on all pairs, both themes.
