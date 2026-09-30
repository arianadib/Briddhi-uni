# Uni architecture (step 3 proposal)

Status: **proposal, awaiting approval (★ step 3)**. Nothing here is built yet.

## Stack

| Concern     | Choice                                                                                                                                                           | Why                                                                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router), React 19, TypeScript strict                                                                                                             | Already scaffolded. Server Components keep the JS sent to phones small, which matters on 3G.                                                       |
| Hosting     | **Vercel**, functions in `sin1` (Singapore)                                                                                                                      | Built for Next.js, with a preview URL on every PR. Singapore is the closest region to Dhaka.                                                       |
| Database    | **Postgres on Neon** (`ap-southeast-1`, Singapore)                                                                                                               | Serverless Postgres with a free tier to start, and a database branch per preview deploy.                                                           |
| ORM         | **Drizzle**                                                                                                                                                      | Thin and SQL-shaped, with fast cold starts on serverless and typed schema and migrations in TypeScript. We don't need Prisma's query engine.       |
| Validation  | Zod                                                                                                                                                              | One schema validates forms, server actions and the quiz-bank JSON import.                                                                          |
| Auth        | Phone + OTP, our own small module: sessions table + httpOnly signed cookie (`jose`)                                                                              | Auth.js is built around email and OAuth; phone OTP is simpler and clearer to own.                                                                  |
| OTP / SMS   | `OtpProvider` interface. `MockOtpProvider` now; a Bangladeshi SMS gateway (e.g. SSL Wireless, BulkSMSBD) or Twilio Verify later                                  | The brief asks for a mock behind an interface. Codes are hashed, expire in 5 min, allow 5 attempts, and resends are rate-limited per phone and IP. |
| Motion      | `motion` (Framer Motion)                                                                                                                                         | Spring physics, gestures (swipe-to-dismiss) and `useReducedMotion`.                                                                                |
| i18n        | Our own dictionaries (`bn.ts`, `en.ts`) + React context; language in a cookie                                                                                    | Instant switching with no reload and no `/bn/...` URLs. The server reads the cookie, so the first paint is already in the right language.          |
| Icons       | `lucide-react` for UI (briddhi.net uses Lucide too); a custom SVG set for badges                                                                                 | Consistent with the parent site; badges get their own cohesive set, never emoji.                                                                   |
| Share cards | `ImageResponse` from `next/og` (Satori), 1080×1920                                                                                                               | Built into Next, rendered server-side with Anek Bangla + Inter.                                                                                    |
| Video       | `PlayerAdapter` interface: `YouTubeAdapter` now, `BunnyAdapter` later                                                                                            | See Video hosting below.                                                                                                                           |
| Tests       | Vitest for the XP, streak, level and leaderboard engines and the quiz validation; Playwright for e2e and the 360/390/1280 × light/dark × bn/en screenshot matrix | The screenshot matrix is the self-critique loop from the brief.                                                                                    |
| Analytics   | `track()` helper that logs to the console                                                                                                                        | As specified; swappable later.                                                                                                                     |

## Video hosting

- **Now: YouTube.** All 31 catalogue videos are already public on YouTube, and the IFrame Player API gives what the quiz needs: current time polling, precise pause, seek, custom controls.
- **Later: Bunny Stream.** Encoded to 360p/480p HLS, with signed URLs, no related videos and no YouTube branding. Very cheap per GB delivered.
- **Google Drive is the source of masters, not a host.** The shared "podcasts" folder holds the Briddhir Kotha masters (1080p, mostly 4–7 GB each, about 70 GB). Drive's embed has no player API (no time, no pause, no custom controls), and Drive throttles files with heavy traffic. The right path: upload these masters to Bunny when the Bunny adapter lands, and swap `provider` from `youtube` to `bunny` per video. The quiz logic doesn't change.
- **Catalogue gap:** Drive has episodes not in the brief's catalogue:
  - Ep 6 "How to start budgeting your income"
  - Ep 6.1 "Is the dominance of US dollar coming to an end"
  - Ep 10 "Inside Edge AMC | CEO on wealth creation & fixed income fund investing"
  - Ep 11 "Savings vs investing in Bangladesh: a regulator's take"
  - Ep 5.1

  They need YouTube IDs (or Bunny) and a decision on whether they join the catalogue.

The adapter interface:

```ts
interface PlayerAdapter {
  load(
    el: HTMLElement,
    source: { provider: "youtube" | "bunny"; id: string; posterUrl?: string },
  ): Promise<void>;
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  getCurrentTime(): number; // polled every animation frame while playing
  getDuration(): number;
  on(
    event: "ready" | "play" | "pause" | "ended" | "buffering" | "error",
    fn: () => void,
  ): () => void;
  destroy(): void;
}
```

The quiz engine only talks to this interface.

## Routes

| Route                              | Access               | Purpose                                                                                     |
| ---------------------------------- | -------------------- | ------------------------------------------------------------------------------------------- |
| `/`                                | public               | Landing. Signed-in users are redirected to `/home`.                                         |
| `/signup`                          | public               | Phone number (`+880` auto-format)                                                           |
| `/signup/verify`                   | public               | Six-box OTP, `autocomplete="one-time-code"`, auto-submits                                   |
| `/signup/about`                    | new user             | Name, university (optional), "Where did you hear about us?". Then straight into a video.    |
| `/home`                            | user                 | Greeting, streak, level ring, "Continue watching", today's pause point, leaderboard snippet |
| `/library`                         | user                 | Series sections with co-brand, description, grid, progress                                  |
| `/learn/[series]/[video]`          | user                 | Lesson and player, playlist sidebar or sheet, Previous / Next, disclaimer                   |
| `/learn/[series]/[video]/complete` | user                 | Episode complete                                                                            |
| `/leaderboard`                     | user                 | Weekly XP, own rank pinned                                                                  |
| `/profile`                         | user                 | Level, XP, badges, streak history, language and theme                                       |
| `/go-pro`                          | public               | "Coming soon"                                                                               |
| `/share/[id]`                      | public               | Shareable result page; its `opengraph-image` is the 1080×1920 card                          |
| `/design`                          | dev and preview only | Every component in light/dark × bn/en                                                       |
| `/admin`                           | allowlist            | Videos and their bank status                                                                |
| `/admin/videos/[id]`               | allowlist            | Quiz builder: scrub, `P` for pause point, bilingual fields, phone preview, validation       |
| `/admin/review`                    | `uni_lead`           | Queue of banks in review; approve with the compliance checklist; publish                    |
| `/admin/audit`                     | allowlist            | Audit log                                                                                   |
| `/admin/import`                    | allowlist            | Import and export quiz banks as JSON (imports land as Draft)                                |

Route protection lives in `src/proxy.ts` (Next 16's replacement for `middleware`): it checks the session cookie and redirects. Role checks are repeated inside each admin server action; the proxy is never the only guard.

Mutations are server actions: `requestOtp`, `verifyOtp`, `saveProfile`, `answerQuestion`, `saveProgress`, `completeVideo`, `setPreferences`, and the admin actions. The only route handlers are the share image and the quiz-bank JSON export download.

## Data model (Drizzle, Postgres)

XP awards are **idempotent**: every award has a unique `(user_id, kind, ref_id)`, so a double tap or a retried request can never award twice. Scoring happens on the server; the client only sends "user chose option 2 on question X".

```ts
// enums
tier            = pgEnum("tier", ["free", "pro"]);
locale          = pgEnum("locale", ["bn", "en"]);
theme           = pgEnum("theme", ["system", "light", "dark"]);
heardFrom       = pgEnum("heard_from", ["facebook", "instagram", "youtube", "tiktok", "campus", "friend", "other"]);
videoProvider   = pgEnum("video_provider", ["youtube", "bunny"]);
questionTier    = pgEnum("question_tier", ["free", "pro"]);
bankStatus      = pgEnum("bank_status", ["draft", "in_review", "approved", "published"]);
xpKind          = pgEnum("xp_kind", ["answer_first_try", "answer_retry", "video_complete", "streak_bonus", "perfect_video"]);
badgeKind       = pgEnum("badge_kind", ["video", "series", "milestone"]);
auditAction     = pgEnum("audit_action", ["submit", "return_to_draft", "approve", "publish", "unpublish", "import"]);

users            { id uuid pk, phone text unique (E.164), name text, university text?, heard_from heardFrom,
                   tier tier default 'free', locale locale default 'bn', theme theme default 'system',
                   total_xp int default 0, created_at }
sessions         { id text pk (random 32B), user_id → users, expires_at, created_at }
otp_requests     { id uuid pk, phone text, code_hash text, expires_at, attempts int default 0,
                   consumed_at?, ip text, created_at }                      -- index (phone, created_at)

series           { id text pk (slug), title_bn, title_en, description_bn, description_en,
                   partner_name, partner_logo?, category text, youtube_playlist_id?, sort_order int }
videos           { id uuid pk, series_id → series, episode_number real,   -- real allows 5.1, 6.1
                   title_bn, title_en, category text, provider videoProvider, provider_video_id text,
                   duration_s int?, published bool default false, sort_order int }
quiz_banks       { id uuid pk, video_id → videos unique, status bankStatus default 'draft',
                   is_sample bool default false, submitted_by?, approved_by?, approved_at?,
                   published_at?, compliance jsonb?, updated_at }         -- compliance = the 4 ticked items
pause_points     { id uuid pk, bank_id → quiz_banks, at_seconds real }    -- unique (bank_id, at_seconds)
questions        { id uuid pk, pause_point_id → pause_points unique, tier questionTier, concept_tag text,
                   prompt_bn, prompt_en, options jsonb [{bn,en}] (2–4), correct_index smallint,
                   explanation_bn, explanation_en }

answers          { id uuid pk, user_id, question_id, attempt smallint (1|2), selected_index smallint,
                   correct bool, created_at }                             -- unique (user_id, question_id, attempt)
video_progress   { user_id, video_id, position_s real, completed_at?, updated_at }  -- pk (user_id, video_id)
xp_events        { id uuid pk, user_id, kind xpKind, amount int, ref_id text, week_start date, created_at }
                                                                           -- unique (user_id, kind, ref_id)
streaks          { user_id pk, current int, longest int, last_active_date date }   -- dates are Asia/Dhaka
streak_days      { user_id, date }                                         -- pk; powers profile history
badges           { id text pk (slug), kind badgeKind, ref_id text?, name_bn, name_en, icon text }
user_badges      { user_id, badge_id, earned_at }                          -- pk (user_id, badge_id)
weekly_leaderboard { week_start date, user_id, xp int }                    -- pk (week_start, user_id)
share_results    { id text pk (short), user_id, video_id, payload jsonb, created_at }
admin_audit_log  { id uuid pk, actor_phone text, actor_role text, action auditAction,
                   target_type text, target_id text, details jsonb, created_at }
```

Notes:

- **Admin roles are not in the database.** They come from `ADMIN_PRODUCER_PHONES` and `ADMIN_UNI_LEAD_PHONES` at request time, so removing someone is an env change. The audit log records the phone and role at the time of the action.
- **Visibility:** a learner sees a video when `videos.published = true` AND its bank's status is `published`. (The brief says "approved quiz bank"; "published" is the final state after approval, so this is the same rule, with the last step taken by `uni_lead`.)
- **Weeks** start Monday 00:00 Asia/Dhaka. Bangladesh is UTC+6 with no daylight saving, so `week_start` is computed in code and the leaderboard is a primary-key lookup, with no cron job to reset it.
- **Level** is derived from `total_xp`; it is not stored.
- **Validation rules** (exactly 1 free, 6–12 warning, nothing in the first 30s, 45s spacing, all fields in both languages) live in one Zod-backed function shared by the builder UI, the import and the approve action.

## What's mocked or deferred

| Item                                       | State                                                                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| SMS delivery                               | `MockOtpProvider`: the code is written to the server console. In development only, the verify screen also shows it.                 |
| Pro, payments, certificates                | Locked UI and the "Coming soon" page only                                                                                           |
| Bunny Stream                               | Interface only; YouTube serves all video                                                                                            |
| Analytics                                  | `track()` logs to the console                                                                                                       |
| Other learners on the leaderboard          | A dev-only seed script creates clearly fake learners; it never runs in production                                                   |
| Quiz content                               | Two DRAFT sample banks (Mutual Fund 101 Ep 1 and 2), `is_sample = true`, labelled in the UI as pending producer and Uni-lead review |
| Neue Haas Grotesk                          | Inter stands in until licensed files arrive                                                                                         |
| Partner logos                              | Text wordmarks until SVGs arrive                                                                                                    |
| Streak freeze, perfect-video bonus display | In the engine, shown as locked Pro perks                                                                                            |

## Deployment

1. **Neon:** create a project in `ap-southeast-1` and copy the pooled connection string.
2. **Vercel:** import `arianadib/Briddhi-uni`.
   - Framework: Next.js; function region: `sin1`.
   - Add the env vars from `.env.example` for Production and Preview.
   - Install the Neon integration so each preview gets its own database branch.
3. **Migrations:** `npm run db:migrate` runs in the Vercel build step before `next build`. Drizzle migrations are committed SQL files, reviewed in PRs.
4. **Domain:** add e.g. `uni.briddhi.net` in Vercel and create the CNAME at Briddhi's DNS.
5. **Every PR** then gets a preview URL (with its own database branch), and merging to `main` deploys production.

Cost to start:

- Neon: free tier.
- Vercel: the Hobby plan is for non-commercial use only. Briddhi is a business, so production should be on Pro ($20 per member per month).
- SMS: pay per message once a real gateway is connected.
