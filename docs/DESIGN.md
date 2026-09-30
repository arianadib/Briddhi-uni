# Uni design system

Uni is Briddhi's learning app. It should feel like the calm, well-made room behind briddhi.net/learn-to-invest: the same orange and blue and the same warm ink, drawn with more care. This document is the contract every screen is checked against.

Source tokens were extracted from the briddhi.net stylesheets and logo on 29 Sep 2026 (see `docs/brand/specimen.html`).

---

## Principles

Uni teaches one idea at a time, so every screen has one job and one primary action. The video is the lesson; everything else steps back until the moment the video pauses and a question rises in, which is the one place Uni is allowed to be bold. Colour carries meaning, not mood: blue means "do this", orange means "you earned this", and nothing is coloured for decoration. Bangla is the first language, never a translation: it gets its own typeface, its own line-height and the same care as English. Motion only ever answers something the learner did.

---

## Colour

### Named colours

Six colours. Everything else is derived from them.

| Name               | Light     | Dark       | Role                                                                                                                             |
| ------------------ | --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Briddhi Blue**   | `#164C9E` | `#7FA8E8`  | Action. The one primary button per screen, links, focus ring, the video progress fill. Taken from the logo wordmark.             |
| **Briddhi Orange** | `#F6851F` | `#F6851F`  | Reward. XP, streak flame, level ring, "you did it" moments. Never used for actions and never carries white text.                 |
| **Ember**          | `#B9580A` | (not used) | Orange as _text_ on light backgrounds (4.71:1). In dark mode Briddhi Orange itself is the text colour (8.29:1).                  |
| **Ink**            | `#1B1918` | `#F5F4F2`  | Text. Warm, from the learn page, never pure black on white.                                                                      |
| **Paper / Night**  | `#FFFFFF` | `#000000`  | Base background. Dark mode is true black: OLED-friendly, and it lets orange glow.                                                |
| **Linen**          | `#FCF2E9` | `#1A140E`  | Celebration surface. Used only on episode complete, level-up and the share card. Its rarity is what makes it feel like a reward. |

### Semantic tokens

| Token         | Light                                  | Dark                               | Notes (contrast on base)                                                                   |
| ------------- | -------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `bg`          | `#FFFFFF`                              | `#000000`                          |                                                                                            |
| `surface`     | `#F6F4F1`                              | `#141414`                          | Grouped content, input fills. Warm grey in light mode, matching Ink.                       |
| `sheet`       | `rgb(255 255 255 / 0.92)` + blur 24px  | `rgb(28 28 30 / 0.88)` + blur 24px | Quiz sheet, nav bar, playlist sheet.                                                       |
| `line`        | `#EEEDEC`                              | `#262524`                          | Hairlines, 1px. From the learn page row dividers.                                          |
| `text-1`      | `#1B1918`                              | `#F5F4F2`                          | 17.5 / 19.1                                                                                |
| `text-2`      | `#5E5B57`                              | `#A8A5A0`                          | 6.75 / 8.55. Secondary copy.                                                               |
| `text-3`      | `#6F6C68`                              | `#8E8B86`                          | 5.22 / 6.19. Metadata. Still AA; nothing in Uni is too faint to read.                      |
| `action`      | `#164C9E`                              | `#7FA8E8`                          | 8.20 / 8.67                                                                                |
| `on-action`   | `#FFFFFF`                              | `#000000`                          | 8.20 / 8.67                                                                                |
| `reward`      | `#F6851F`                              | `#F6851F`                          | Fills and icons.                                                                           |
| `on-reward`   | `#1B1918`                              | `#000000`                          | 6.92 / 8.29. Text on an orange fill is always dark.                                        |
| `reward-text` | `#B9580A`                              | `#F6851F`                          | 4.71 / 8.29. On Linen, only at ≥ 24px (4.26:1 meets AA large).                             |
| `correct`     | `#16735B`                              | `#4CC38A`                          | 5.77 / 9.48. From the Briddhi footer's success green.                                      |
| `incorrect`   | `#C42B3C`                              | `#FF6B78`                          | 5.59 / 7.63. A crimson, deliberately far from orange so "wrong" never looks like "reward". |
| `locked`      | `text-3` + lock glyph                  | same                               | Locked is a _quiet_ state, not a coloured one.                                             |
| `streak`      | `reward`                               | `reward`                           | The flame is orange because a streak is earned.                                            |
| `pro`         | `text-1` on `surface`, hairline border | same                               | Pro is monochrome: premium through restraint, never a gold gradient.                       |
| `focus`       | 2px `action` ring, 2px offset          | same                               | Always visible on keyboard focus.                                                          |

State is never shown by colour alone: correct gets a check, incorrect a cross, locked a lock, each with a text label for screen readers.

---

## Type

### Families

| Script | Family                                                      | Loading                                                                                                                                                                                                                                                 |
| ------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Latin  | **Neue Haas Grotesk** (Text for ≤ 20px, Display for > 20px) | Commercial (Monotype). Self-hosted WOFF2 via `next/font/local` once the web licence files are in `src/fonts/`. **TODO: licence files.** Until then the stand-in is Inter, and the stack falls back to `"Helvetica Neue", Helvetica, Arial, sans-serif`. |
| Bangla | **Anek Bangla** (variable, weight 400–700)                  | `next/font/google`, `bengali` subset only, `display: swap`. Fallback: Noto Sans Bengali.                                                                                                                                                                |

One font stack serves both scripts: `"Neue Haas Grotesk", "Anek Bangla", …`. Latin runs render in Neue Haas Grotesk and Bangla glyphs fall through to Anek, so mixed lines ("NAV প্রতিদিন বদলায়") set correctly without markup.

Why Anek: its open, geometric Bangla matches the neutral grotesk in colour and x-height, and it ships as a single variable file (good on 3G). Hind Siliguri was rejected because its "১" reads as "৬" at UI sizes, which would make "১০ XP" read as "৬০ XP". Noto Sans Bengali is excellent but reads as a system face.

### Scale

A 1.25 modular scale from 16px, rounded to whole pixels. Line-heights are set per script: Bangla needs the extra room for conjuncts, matras and the reph.

| Token      | Size                | Weight | Line-height (Latin) | Line-height (Bangla) | Tracking (Latin only) | Use                                     |
| ---------- | ------------------- | ------ | ------------------- | -------------------- | --------------------- | --------------------------------------- |
| `display`  | 40 (32 below 600px) | 600    | 1.1                 | 1.35                 | −0.02em               | Landing hero, level-up                  |
| `title-1`  | 31 (28 below 600px) | 600    | 1.15                | 1.4                  | −0.015em              | Screen titles, question on desktop      |
| `title-2`  | 25                  | 600    | 1.2                 | 1.45                 | −0.01em               | Question prompt (mobile), section heads |
| `headline` | 20                  | 600    | 1.3                 | 1.55                 | 0                     | Video titles, sheet heads               |
| `body`     | 16                  | 400    | 1.5                 | 1.7                  | 0                     | Everything readable                     |
| `callout`  | 14                  | 500    | 1.45                | 1.65                 | 0                     | Answer explanations, metadata           |
| `footnote` | 13                  | 400    | 1.4                 | 1.6                  | 0                     | Disclaimer, timestamps                  |

Rules:

- **Never apply negative tracking to Bangla.** It collides conjuncts. Tracking tokens are applied with `:lang(en)` only.
- **The Bangla line-height applies to the element, not the run.** The layout switches via `:lang(bn)` on `<html>`, so toggling language reflows instantly with no reload.
- **Numbers follow the language.** Bangla UI shows Bangla digits (১০ XP, ৭ দিন) via `Intl.NumberFormat('bn-BD')`. Animated counters sit in a fixed-width box so digits don't jitter.
- **Weights:** 400, 500, 600 only. 700 is reserved for the XP number in the fly-up and the level-up display.
- **Measure:** body text is capped at 64ch (Latin) and 56ch (Bangla).

---

## Layout

### Spacing: 4pt grid

`space-1 4` · `space-2 8` · `space-3 12` · `space-4 16` · `space-5 20` · `space-6 24` · `space-8 32` · `space-10 40` · `space-12 48` · `space-16 64` · `space-20 80`

- Page gutter: 16px up to 389px wide, 20px from 390px, 32px from 768px.
- App shell max width: 1120px. Reading column: 640px.
- Groups are separated by space first, hairlines second, surfaces last. Most things need no box.
- Tap targets: at least 44 × 44px; primary buttons are 52px tall.

### Radius: by importance, not uniform

| Radius           | Where                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------- |
| 0                | The video on phones (full-bleed, edge to edge)                                         |
| 8                | Chips, inputs, small thumbnails                                                        |
| 12               | Buttons, answer options                                                                |
| 16               | Video thumbnails, the "Continue watching" block, the video on desktop                  |
| 28 (top corners) | The quiz sheet and playlist sheet: the most important surfaces get the softest corners |
| full             | Avatars, level ring, streak flame badge                                                |

### Elevation: three levels only

| Level | Treatment                                                                                 | Where                                                              |
| ----- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Flat  | No shadow. Separation by space or a hairline.                                             | Almost everything, including thumbnails and list rows              |
| Float | `sheet` translucency + blur, 1px hairline, no shadow                                      | Top nav, bottom tab bar                                            |
| Lift  | `sheet` + `0 -8px 40px rgb(0 0 0 / 0.18)` (light) / `0 -8px 40px rgb(0 0 0 / 0.6)` (dark) | The quiz sheet and the level-up card. Nothing else casts a shadow. |

### Key screens (360px)

Glyphs like 🔥 ◔ ✓ ☆ in these wireframes are placeholders. The real icons come from Uni's own icon set, never emoji.

**Home**

```
┌──────────────────────────────────┐
│ [Briddhi Uni]          বাং/EN (◔) │  float nav; (◔) = avatar
│                                  │
│ শুভ সকাল, রাফি                    │  title-1
│ 🔥 ৭ দিন   ◔ Learner · ১২০/৩০০ XP │  flame + level ring inline, callout
│                                  │
│ ┌──────────────────────────────┐ │
│ │  [video thumbnail 16:9]      │ │  the only surface on the screen
│ │  ▶︎ ━━━━━━━━──────── ৪:১২ বাকি│ │
│ │  NAV কী?                     │ │  headline
│ │  Mutual Fund 101 · পর্ব ২    │ │  callout text-2
│ │  [ Continue watching ]       │ │  primary (blue), full width
│ └──────────────────────────────┘ │
│                                  │
│ আজকের প্রশ্ন                       │  headline
│ ৩:৪০-এ একটি প্রশ্ন অপেক্ষা করছে     │  body text-2, taps into player
│ ──────────────────────────────── │
│ এই সপ্তাহ                  সব দেখুন │
│ ১  নাফিসা           ৪২০ XP       │  plain rows, hairlines
│ ২  তানভীর           ৩৯০ XP       │
│ ৩  সাদিয়া           ৩৭৫ XP       │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ #১৪  আপনি            ১২০ XP      │  own rank, pinned style
│                                  │
│ [হোম] [লাইব্রেরি] [র‍্যাঙ্ক] [প্রোফাইল] │  float tab bar
└──────────────────────────────────┘
```

**Player: free question (the hero moment)**

```
┌──────────────────────────────────┐
│ ‹ সব প্লেলিস্ট           ৮৫ XP ☆ │  float nav; XP counter is the fly-up target
│┌────────────────────────────────┐│
││   video, scaled to 0.94,       ││  dimmed to 45% brightness
││   paused                       ││
│└────────────────────────────────┘│
│╭────────────────────────────────╮│  sheet: lift, radius 28 top, blur
││            ───                 ││  grabber (disabled: no skip on free)
││ প্রশ্ন · ১০ XP                    ││  callout, reward-text
││ NAV বলতে কী বোঝায়?                ││  title-2
││ ┌────────────────────────────┐ ││
││ │ ক  প্রতি ইউনিটের বাজারমূল্য     │ ││  options: 12 radius, 56px tall
││ └────────────────────────────┘ ││
││ ┌────────────────────────────┐ ││
││ │ খ  ফান্ডের মোট লাভ           │ ││
││ └────────────────────────────┘ ││
││ ┌────────────────────────────┐ ││
││ │ গ  ...                      │ ││
││ └────────────────────────────┘ ││
││ [          Answer            ] ││  primary, enabled once an option is picked
│╰────────────────────────────────╯│
└──────────────────────────────────┘
after answering:
││ ✓ ঠিক উত্তর            +১০ XP ↗ ││  "+10" flies to the header counter
││ এক লাইনের ব্যাখ্যা।                ││  callout text-2
││ [     Continue watching      ] ││
```

**Episode complete**

```
┌──────────────────────────────────┐
│ ‹ সব প্লেলিস্ট                     │
│ ┌──────────── linen ───────────┐ │  the only linen surface in the flow
│ │        ✓ পর্ব শেষ             │ │
│ │          +৬০ XP              │ │  display, reward-text, count-up
│ │  ৯টির মধ্যে ১টির উত্তর দিয়েছেন   │ │  body
│ │  🔥 ৮ দিন  ◔ ১৮০/৩০০ XP       │ │
│ └──────────────────────────────┘ │
│ [       Share result          ]  │  primary (blue)
│ [       Next episode          ]  │  secondary (hairline)
│                                  │
│ Pro-তে যা পাবেন                    │  headline, calm panel, no box
│ • প্রতিটি প্রশ্ন, পর্বের বাকি ৮টি       │
│ • স্ট্রিক ফ্রিজ                      │
│ • সার্টিফিকেট                        │
│ [ Go Pro ]                       │  tertiary text button, blue
│ ──────────────────────────────── │
│ বিনিয়োগ শুরু করতে চান?               │
│ [ Start on Briddhi ↗ ]           │  external link, the only ↗ in the app
│                                  │
│ Education only, not investment   │  footnote, text-3
│ advice. Mutual fund investments… │
└──────────────────────────────────┘
```

---

## Motion

Framer Motion springs. Every animation answers a user action or a state change they caused. No ambient motion.

| Name     | Spring                              | Settles in            | Use                                                                 |
| -------- | ----------------------------------- | --------------------- | ------------------------------------------------------------------- |
| `snappy` | stiffness 500, damping 38, mass 1   | ~180ms, no overshoot  | Press states, toggles, tab switches, option selection               |
| `gentle` | stiffness 260, damping 32, mass 1   | ~380ms, no overshoot  | Sheets rising and dismissing, page transitions, video dim and scale |
| `bouncy` | stiffness 420, damping 20, mass 0.8 | ~480ms, ~6% overshoot | Answer feedback, XP landing in the header, level-up card            |

Press state: scale 0.97, instantly (`snappy`) on pointer down.

### The hero moment, choreographed

| t (ms)            | What happens                                                                                                                                               | Curve          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 0                 | Video reaches the pause point and pauses precisely                                                                                                         |                |
| 0–380             | Video scales to 0.94, brightness to 45%                                                                                                                    | `gentle`       |
| 60–440            | Sheet springs up from the bottom (starts after the dim, so the eye follows)                                                                                | `gentle`       |
| tap               | Option presses and takes a 2px `action` border                                                                                                             | `snappy`       |
| Answer            | Correct: option fills `correct`, check stroke draws in 220ms, 12ms haptic tick. Incorrect: option fills `incorrect` and nudges ±4px once, then "Try again" | `bouncy`       |
| +200              | "+10 XP" chip lifts off the option and flies on an arc to the header counter (≈600ms); the counter counts up over 400ms and pulses once                    | `bouncy`       |
| +300              | Explanation line appears (opacity only)                                                                                                                    | 160ms ease-out |
| Continue watching | Sheet drops, video returns to full scale and brightness, playback resumes                                                                                  | `gentle`       |

The Pro teaser uses the same sheet at half height, with the question blurred (12px), a small monochrome "Pro" mark and a 3s countdown ring drawn in `text-3`. The video dims only to 70%. It dismisses itself; a tap anywhere dismisses it early.

### Reduced motion

With `prefers-reduced-motion: reduce`:

- all springs become 120ms opacity crossfades;
- there is no scale, no fly and no nudge;
- XP updates in place;
- haptics stay off.

The information shown is identical.

### Delight, used rarely

- **Level-up:** a Linen card with the new level name in `display` and the ring completing once. About 1.2s total; tap to skip.
- **Streak milestone (3, 7, 30 days):** the flame grows a size step, once.
- **Perfect first try:** the check draws with a single orange spark.

No confetti.

---

## Voice

- Sentence case everywhere.
- Buttons name exactly what happens, and an action keeps the same name through the flow: "Answer", "Try again", "Continue watching", "Share result", "Go Pro", "Start on Briddhi".
- Errors say what happened and what to do: "That code has expired. Send a new code." They never apologise.
- Empty states invite action: "No streak yet. Watch one episode to start it."

---

## Self-review

I drafted the system, then read it back looking for template tells. Six things in the first draft looked generic. Here is what changed and why.

1. **Home was four identical cards** (streak, level, continue, leaderboard), each with the same radius and shadow. Now streak and level sit inline under the greeting as one line of text and glyphs. The leaderboard is plain rows with hairlines. Only "Continue watching" gets a surface, so the eye lands on the one thing to do.
2. **The landing hero borrowed briddhi.net's peach gradient wash.** Removed. Linen now appears flat, and only at reward moments, so it means something.
3. **Every thumbnail had a soft grey shadow.** Removed. Thumbnails are flat with a 16px radius; the quiz sheet and level-up card are the only things that cast a shadow. Elevation now signals importance.
4. **Series headers had "SERIES 01"-style eyebrows.** Replaced with the co-brand line in sentence case ("Briddhi × EDGE"). Numbers appear only where they are real sequences: episode numbers in Mutual Fund 101.
5. **The streak flame flickered on the home screen at all times.** Removed. That was ambient motion nobody asked for. The flame is still, and it animates only when a milestone is reached.
6. **Buttons were orange, like briddhi.net's.** That failed contrast (white on orange is 2.53:1) and blurred the two meanings. Now there is one blue primary per screen, and orange is reserved for what the learner earned.

The `↗` on "Start on Briddhi" is the one arrow in the app, kept because it tells you that you're leaving Uni.

## Open items

- **TODO: Neue Haas Grotesk.** Web licence and WOFF2 files for Text 400/500/600 and Display 600. Until they arrive, Inter stands in.
- **TODO: partner logos** (EDGE, Investaloy, KOSH, Ekush), in SVG, with each partner's usage rules.
