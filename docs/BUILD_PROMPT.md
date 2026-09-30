# Briddhi Uni: Free Tier Build Prompt for Claude Code

You are the design-obsessed lead engineer on Briddhi Uni. Build it the way Apple would ship a learning app: fewer things, each one finished. Every screen should feel inevitable, as if it could not have been designed any other way.

Briddhi Uni is a learn-by-watching web app. Videos pause for quizzes, and users earn XP, keep streaks and climb levels. You are building the FREE TIER only. Pro, payments and certificates are OUT of scope; show them only as locked or teaser UI.

---

## 0. Repo: all code lives here

- Project repo: **github.com/arianadib/Briddhi-uni** (owner: `arianadib`). Every line of Briddhi Uni code goes here.
- Run `git remote -v`. If origin is not `arianadib/Briddhi-uni`, stop and tell me.
- If the repo is empty, scaffold Next.js (App Router, TypeScript strict, Tailwind), ESLint, Prettier, and a GitHub Actions workflow that runs lint, typecheck and build on every PR.
- Security:
  - add a `.gitignore` covering `.env*`;
  - ship a `.env.example` with placeholder values only;
  - never commit real keys, tokens or admin phone numbers;
  - if you ever find a secret staged, stop and warn me.
- Git workflow: work on feature branches (start with `feat/free-tier`). Commit in small, logical steps using Conventional Commits (`feat:`, `fix:`, `style:`, `chore:`). Push after every working milestone and open a PR into `main` with screenshots of what changed.
- After scaffolding, run `/init` to create `CLAUDE.md`. Record the product rules, design principles and compliance rules from this prompt in it so every future session follows them.
- Save this prompt as `docs/BUILD_PROMPT.md` in the repo.

---

## 1. Design philosophy: Apple-level, Briddhi-branded

### The brand foundation
Uni must feel like a natural extension of **briddhi.net/learn-to-invest**, raised to a higher level of craft.

- **Extract the real tokens first.** Fetch `https://briddhi.net/learn-to-invest`, find the stylesheets under `/_next/static/css/`, and pull out the exact colours, font families, weights, radii and shadows. Download the logo from `https://briddhi.net/assets/img/briddhi-logo.png`.
- If fetching fails, use navy `#0F2A4A` and orange `#F5821F` as placeholders and mark them `TODO: confirm`.
- **Show me the extracted palette and type before designing anything.**

### The design plan (present this before any screen code)
Write a compact design system in `docs/DESIGN.md`:
- **Colour:** 4–6 named values built from the Briddhi navy and orange, plus semantic tokens (correct, incorrect, locked, streak, surface, text levels). Define light and dark themes, and use real black for dark mode rather than a tinted near-black.
- **Type:** one Latin family and one Bangla family that pair well. Bangla must look as intentional as English, not like a fallback. Evaluate Anek Bangla, Hind Siliguri and Noto Sans Bengali against the Latin face. Set a clear modular scale, tuned so Bangla conjuncts never clip (Bangla needs extra line-height).
- **Layout:** a spacing scale on a 4pt grid, a content width for reading, and ASCII wireframes of the three key screens (home, player, episode complete).
- **Motion:** a small set of named spring curves (e.g. `snappy`, `gentle`, `bouncy`) and their durations.
- **Principles:** 3–5 sentences on what makes Uni feel like Uni.

Then review the plan honestly. If any part looks like a generic AI or SaaS template, revise it and tell me what you changed and why. Specifically avoid:
- identical rounded cards with the same grey shadow everywhere;
- decorative gradient washes;
- ALL-CAPS tracked-out eyebrow labels above every heading;
- `→` appended to every button;
- 01/02/03 numbering on things that aren't sequences;
- fade-and-slide-up on every section as it scrolls in.

### What "Apple-level" means here
- **One hero moment.** Uni's signature interaction is the video pausing and the question rising in. Spend your boldness there:
  - the video gently dims and scales back;
  - the question sheet springs up from the bottom with real physics;
  - the answer feedback lands with a satisfying, precise animation;
  - XP counts up into the header.

  Everything else stays quiet and disciplined.
- **Clarity over decoration.** Remove anything that doesn't help someone learn. Before shipping each screen, take one thing away.
- **Depth through hierarchy, not ornament.** Use type size, weight, spacing and subtle translucency (backdrop blur on sheets and navigation) to show what matters. Vary radius and elevation by importance; don't give everything the same one.
- **Motion that answers the user.** Animate responses to actions (tap, answer, complete, level up) so they show what changed. Use spring physics (Framer Motion or Motion One), keep it at 60fps, and use no ambient motion that no one asked for.
- **Touch-first feel.** Tap targets at least 44×44px, instant press states, swipe to dismiss sheets, and pull-to-refresh on home. Use the `navigator.vibrate` haptic tick on correct answers and level-ups where supported, respecting reduced motion.
- **Moments of delight, used rarely:**
  - a level-up celebration;
  - a streak milestone flame (3, 7, 30 days);
  - a perfect first-try answer.

  Each should be short, earned and skippable.
- **Words are design.** Plain verbs, sentence case, and one job per element. Buttons say exactly what happens ("Continue watching", "Answer", "Share result"), and an action keeps the same name through the flow. Errors say what happened and how to fix it; they never apologise. Empty states invite action.
- **Quality floor (non-negotiable):**
  - WCAG AA contrast;
  - visible keyboard focus;
  - full `prefers-reduced-motion` support;
  - screen-reader labels on the player and quiz;
  - dark mode;
  - Lighthouse mobile ≥ 90 on performance and accessibility;
  - smooth on a low-end Android phone on 3G (test with throttling).

### Self-critique loop
After building each key screen, use Playwright to take screenshots at 360px, 390px and 1280px, in light and dark mode, in Bangla and English. Critique them against `docs/DESIGN.md`, fix what's off, and attach the final screenshots to the PR.

---

## 2. Content catalog

Create `content/catalog.json` with the four official series and seed the database from it. Store the real YouTube IDs, a category for each video, and a default learning order: Mutual Fund 101 first (the foundation), then Investaloy, KOSH FAQ, and Briddhir Kotha.

**Mutual Fund 101** (Briddhi × EDGE, category "Funds & ETFs", playlist `PLbR9GL5jrlAaHmJ-w-3wKdmQ2qJav-t3U`). Teach in episode order, not the site's reversed order:
0 `-SFJb1uzq8k` Series intro · 1 `aOIVLxjDe3Y` What is a mutual fund · 2 `0cWdKh2t5Jg` What is NAV · 3 `thM31u3IWHA` Open-ended & closed-ended funds · 4 `TseSLK3Egg0` SIP & lumpsum · 5 `UoK4UENaFxk` Taka cost averaging · 6 `qYOa75ZmOk0` Types of mutual funds · 7 `HLVkw2SFCE8` What is a custodian · 8 `HBSLi2amer4` What is a trustee · 9 `puB8rGCEM3s` Where mutual funds invest · 10 `Qx_fl-hHdJo` Expense ratio · 11 `Cv-G2EohcXQ` Why invest in mutual funds · 12 `gplKHtssPwY` When to start investing

**Investaloy** (Briddhi × Investaloy, "Funds & ETFs"):
1 `soeiaGkZwJw` Types of open-end funds and their risk profiles · 2 `j7V-XX3CuPQ` Which institutions manage open-end funds · 3 `RA4EVgBVSb0` Choosing an open-end fund · 4 `Mvkjrx13gH8` How to invest in open-end funds · 5 `s142p80obQ8` 1,000 টাকার Investment Formula

**KOSH FAQ** (Briddhi × KOSH, "Investments"):
1 `WpabttjsOts` The truth about alternative investments · 2 `7237XHUxGv4` Stop following fake investment experts · 3 `WzqX_TMrYas` Halal investment: what to check · 4 `ZaAQFtmok8s` The biggest beginner mistake

**Briddhir Kotha** (Briddhi × Ekush, "Market", playlist `PLbR9GL5jrlAZ3KwJWojBI4sqO23VLtuem`):
1 `IehmS7lBX3w` Alternative Investing 101: The Bangladesh Story · 2 `iXCqZ-RjVfo` Real Estate 101 ft. CPDL · 3 `Md96BqW436E` A Chairman's Take on Bangladesh · 4 `7P4xhQ31_LE` Mastering Personal Finance · 5 `f4wqenYhM9c` Investing in Bangladesh vs Canada · 6 `CV5M21wsBUc` Why your portfolio is missing bonds · 7 `lX509pCMcoA` Treasury bills & bonds · 8 `Bspi6hz9Dn0` Why is gold moving · 9 `bHgk09VRHF8` Why Bangladeshis don't invest

Each video has a `published` flag. Users see only videos that are published AND have an approved quiz bank.

Show partner co-branding ("Briddhi × EDGE") tastefully on each series. These partners are future sponsors, so their logos should look respected, not bolted on.

---

## 3. Video player

- Build a player abstraction with a **YouTube adapter** (YouTube IFrame Player API). Keep the interface generic so a **Bunny Stream adapter** (signed URLs, 360p/480p) can replace it later without touching the quiz logic.
- Use custom, minimal controls that match the design system, not YouTube chrome. Hide related videos as far as the API allows.
- Poll the current time and pause precisely at each pause point.
- If the user seeks past an unanswered FREE question, glide back to it.
- Show pause points as subtle ticks on the progress bar: answered, upcoming, or Pro-locked.
- Show a skeleton and poster frame while loading, with no layout shift.

---

## 4. Quiz experience (free tier)

- About 9 questions per video. Exactly ONE is Free; the rest are Pro.
- **FREE question:** this is the hero moment from section 1. The video dims, and the question sheet springs up. The user must answer; there is no skip. Show:
  - correct or incorrect, with a precise animation;
  - a one-line explanation;
  - the XP earned, flying into the header;
  - then "Continue watching".

  A wrong answer allows one retry.
- **PRO question:** a 3-second locked teaser (blurred question, a small Pro mark, a thin countdown ring), then playback resumes automatically. Never block playback. Keep it elegant, never nagging.
- **Episode complete:**
  - "You answered 1 of 9", XP earned and the streak day, with a calm, premium Pro benefits panel and a "Go Pro" button (leading to a beautiful "Coming soon" page);
  - a "Start on Briddhi" button linking to `https://briddhi.net/funds`;
  - a "Share result" button.
- Show the Pro offer ONLY at natural stops, never mid-question.
- Show this disclaimer on every lesson page and on episode complete, styled quietly but legibly: "Education only, not investment advice. Mutual fund investments are subject to market risk. Read the fund's documents before investing."
- Bangla is the default, with an English toggle everywhere. The toggle switches instantly, with no reload.

---

## 5. Quiz authoring (admin)

The admin area should feel like a pro tool (think Final Cut, not a spreadsheet), but it can be denser than the user app.

Route: `/admin`, restricted to an allowlist of phone numbers in env. There are two roles, `producer` and `uni_lead`.

- **Pause points:** pick a video, scrub the embedded player, and press "Add pause point here" (keyboard shortcut: `P`) to capture the timestamp.
- **Question fields**, in Bangla AND English: prompt, 2–4 options, correct option, one-line explanation. Also set the tier (Free/Pro) and a concept tag (e.g. NAV, SIP, expense ratio).
- **Live preview:** a phone frame showing exactly how the question will look to the user.
- **Validation:**
  - exactly 1 Free question per video;
  - warn if a video has fewer than 6 or more than 12 questions;
  - no pause point in the first 30 seconds;
  - at least 45 seconds between pause points;
  - every field filled in both languages.
- **Workflow:** Draft → In review → Approved → Published. Only `uni_lead` can approve, and approval requires ticking this compliance checklist:
  - [ ] Tests a concept explained in the video, not a guest's opinion or prediction
  - [ ] No buy/sell call and no specific stock or fund recommendation
  - [ ] No promise or implication of returns
  - [ ] Bangla and English say the same thing
- **Import/export** quiz banks as JSON, so banks can be drafted outside the app (e.g. with Claude, from transcripts) and bulk-uploaded as Drafts. Document the schema in the README.
- **Interview-style episodes** (Briddhir Kotha, and the KOSH videos on halal investing, gold and fake experts) cover principles only, never a guest's view on a market, asset or product.
- **Audit log:** record every approval and publish.

---

## 6. Seed quizzes

Do NOT invent final quiz content. Create DRAFT sample banks for Mutual Fund 101 Ep 1 and Ep 2 only, with placeholder timestamps, to exercise the full flow. Label them clearly as samples pending content-producer and Uni-lead review.

---

## 7. Sign-up

- Fields: phone number + OTP, name, optional university, and "Where did you hear about us?" (Facebook, Instagram, YouTube, TikTok, campus, friend, other). No NID and no email.
- Make it feel effortless:
  - the phone field auto-formats `+880`;
  - the OTP field has six boxes and supports autofill (`autocomplete="one-time-code"`);
  - it auto-submits on the last digit.
- Mock the OTP provider behind an interface so a real SMS gateway can be dropped in later.
- The first thing after sign-up is a video, not a form.

---

## 8. Gamification (reward learning, never trading or returns)

- **XP:** correct first try = 10, correct after retry = 5, finish a video = 50, daily streak bonus = 5 × streak day (max 50). The perfect-video bonus (+25) needs every question, so keep it in the engine but hide it on free.
- **Levels:** 1 Saver (0), 2 Learner (300), 3 Investor (900), 4 Portfolio Builder (2,000), 5 Market Pro (4,000). Show a refined progress ring to the next level. Level-gated unlocks show as locked Pro perks.
- **Streaks:** daily streaks with a flame that grows at milestones. No streak freeze on free; show it as a locked Pro perk.
- **Badges:** per video, per completed series, and per milestone. Design them as a cohesive icon set, not emoji.
- **Leaderboard:** weekly, by XP, resetting Monday 00:00 Asia/Dhaka. Show the user's own rank ("#14 of 1,240") pinned at the bottom.
- **Share cards:** designed like Apple's Activity or Spotify Wrapped. Bold, minimal, unmistakably Briddhi, sized for Facebook and Instagram Stories (1080×1920). Generate them server-side with `@vercel/og` or Satori.

---

## 9. Screens

1. **Landing:** one memorable hero in the spirit of "Investing, explained simply.", how it works, series, and a sign-up call to action. No stock-photo clichés.
2. **Sign-up / OTP**
3. **Home:** greeting, streak, level ring, "Continue watching", today's pause point, leaderboard snippet.
4. **Library:** series sections as on briddhi.net, with co-brand, description, video grid and progress per series.
5. **Lesson / player:** back link to all playlists, playlist sidebar (a sheet on mobile), series progress, player, title, Previous / Next.
6. **Episode complete**
7. **Leaderboard**
8. **Profile:** level, XP, badges, streak history, language and theme toggles.
9. **Go Pro:** a "Coming soon" page that makes people want it.
10. **Admin quiz builder**

All screens are mobile-first and must be tested at 360px width.

---

## 10. Data model

Propose the schema for your chosen ORM, covering:
- users (with a `tier` field);
- series, videos, pause_points;
- questions (with status, tier and concept tag), answers;
- xp_events, streaks, badges, weekly_leaderboard;
- admin audit logs.

---

## 11. Analytics

One `track()` helper that logs to the console for now. Events:
- `sign_up` (with source)
- `video_started`, `video_completed`
- `question_answered`
- `pro_teaser_shown`, `pro_offer_viewed`, `go_pro_clicked`
- `start_on_briddhi_clicked`
- `share_card_generated`
- `level_up`, `streak_milestone`

---

## 12. Order of work (stop for my approval at each ★)

1. ★ Repo check, scaffold, and `CLAUDE.md`.
2. ★ Extracted Briddhi tokens, plus `docs/DESIGN.md` with its self-review.
3. ★ Stack choices, routes, schema, and the list of what's mocked.
4. Component library and design tokens in code, with a `/design` page showing every component in light/dark and Bangla/English.
5. ★ The hero moment: player + quiz sheet + feedback animation. Send me a screen recording or GIF.
6. Remaining user screens, one PR per area.
7. Admin quiz builder.
8. ★ Polish pass: screenshots, a Lighthouse report, reduced-motion check, and a low-end device check.

## Definition of done

- The full free journey works locally: sign up → pick a series → watch → answer the free question → see the Pro teaser → finish → XP, streak, level and leaderboard update → share card.
- A producer can create a quiz bank in `/admin`, and a Uni lead can approve and publish it so it appears in the player.
- Bangla renders beautifully at 360px width, in light and dark mode.
- Lighthouse mobile scores ≥ 90 for performance and accessibility.
- The README covers setup, env vars, what's mocked, and the quiz JSON schema.
- All code is pushed to `arianadib/Briddhi-uni`, with PRs merged into `main`.
