@AGENTS.md

# Briddhi Uni

A learn-by-watching web app. Videos pause for quizzes, and learners earn XP, keep streaks and climb levels. The full brief is in `docs/BUILD_PROMPT.md`; the design system will live in `docs/DESIGN.md`. Read both before changing UI.

**Scope: free tier only.** Pro, payments and certificates are out of scope. Show them only as locked or teaser UI.

## Commands

- `npm run dev`: dev server on http://localhost:3000
- `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`: CI runs all four on every PR
- `npm test`: Vitest unit tests (engine, XP, levels, catalogue, every quiz bank); CI runs it too
- `npm run format`: apply Prettier (with Tailwind class sorting)
- `node scripts/record-hero.mjs [--dark] [--en]`: record the hero moment to `docs/screenshots/step-5/` (needs `npm run start -- -p 3100` and ffmpeg)

## Stack

Next.js (App Router, `src/` dir, `@/*` alias), TypeScript strict, Tailwind v4, ESLint + Prettier. This Next.js version is newer than most training data: check `node_modules/next/dist/docs/` before using an API.

## Repo and git rules

- All code lives in `github.com/arianadib/Briddhi-uni`. If `origin` is anything else, stop.
- Work on feature branches (`feat/...`), never directly on `main`. Commit in small, logical Conventional Commits (`feat:`, `fix:`, `style:`, `chore:`, `docs:`). Push after each working milestone and open a PR into `main` with screenshots.
- Never commit secrets, tokens, or admin phone numbers. `.env*` is ignored; only `.env.example` (placeholders) is tracked. If a secret is ever staged, stop and warn the owner.
- The build has approval gates (★ in `docs/BUILD_PROMPT.md` §12). Stop for approval at each one.

## Product rules

- Content order: Mutual Fund 101 (episode order 0–12, not the site's reversed order), then Investaloy, KOSH FAQ, Briddhir Kotha. Catalog source of truth: `content/catalog.json`.
- Learners see a video only if it is `published` AND has an approved quiz bank.
- **Shorts are skipped (owner decision, 30 Sep 2026).** Videos under 390s (`MIN_QUIZ_VIDEO_SECONDS` in `src/lib/quiz/rules.ts`) can't hold a bank under the pacing rules, so they get no quiz and don't appear in Uni. Today that is all of Mutual Fund 101, Investaloy and KOSH FAQ; Uni runs on the long Briddhir Kotha episodes.
- About 9 questions per video; exactly one is Free, the rest Pro.
- Free question: video dims, sheet springs up, no skip. One retry on a wrong answer. Show result, one-line explanation, XP flying to the header, then "Continue watching".
- Pro question: 3-second locked teaser (blurred, small Pro mark, countdown ring), then playback resumes. Never block playback.
- Show the Pro offer only at natural stops (episode complete, profile, locked perks), never mid-question.
- Bangla is the default language; an English toggle is available everywhere and switches instantly with no reload.
- Do not invent final quiz content. Sample banks are DRAFTS, clearly labelled as pending producer and Uni-lead review.
- XP: correct first try 10, after retry 5, finish video 50, daily streak bonus 5 × streak day (max 50), perfect video +25 (engine only, hidden on free).
- Levels: 1 Saver 0, 2 Learner 300, 3 Investor 900, 4 Portfolio Builder 2,000, 5 Market Pro 4,000.
- Leaderboard is weekly by XP, resetting Monday 00:00 Asia/Dhaka.
- Gamification rewards learning, never trading or returns.
- Sign-up: phone + OTP, name, optional university, "Where did you hear about us?". No NID, no email. The first screen after sign-up is a video.

## Compliance rules

- This disclaimer appears on every lesson page and on episode complete, quiet but legible: "Education only, not investment advice. Mutual fund investments are subject to market risk. Read the fund's documents before investing."
- Questions test a concept explained in the video, never a guest's opinion or prediction.
- No buy/sell calls, no specific stock or fund recommendations, no promise or implication of returns.
- Bangla and English versions must say the same thing.
- Interview-style episodes (Briddhir Kotha; KOSH halal, gold, fake-experts videos) are quizzed on principles only.
- Only `uni_lead` can approve, and approval requires the four-item compliance checklist. Every approval and publish is written to the audit log.
- Admin access is by phone allowlist in env, with roles `producer` and `uni_lead`.

## Design principles

Approved brand decisions (details in `docs/DESIGN.md`):

- **Fonts:** Neue Haas Grotesk for Latin, Anek Bangla for Bangla.
- **Colour meaning:** Briddhi Blue `#164C9E` is for actions; Briddhi Orange `#F6851F` is for rewards only.
- **Orange fills:** never put white text on orange (2.53:1). Text on an orange fill is dark ink.
- **Dark mode:** true black `#000`.

- Apple-level craft, Briddhi-branded. Fewer things, each one finished. Before shipping a screen, remove one thing.
- One hero moment: the video pausing and the question rising in. Spend boldness there; everything else stays quiet.
- Depth through hierarchy (type size, weight, spacing, subtle translucency), not ornament. Vary radius and elevation by importance.
- Motion answers the user: spring physics, 60fps, no ambient motion. Full `prefers-reduced-motion` support.
- Avoid template tells: identical rounded cards with the same grey shadow, decorative gradient washes, ALL-CAPS tracked eyebrow labels, `→` on every button, 01/02/03 on non-sequences, fade-and-slide-up on every section.
- Words are design: plain verbs, sentence case, one job per element. An action keeps the same name through the flow. Errors say what happened and how to fix it, never apologise. Empty states invite action.
- Touch-first: tap targets ≥ 44×44px, instant press states, swipe-to-dismiss sheets.
- Bangla must look as intentional as English; give it extra line-height so conjuncts never clip.
- Quality floor: WCAG AA contrast, visible keyboard focus, screen-reader labels on player and quiz, dark mode (true black), Lighthouse mobile ≥ 90 for performance and accessibility, smooth on a low-end Android on 3G. Every screen is tested at 360px.
