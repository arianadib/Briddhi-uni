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

| Script                 | What it does                   |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Start the dev server           |
| `npm run build`        | Production build               |
| `npm run lint`         | ESLint                         |
| `npm run typecheck`    | TypeScript, no emit            |
| `npm run format`       | Prettier write                 |
| `npm run format:check` | Prettier check (runs in CI)    |
| `npm test`             | Vitest unit tests (runs in CI) |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, format check and build on every PR.

## Environment variables

See `.env.example`. Real values go in `.env.local`, which is never committed.

## Docs

- `docs/BUILD_PROMPT.md`: the product and build brief
- `docs/DESIGN.md`: the design system
- `docs/ARCHITECTURE.md`: stack, routes, schema and deployment

## Quiz bank JSON

Quiz banks can be drafted outside the app (for example with Claude, from a transcript) and imported as drafts. One file per video; the schema lives in `src/lib/quiz/bank.ts` and the samples are in `content/quiz-banks/`.

```jsonc
{
  "videoId": "bk-07-treasury-bills-and-bonds", // an id from content/catalog.json
  "status": "draft", // draft | in_review | approved | published (imports always land as draft)
  "isSample": false,
  "pausePoints": [
    {
      "id": "bk07-p1",
      "atSeconds": 240,
      "question": {
        "tier": "free", // exactly one free question per video; the rest are "pro"
        "conceptTag": "treasury bill",
        "promptBn": "…",
        "promptEn": "…",
        "options": [{ "bn": "…", "en": "…" }], // 2–4 options
        "correctIndex": 1,
        "explanationBn": "…", // one line
        "explanationEn": "…",
      },
    },
  ],
}
```

Validation (shared by the builder, the import and approval):

- exactly 1 free question;
- a warning outside 6–12 questions;
- no pause point in the first 30 seconds;
- at least 45 seconds between pause points;
- every field filled in both languages.

## What's mocked

- **Progress:** XP, answers and resume position are stored in the browser (`src/lib/progress/store.ts`) until the database and sign-in land.
- **Quiz banks:** read from `content/quiz-banks/`. Draft samples show only locally and on preview deploys.
- **Analytics:** `track()` logs to the console.
- **Video:** YouTube only. The `PlayerAdapter` interface is ready for Bunny Stream.
- **Shorts:** videos under 390 seconds get no quiz and are skipped for now.
