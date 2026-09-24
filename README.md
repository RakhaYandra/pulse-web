# Pulse Web — monitoring dashboard

> Ekosistem: [api](https://github.com/RakhaYandra/pulse) · [web](https://github.com/RakhaYandra/pulse-web)

React dashboard for Pulse: overview stats, monitor list/detail (SVG response-time
chart, recent checks, incident history), monitor CRUD + pause/resume. No router —
state-driven views; refreshes every 15s.

## Dev

```bash
npm install
npm run dev   # http://localhost:5173 (API default http://localhost:8080)
```

Point at another API: `VITE_API_URL=http://host:8080 npm run dev`.

## Prod

```bash
VITE_API_URL=http://api-host:8080 docker compose up -d --build  # :5173
```

Backend + engine: [RakhaYandra/pulse](https://github.com/RakhaYandra/pulse).
E2E (Playwright, lives in api repo `qa/e2e`): `BASE_URL=http://localhost:5173 npx playwright test`.

## Architecture

Full Clean Architecture ([ADR-001](docs/ADR-001-fe-ca.md)): `domain/` (entities +
pure stats, zero React/fetch) → `application/` (ports + use-cases, fake-tested)
→ `infrastructure/` (httpClient, apiGateway, tokenStore) → `presentation/`
(pure components + hooks). `App.jsx` wires everything (composition root).

```bash
npx vitest run   # 15 unit tests (domain + use-cases)
```
