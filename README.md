# project-default-taskflowapp

Generated and maintained by the AEGIS autonomous delivery platform.

## Running locally
```bash
npm install
npm run build   # transpiles src/ -> dist/ (esbuild)
npm start       # boots the service on PORT (default 3000); GET /health
```

## Application structure & module assembly
Each story is implemented as a self-contained module under
`src/modules/<story>/`. The entrypoint (`src/main.ts`) discovers and mounts them
dynamically at boot — there is no central wiring file to edit.

A module participates in the running service by exporting **one** of:
- `export function register(app)` — receives the shared app and mounts its own
  routes/middleware (preferred); or
- `export const router` — a router mounted at `/<story>`.

Export it from the module's `index.ts` (barrel). A module that conforms to
neither shape, or that throws while loading, is logged and skipped so one bad
module never stops the service from booting. See `src/main.ts` /
`src/moduleLoader.ts` for the full contract.

## Branching model
- `main` — production. Receives merges via PR only (tagged releases).
- `develop` — integration. Feature branches (`feature/STORY-{id}-…`) PR into here.

CI runs on every pull request (see `.github/workflows/pr-checks.yml`).
