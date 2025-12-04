## AR-13 UI – React + TypeScript + Vite

AR-13 UI is a project management and operations dashboard built with **React**, **TypeScript**, **Vite**, and **MUI**, with optional **Electron** packaging for desktop distribution.

For a deep dive into architecture and patterns, see `DEVELOPMENT_GUIDE.md`. For a curated index of all docs, see `docs/README.md`.

---

## Getting started

### Prerequisites

- **Node.js**: v18 or newer
- **npm**: bundled with Node (or another package manager if you prefer)

### Installation

```bash
npm install
```

### Development server

```bash
npm run dev
```

The app will run on `http://localhost:5173` by default (see `vite.config.ts` if you change this).

---

## Building for production (web)

### Create a production build

```bash
npm run build
```

This generates a static build in the `dist/` folder.

### Preview the production build locally

```bash
npm run preview
```

You can then deploy the contents of `dist/` to any static host (e.g. Nginx, S3 + CloudFront, Netlify, Vercel, etc.).

---

## Electron desktop app

Electron integration allows AR-13 UI to run as a desktop application.

- **Dev mode** (Electron + Vite dev server):

```bash
npm run electron:dev
```

- **Build desktop packages**:

```bash
# All platforms (from respective OS)
npm run electron:build

# Per-platform helpers (if configured)
npm run electron:build:win
npm run electron:build:mac
npm run electron:build:linux
```

See `ELECTRON_SETUP.md` for full details (structure, IPC, release artifacts).

---

## Testing

This project uses **Vitest** for unit/integration tests and **Playwright** for E2E tests.

### Unit / integration tests (Vitest)

```bash
npm run test          # watch mode
npm run test:run      # run once
npm run test:ui       # Vitest UI
npm run test:coverage # with coverage
```

### End-to-end tests (Playwright)

```bash
npm run test:e2e         # run all E2E tests
npm run test:e2e:ui      # Playwright UI
npm run test:e2e:headed  # headed browser
npm run test:e2e:debug   # debug mode
```

- `TESTING.md` – full testing guide.
- `TEST_COVERAGE.md` – what is currently covered.
- `E2E_TEST_SUMMARY.md` and `e2e/README.md` – detailed E2E suite overview.

---

## Documentation overview

- `DEVELOPMENT_GUIDE.md` – main development guide (architecture, patterns, state management, routing, WebSocket usage, etc.).
- `docs/README.md` – documentation index and pointers to all major guides.
- `project-rules/` – API contracts, integration notes, routing rules, and SSE/WebSocket documentation.
- `websocker-service.md` – WebSocket notification service (client & server behavior).
- `ELECTRON_SETUP.md` – Electron entry points and build configuration.
- `FIX_VITE_EPERM_ERROR.md` – Windows-specific Vite troubleshooting.

If you are preparing for deployment, start with:

1. This `README.md` (build + deployment overview)
2. `DEVELOPMENT_GUIDE.md` (architecture + environment setup)
3. `ELECTRON_SETUP.md` (if shipping a desktop build)
