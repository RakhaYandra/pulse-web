# ADR-001 — Frontend Clean Architecture

Status: accepted (2026-09-25).

Context: dashboard shipped flat (`api.js` + 3 components, ~300 lines) with
business logic inside JSX (OPEN filter, uptime/avg math, spark geometry,
input coercion, polling) and transport mixed into data access.

Decision: `domain/` (entities, pure stats: uptimePct, avgResponseMs,
sparkPoints, countOpen, checkDisplay, input normalize — zero React/fetch) →
`application/` (ports as constructor-injected shapes + use-cases: auth,
dashboard, monitors, detail) → `infrastructure/` (httpClient transport,
apiGateway endpoint+mapper, localTokenStore) → `presentation/` (pure
components, hooks for polling/state). `App.jsx` is the composition root.

Rules (grep-verified): domain has no React/fetch/localStorage; application
has none either; views never import infrastructure (only via hooks/props).

Consequences: use-cases tested with fake gateways (15 vitest tests);
e2e specs untouched (black-box, still 5/5); UI byte-identical.
