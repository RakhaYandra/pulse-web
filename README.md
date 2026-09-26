# Pulse Web — monitoring dashboard

> Ecosystem: [api](https://github.com/RakhaYandra/pulse) · [web](https://github.com/RakhaYandra/pulse-web) · [docs](https://github.com/RakhaYandra/pulse-docs/releases) · [data](https://github.com/RakhaYandra/pulse-data) · [qa](https://github.com/RakhaYandra/pulse-qa) · [ops](https://github.com/RakhaYandra/pulse-ops)

React dashboard for the Pulse monitoring API: overview stats, monitor
list/detail with SVG response-time chart, recent checks, incident history
(click through to the monitor), per-monitor reliability reports (uptime,
MTTR, 30-day window), monitor CRUD + pause/resume. No router —
state-driven views; data refreshes every 15s. Full Clean Architecture
(see below).

![Dashboard](https://raw.githubusercontent.com/RakhaYandra/pulse-docs/main/dashboard.png)

![Monitor detail](https://raw.githubusercontent.com/RakhaYandra/pulse-docs/main/detail.png)

## Dev

Requirements: Node 18+.

```bash
npm install
npm run dev   # http://localhost:5173 (API default http://localhost:8080)
```

Point at another API:

```bash
VITE_API_URL=http://host:8080 npm run dev
```

## Prod

```bash
VITE_API_URL=http://api-host:8080 docker compose up -d --build  # :5173
```

The image builds the static bundle with the API URL baked in (Vite),
then serves it via nginx.

## Test

```bash
npx vitest run          # 18 unit tests (domain + use-cases, fake gateways)
npm test --prefix e2e   # 7 Playwright tests, black-box (needs API + web up)
BASE_URL=http://other:5173 npm test --prefix e2e   # against another frontend
```

E2E registers throwaway users and drives the real UI; the API contract it
relies on is owned by the backend repo (`qa/collection.json`, Newman 20/20).

## Architecture

Full Clean Architecture ([ADR-001-fe-ca](https://github.com/RakhaYandra/pulse-docs/blob/main/ADR-001-fe-ca.md)):

```
domain/          entities + pure stats — zero React/fetch
features/{auth,monitors,incidents,reports}/
                 per-feature api (endpoint + JSON→domain mapping),
                 use-cases (constructor-injected, fake-tested),
                 hooks + components colocated
components/ui/   shared presentational primitives (Dot, Spark, Stats)
hooks/           shared usePolling primitive
lib/             httpClient (transport), tokenStore (localStorage adapter)
utils/           display formatters (formatDate)
styles/          global CSS + design tokens
domain/          entities.js, stats.js (+ tests)
app/             App.jsx (composition root) + DashboardScreen.jsx (shell)
```

Layer rules (grep-verified): `domain/` has no React/fetch/localStorage;
feature code never imports another feature's internals (only via `app/`
composition); views never touch transport (only via hooks/props).
Incidents/reports consume the shared monitoring gateway — one wire contract,
no mapper duplication (documented deviation from one-api-per-feature).

Styling: global CSS (`styles/index.css`) + design tokens (`styles/tokens.css`),
no CSS Modules — deliberate at this size (one 60-line stylesheet, no class
collisions); revisit if component count doubles.

Auth: JWT from login/register, stored via `TokenStore`, sent as
`Authorization: Bearer`; 401 on restore clears the session back to login.

## Layout

```
src/
├── domain/           entities.js, stats.js (+ tests, shared kernel)
├── app/              App.jsx (composition root), DashboardScreen.jsx (shell)
├── features/
│   ├── auth/         api.js, usecases.js (+ tests), hooks.js, components/LoginForm.jsx
│   ├── monitors/     api.js, usecases.js (+ tests), hooks.js,
│   │                 components/MonitorList|MonitorForm|MonitorDetailScreen.jsx
│   ├── incidents/    components/IncidentList.jsx (data via monitors hook)
│   └── reports/      components/ReliabilityTable|ReportsView.jsx
├── components/ui/    Dot, Spark, Stats (used by 2+ features)
├── hooks/            usePolling.js (shared primitive)
├── lib/              httpClient.js, tokenStore.js
├── utils/            formatDate.js (was inline-duplicated ×3)
├── styles/           index.css, tokens.css
└── main.jsx
e2e/                   Playwright suite — lives in pulse-qa repo
```

Backend + engine: [RakhaYandra/pulse](https://github.com/RakhaYandra/pulse).
