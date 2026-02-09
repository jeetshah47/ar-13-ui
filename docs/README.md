## AR-13 UI Documentation Index

This folder centralizes the most important documentation for the AR-13 UI project and explains where to find more detailed guides.

### High-level guides (project root)

- `DEVELOPMENT_GUIDE.md` – Main architecture and development guide (project structure, patterns, best practices).
- `TESTING.md` – How to run unit/integration and E2E tests (Vitest + Playwright).
- `TEST_COVERAGE.md` – Summary of what is currently covered by tests.
- `E2E_TEST_SUMMARY.md` – High-level overview of the Playwright E2E suite.
- `ELECTRON_SETUP.md` – How to run and build the Electron desktop app.
- `FIX_VITE_EPERM_ERROR.md` – Troubleshooting Vite EPERM issues on Windows.
- `websocker-service.md` – WebSocket notification service design and usage.

### Testing-specific docs

- `e2e/README.md` – Detailed description of all Playwright E2E tests.
- `playwright.config.ts` – Playwright configuration (base URL, projects, web server).
- `src/test/` – Test utilities and setup for Vitest.

### API and integration rules

The `project-rules/` folder contains backend/frontend integration rules and API contracts:

- `project-rules/api/` – API contracts and behavior for major features (employees, calendar, tasks, permissions, SSE, websockets, etc.).
- `project-rules/integration/` – Integration guides for SSE, websocket clients, activity log, permissions, etc.
- `project-rules/authentication/` – Authentication-related flows (e.g. Google account linking).
- `project-rules/permissions/` – Role-based access management rules.
- `project-rules/routing/ROUTE_CHANGES.md` – Router and navigation rules.
- `project-rules/websocket-sse/` – WebSocket/SSE specific documentation.

### Where to look for deployment info

- Root `README.md` – Quick start, build, and deployment overview.
- `ELECTRON_SETUP.md` – Electron packaging and release instructions.
- `DEVELOPMENT_GUIDE.md` – Environment variables and high-level environment setup.

### Suggested reading order for new developers

1. `DEVELOPMENT_GUIDE.md`
2. Root `README.md`
3. `TESTING.md`
4. Relevant docs under `project-rules/` for the feature you are working on.








