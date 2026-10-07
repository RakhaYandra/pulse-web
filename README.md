# Pulse Web — monitoring dashboard

> Ecosystem: [api](https://github.com/RakhaYandra/pulse) · [web](https://github.com/RakhaYandra/pulse-web) · [docs](https://github.com/RakhaYandra/pulse-docs/releases) · [data](https://github.com/RakhaYandra/pulse-data) · [qa](https://github.com/RakhaYandra/pulse-qa) · [ops](https://github.com/RakhaYandra/pulse-ops)

React dashboard for the Pulse monitoring API: sidebar command deck with
overview stats, fleet table (state badges, method + target, 24h uptime, last
checked, filter chips, search, CSV export), monitor detail with SVG
response-time chart, breach callout, recent checks, incident history
(click through to the monitor), per-monitor reliability reports with fleet
aggregates (uptime, MTTR, 7/30/90-day window), monitor create/edit in a
slide-over drawer + pause/resume/delete. React-router deep links
(`/monitors/:id`, `?tab/?page/?days`); data refreshes every 15s (24h uptime
once per mount + after mutations). Full Clean Architecture (see below).
Visual direction: `DESIGN.md` (Telemetry Command Deck, dark-first + verified
light, both AA).

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
npx vitest run          # 27 unit tests (domain + use-cases + hooks, fake gateways)
```

E2E lives in [`pulse-qa`](https://github.com/RakhaYandra/pulse-qa) (10 Playwright
tests, black-box, needs API + web up):

```bash
cd ../pulse-qa/e2e && npm install
BASE_URL=http://localhost:5173 npx playwright test
```

E2E registers throwaway users and drives the real UI; the API contract it
relies on lives in [`pulse-qa/collection.json`](https://github.com/RakhaYandra/pulse-qa/blob/main/collection.json) (Newman 22/22).

## Tooling (lint + format, side-by-side by design)

| Role | Lint | Format |
|---|---|---|
| Daily fast gate | `npm run lint:ox` (oxlint, ~0.05s) | `npm run format:oxcheck` (oxfmt, ~0.05s) |
| Compatibility backstop | `npm run lint` (ESLint, ~0.9s) | `npm run format:check` (Prettier, ~0.5s) |

Measured on this repo (2026-09-29): oxlint 0.054s vs ESLint 0.925s
(~17x); oxfmt 0.003s vs Prettier 0.527s (~175x), zero format diff between
them. oxlint config (`.oxlintrc.json`) covers the 4 ESLint rules except
`react/jsx-uses-vars`, which oxlint handles natively (no such rule); it also
caught one real issue ESLint missed (`unicorn/no-useless-fallback-in-spread`
in `httpClient.js`, fixed).

## Architecture

Full Clean Architecture ([ADR-001-fe-ca](https://github.com/RakhaYandra/pulse-docs/blob/main/ADR-001-fe-ca.md)):

```
domain/          entities + pure stats — zero React/fetch
features/{auth,monitors,incidents,reports}/
                 per-feature api (endpoint + JSON→domain mapping),
                 use-cases (constructor-injected, fake-tested),
                 hooks + components colocated
components/ui/   shared presentational primitives (Dot, Spark, Stats,
                  Sidebar, Drawer)
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
no CSS Modules — deliberate at this size (single stylesheet, no class
collisions); revisit if component count doubles. Create/edit share one
`MonitorForm` rendered in the drawer (create) or edit mode (`PATCH`).

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
