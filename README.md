# Briddhi Uni

Learn investing by watching. Videos pause for a quick question; you earn XP, keep a streak and climb levels. This repo is the free tier.

## Setup

Requires Node 22+.

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script                 | What it does                |
| ---------------------- | --------------------------- |
| `npm run dev`          | Start the dev server        |
| `npm run build`        | Production build            |
| `npm run lint`         | ESLint                      |
| `npm run typecheck`    | TypeScript, no emit         |
| `npm run format`       | Prettier write              |
| `npm run format:check` | Prettier check (runs in CI) |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, format check and build on every PR.

## Environment variables

See `.env.example`. Real values go in `.env.local`, which is never committed.

## Docs

- `docs/BUILD_PROMPT.md`: the product and build brief
- `docs/DESIGN.md`: the design system (coming in step 2)

Still to come: what's mocked, and the quiz bank JSON schema.
