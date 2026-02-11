# WebSpec

WebSpec is **Goal -> Proposals -> Verified Patch** for web-dev scoped automation.

You describe what you want in plain language (not routes/pages/components). WebSpec proposes valid implementation options, compiles them into a bounded plan, and generates a patch with verification before anything is applied.

## What is in this repo

- Studio UI (Next.js + shadcn/ui + Tailwind)
- `@webspec/core` package: proposer + compiler + patch generator + drift-risk scoring
- Local mode: points to a workspace directory on your machine
- Vercel demo mode: safe hosted demo using an embedded sandbox snapshot

## Quick start (local)

```bash
pnpm install
pnpm -C packages/core build
pnpm dev
```

Open `http://localhost:3000`.

## Local mode workspace

By default:

```bash
WEBSPEC_MODE=local
WEBSPEC_WORKSPACE_PATH=demo/sandbox-repo
```

To point at another workspace:

```bash
WEBSPEC_MODE=local WEBSPEC_WORKSPACE_PATH=/absolute/path/to/your/vite-app pnpm dev
```

This MVP expects a Vite-style router at `src/routes.tsx` containing WebSpec markers. The demo sandbox already includes markers.

## Vercel demo mode

If `WEBSPEC_MODE` is not set, WebSpec defaults to demo mode on Vercel.

Demo mode:

- never writes to disk
- uses an embedded sandbox snapshot
- returns a patch plus verification report

Deploy steps:

1. Import this GitHub repo into Vercel.
2. Optionally set `WEBSPEC_MODE=demo`.
3. Deploy.

## Agent workspace (`.ai/`)

This repo tracks `.ai/README.md` and `.ai/.gitkeep`. Everything else under `.ai/` is ignored and reserved for automation artifacts.

## License

MIT
