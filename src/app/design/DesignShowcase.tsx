"use client";

import { useCallback, useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LanguageToggle, ThemeToggle } from "@/components/ui/PreferenceToggles";
import { TextField } from "@/components/ui/TextField";
import { PhoneField } from "@/components/ui/PhoneField";
import { OtpField } from "@/components/ui/OtpField";
import { AnswerOption, type AnswerState } from "@/components/ui/AnswerOption";
import { Sheet } from "@/components/ui/Sheet";
import { CountdownRing } from "@/components/ui/CountdownRing";
import {
  LevelRing,
  LockedPerk,
  ProMark,
  StreakFlame,
  XpChip,
  XpCounter,
} from "@/components/ui/Rewards";
import { Scrubber } from "@/components/ui/Scrubber";
import {
  Disclaimer,
  LeaderboardRow,
  SeriesHeader,
  Skeleton,
  VideoCard,
} from "@/components/ui/Content";
import { BadgeIcon } from "@/components/ui/Badge";
import { NavBar, TabBar } from "@/components/ui/Navigation";
import { Bi, useLocale, useT } from "@/lib/preferences/PreferencesProvider";
import { optionLetters } from "@/lib/i18n/locales";
import { isValidBdMobile } from "@/lib/digits";
import { springs } from "@/lib/motion";
import { hapticTick } from "@/lib/haptics";
import { cn } from "@/lib/cn";

/*
 * The /design page: every Uni component, rendered side by side in light and
 * dark. The language and theme toggles at the top are the real ones.
 * The question in the demos is SAMPLE copy for layout only, not quiz content.
 */

const sampleOptions = [
  { bn: "প্রতি ইউনিটের বাজারমূল্য", en: "The value of one unit of the fund" },
  { bn: "ফান্ডের মোট লাভ", en: "The fund's total profit" },
  { bn: "ফান্ড ম্যানেজারের ফি", en: "The fund manager's fee" },
];
const sampleCorrect = 0;

export function DesignShowcase() {
  return (
    <div className="bg-bg min-h-dvh">
      <header className="border-line translucent sticky top-0 z-40 border-b">
        <div className="gutter mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 py-3">
          <h1 className="type-headline text-text-1 mr-auto" lang="en">
            Uni components
          </h1>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="gutter mx-auto flex max-w-[1280px] flex-col gap-16 py-10">
        <p className="type-body measure text-text-2" lang="en">
          Every component in light and dark. Switch the language above to check Bangla and English.
          The question text below is sample copy for layout, not quiz content. Source:{" "}
          <code className="text-[14px]">docs/DESIGN.md</code>.
        </p>

        <Section title="Colour">
          <Swatches />
        </Section>
        <Section title="Type">
          <TypeScale />
        </Section>
        <Section title="Buttons">
          <Buttons />
        </Section>
        <Section title="Fields">
          <Fields />
        </Section>
        <Section title="Answer options">
          <AnswerStates />
        </Section>
        <Section title="The hero moment: question sheet and Pro teaser" single>
          <HeroDemo />
        </Section>
        <Section title="Rewards">
          <Rewards />
        </Section>
        <Section title="Scrubber">
          <ScrubberDemo />
        </Section>
        <Section title="Content">
          <ContentDemo />
        </Section>
        <Section title="Badges">
          <Badges />
        </Section>
        <Section title="Pro perks">
          <Perks />
        </Section>
        <Section title="Navigation">
          <NavigationDemo />
        </Section>
        <Section title="Motion" single>
          <MotionDemo />
        </Section>
      </main>
    </div>
  );
}

/** Renders its children twice: once in a light panel, once in a dark one. */
function Section({
  title,
  single,
  children,
}: {
  title: string;
  single?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="type-title-2 text-text-1" lang="en">
        {title}
      </h2>
      {single ? (
        <div className="rounded-media border-line border p-4 sm:p-6">{children}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {(["light", "dark"] as const).map((theme) => (
            <div
              key={theme}
              data-theme={theme}
              className="rounded-media border-line bg-bg text-text-1 min-w-0 border p-4 sm:p-6"
            >
              <p className="type-footnote text-text-3 mb-4" lang="en">
                {theme === "light" ? "Light" : "Dark"}
              </p>
              {children}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Swatches() {
  const tokens = [
    "bg",
    "surface",
    "line",
    "text-1",
    "text-2",
    "text-3",
    "action",
    "reward",
    "reward-text",
    "linen",
    "correct",
    "incorrect",
  ];
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {tokens.map((token) => (
        <div key={token} className="flex flex-col gap-1.5">
          <div
            className="rounded-chip border-line h-12 border"
            style={{ background: `var(--${token})` }}
          />
          <code className="type-footnote text-text-2">{token}</code>
        </div>
      ))}
    </div>
  );
}

function TypeScale() {
  const rows: Array<[string, string]> = [
    ["type-display", "Investing, explained simply."],
    ["type-title-1", "Mutual Fund 101"],
    ["type-title-2", "What is NAV?"],
    ["type-headline", "Continue watching"],
    ["type-body", "A mutual fund pools money from many investors."],
    ["type-callout", "Question 3 of 9"],
    ["type-footnote", "Education only, not investment advice."],
  ];
  const bn = [
    "বিনিয়োগ, সহজ করে বোঝানো।",
    "মিউচুয়াল ফান্ড ১০১",
    "NAV কী?",
    "দেখা চালিয়ে যান",
    "মিউচুয়াল ফান্ড অনেক বিনিয়োগকারীর টাকা একসাথে করে।",
    "৯টির মধ্যে প্রশ্ন ৩",
    "শুধু শিক্ষার উদ্দেশ্যে, বিনিয়োগ পরামর্শ নয়।",
  ];
  return (
    <div className="flex flex-col gap-3">
      {rows.map(([cls, en], i) => (
        <div key={cls} className="flex flex-col">
          <code className="type-footnote text-text-3">{cls}</code>
          <span className={cn(cls, "text-text-1")}>
            <Bi bn={bn[i]} en={en} />
          </span>
        </div>
      ))}
      <p className="type-body text-text-1" lang="bn">
        ক্ষ ঙ্ক ন্ত্র স্ট্র্যা ক্স জ্ঞ ষ্ণ দ্ধি (conjunct check)
      </p>
    </div>
  );
}

function Buttons() {
  const t = useT();
  return (
    <div className="flex flex-col gap-3">
      <Button fullWidth>{t("action.continueWatching")}</Button>
      <Button variant="secondary" fullWidth>
        {t("action.nextEpisode")}
      </Button>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="tertiary" size="md">
          {t("action.goPro")}
        </Button>
        <Button size="md" loading>
          {t("action.sendCode")}
        </Button>
        <Button size="md" disabled>
          {t("action.answer")}
        </Button>
      </div>
      <ButtonLink href="https://briddhi.net/funds" external variant="secondary">
        {t("action.startOnBriddhi")}
      </ButtonLink>
    </div>
  );
}

function Fields() {
  const t = useT();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const phoneError =
    phone.length === 10 && !isValidBdMobile(phone) ? t("field.phone.invalid") : undefined;
  return (
    <div className="flex flex-col gap-5">
      <TextField label={t("field.name")} autoComplete="name" />
      <PhoneField
        label={t("field.phone")}
        hint={t("field.phone.hint")}
        error={phoneError}
        value={phone}
        onChange={setPhone}
      />
      <OtpField
        label={t("field.otp")}
        hint={submitted ? `✓ ${submitted}` : t("field.otp.hint", { phone: "+880 1712-345678" })}
        value={code}
        onChange={(v) => {
          setCode(v);
          setSubmitted(null);
        }}
        onComplete={setSubmitted}
      />
      <TextField
        label={t("field.university")}
        error={t("field.phone.invalid")}
        defaultValue="0171"
      />
    </div>
  );
}

function AnswerStates() {
  const locale = useLocale();
  const states: AnswerState[] = ["idle", "selected", "correct", "incorrect", "dimmed"];
  return (
    <div role="radiogroup" aria-label="Answer states" className="flex flex-col gap-2">
      {states.map((state, i) => (
        <AnswerOption key={state} letter={optionLetters[locale][i % 4]} state={state}>
          <Bi bn={sampleOptions[i % 3].bn} en={sampleOptions[i % 3].en} />
          <span className="ml-2 font-normal opacity-60" lang="en">
            ({state})
          </span>
        </AnswerOption>
      ))}
    </div>
  );
}

type Phase = "watching" | "asking" | "correct" | "incorrect" | "revealed" | "teaser";

/** A phone-sized stage that plays the free question and the Pro teaser. */
function HeroDemo() {
  const t = useT();
  const locale = useLocale();
  const titleId = useId();
  const [phase, setPhase] = useState<Phase>("watching");
  const [selected, setSelected] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(1);
  const [xp, setXp] = useState(85);
  const [flying, setFlying] = useState<number | null>(null);

  const questionOpen =
    phase === "asking" || phase === "correct" || phase === "incorrect" || phase === "revealed";
  const dimmed = questionOpen || phase === "teaser";
  const endTeaser = useCallback(() => setPhase("watching"), []);

  function answer() {
    if (selected === null) return;
    if (selected === sampleCorrect) {
      const earned = attempt === 1 ? 10 : 5;
      setPhase("correct");
      hapticTick();
      setFlying(earned);
      window.setTimeout(() => {
        setXp((v) => v + earned);
        setFlying(null);
      }, 650);
    } else if (attempt === 1) {
      setPhase("incorrect");
    } else {
      setPhase("revealed");
    }
  }

  function optionState(i: number): AnswerState {
    if (phase === "correct") return i === sampleCorrect ? "correct" : "dimmed";
    if (phase === "revealed")
      return i === sampleCorrect ? "correct" : i === selected ? "incorrect" : "dimmed";
    if (phase === "incorrect") return i === selected ? "incorrect" : "idle";
    return i === selected ? "selected" : "idle";
  }

  function reset(next: Phase) {
    setSelected(null);
    setAttempt(1);
    setPhase(next);
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
      <div className="border-line bg-bg relative h-[720px] w-full max-w-[360px] overflow-hidden rounded-[36px] border">
        <NavBar
          sticky={false}
          back={{ href: "#", label: t("nav.allPlaylists") }}
          trailing={<XpCounter value={xp} className="text-[15px]" />}
        />
        <motion.div
          className="relative aspect-video bg-black"
          animate={
            dimmed
              ? { scale: 0.94, filter: phase === "teaser" ? "brightness(0.7)" : "brightness(0.45)" }
              : { scale: 1, filter: "brightness(1)" }
          }
          transition={springs.gentle}
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#164c9e_0%,#0b2750_60%,#000_100%)]" />
          <span
            className="absolute bottom-3 left-3 text-[13px] font-medium text-white/80"
            lang="en"
          >
            Video
          </span>
        </motion.div>
        <div className="gutter pt-3">
          <p className="type-headline text-text-1">
            <Bi bn="NAV কী?" en="What is NAV?" />
          </p>
          <p className="type-footnote text-text-2">
            Mutual Fund 101 · {t("video.episode", { n: 2 })}
          </p>
        </div>

        {flying !== null && (
          <motion.div
            className="absolute z-[60]"
            initial={{ left: "50%", top: "62%", x: "-50%", scale: 1, opacity: 1 }}
            animate={{ left: "88%", top: "4%", scale: 0.6, opacity: [1, 1, 0] }}
            transition={{ ...springs.bouncy, opacity: { duration: 0.6, times: [0, 0.8, 1] } }}
          >
            <XpChip xp={flying} />
          </motion.div>
        )}

        <Sheet open={questionOpen} contained labelledBy={titleId}>
          <div className="flex flex-col gap-4">
            <p className="type-callout text-reward-text flex items-center gap-2">
              {t("quiz.question")} · {t("quiz.xpReward", { xp: attempt === 1 ? 10 : 5 })}
            </p>
            <h3 id={titleId} className="type-title-2 text-text-1">
              <Bi bn="NAV বলতে কী বোঝায়?" en="What does NAV mean?" />
            </h3>
            <div role="radiogroup" aria-labelledby={titleId} className="flex flex-col gap-2">
              {sampleOptions.map((option, i) => (
                <AnswerOption
                  key={option.en}
                  letter={optionLetters[locale][i]}
                  state={optionState(i)}
                  disabled={phase === "correct" || phase === "revealed"}
                  onSelect={() => {
                    if (phase === "incorrect") {
                      setAttempt(2);
                      setPhase("asking");
                    }
                    setSelected(i);
                  }}
                >
                  <Bi bn={option.bn} en={option.en} />
                </AnswerOption>
              ))}
            </div>
            <div aria-live="polite" className="min-h-6">
              {phase === "correct" && (
                <p className="type-callout text-text-1">
                  <span className="text-correct font-semibold">{t("quiz.correct")}</span>{" "}
                  <Bi
                    bn="NAV মানে ফান্ডের প্রতিটি ইউনিটের মূল্য।"
                    en="NAV is the value of one unit of the fund."
                  />
                </p>
              )}
              {phase === "incorrect" && (
                <p className="type-callout text-text-1">
                  <span className="text-incorrect font-semibold">{t("quiz.incorrect")}</span>{" "}
                  {t("quiz.oneMoreTry")}
                </p>
              )}
              {phase === "revealed" && (
                <p className="type-callout text-text-1">
                  {t("quiz.answerIs", { answer: optionLetters[locale][sampleCorrect] })}
                </p>
              )}
            </div>
            {phase === "correct" || phase === "revealed" ? (
              <Button fullWidth onClick={() => reset("watching")}>
                {t("action.continueWatching")}
              </Button>
            ) : phase === "incorrect" ? (
              <Button
                fullWidth
                onClick={() => {
                  setAttempt(2);
                  setSelected(null);
                  setPhase("asking");
                }}
              >
                {t("action.tryAgain")}
              </Button>
            ) : (
              <Button fullWidth disabled={selected === null} onClick={answer}>
                {t("action.answer")}
              </Button>
            )}
          </div>
        </Sheet>

        <Sheet open={phase === "teaser"} contained>
          <button
            type="button"
            onClick={endTeaser}
            className="flex w-full flex-col gap-3 pb-2 text-left"
            aria-label={`${t("quiz.proLocked")}. ${t("quiz.resuming")}`}
          >
            <div className="flex items-center justify-between">
              <ProMark />
              <CountdownRing seconds={3} onDone={endTeaser} />
            </div>
            <p aria-hidden className="type-title-2 text-text-1 blur-[6px] select-none">
              <Bi
                bn="এক্সপেন্স রেশিও কীভাবে রিটার্নে প্রভাব ফেলে?"
                en="How does the expense ratio affect returns?"
              />
            </p>
            <p className="type-callout text-text-2">{t("quiz.proLocked")}</p>
          </button>
        </Sheet>
      </div>

      <div className="flex w-full max-w-[360px] flex-col gap-3">
        <Button onClick={() => reset("asking")}>
          <Bi bn="ফ্রি প্রশ্ন দেখান" en="Show free question" />
        </Button>
        <Button variant="secondary" onClick={() => reset("teaser")}>
          <Bi bn="Pro টিজার দেখান" en="Show Pro teaser" />
        </Button>
        <p className="type-footnote text-text-2" lang="en">
          The correct sample answer is the first option. Pick another to see the retry. XP flies to
          the counter in the top bar. Turn on reduced motion in your OS to see the calm version.
        </p>
      </div>
    </div>
  );
}

function Rewards() {
  const [xp, setXp] = useState(120);
  const [celebrate, setCelebrate] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <XpChip xp={10} />
        <XpCounter value={xp} className="type-headline" />
        <Button size="md" variant="secondary" onClick={() => setXp((v) => v + 10)}>
          +10 XP
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <LevelRing xp={0} />
        <LevelRing xp={xp} />
        <LevelRing xp={1400} size={56} />
        <LevelRing xp={4200} size={56} />
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <StreakFlame days={0} />
        <StreakFlame days={2} />
        <StreakFlame days={3} />
        <StreakFlame days={7} celebrate={celebrate} />
        <StreakFlame days={30} />
        <Button
          size="md"
          variant="secondary"
          onClick={() => {
            setCelebrate(true);
            window.setTimeout(() => setCelebrate(false), 600);
          }}
        >
          <Bi bn="মাইলফলক" en="Milestone" />
        </Button>
      </div>
    </div>
  );
}

function ScrubberDemo() {
  const [current, setCurrent] = useState(95);
  return (
    <Scrubber
      duration={312}
      current={current}
      onSeek={setCurrent}
      pausePoints={[
        { at: 48, state: "answered" },
        { at: 110, state: "upcoming" },
        { at: 160, state: "pro" },
        { at: 210, state: "pro" },
        { at: 265, state: "pro" },
      ]}
    />
  );
}

function ContentDemo() {
  const t = useT();
  return (
    <div className="flex flex-col gap-8">
      <SeriesHeader
        titleBn="মিউচুয়াল ফান্ড ১০১"
        titleEn="Mutual Fund 101"
        descriptionBn="ভিত্তি থেকে শুরু। মিউচুয়াল ফান্ড কী, NAV কীভাবে কাজ করে আর কীভাবে শুরু করবেন।"
        descriptionEn="The foundation. What a mutual fund is, how NAV works, and how to start."
        partner="EDGE"
        done={3}
        total={13}
      />
      <div className="grid grid-cols-2 gap-4">
        <VideoCard
          href="#"
          youtubeId="0cWdKh2t5Jg"
          titleBn="NAV কী"
          titleEn="What is NAV"
          meta={t("video.episode", { n: 2 })}
          progress={0.4}
        />
        <VideoCard
          href="#"
          youtubeId="thM31u3IWHA"
          titleBn="ওপেন-এন্ড ও ক্লোজড-এন্ড ফান্ড"
          titleEn="Open-ended & closed-ended funds"
          meta={t("video.episode", { n: 3 })}
        />
      </div>
      <div>
        <LeaderboardRow rank={1} name="Nafisa" xp={420} />
        <LeaderboardRow rank={2} name="Tanvir" xp={390} />
        <LeaderboardRow rank={3} name="Sadia" xp={375} />
        <div className="h-3" />
        <LeaderboardRow rank={14} name="" xp={120} you />
      </div>
      <div className="flex gap-3">
        <Skeleton className="rounded-media aspect-video w-1/2" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}

function Badges() {
  return (
    <div className="flex flex-wrap gap-2">
      <BadgeIcon kind="video" glyph="play" label="NAV" earned />
      <BadgeIcon kind="series" glyph="layers" label="Mutual Fund 101" earned />
      <BadgeIcon kind="milestone" glyph="flame" label="7" earned />
      <BadgeIcon kind="video" glyph="play" label="SIP" earned={false} />
      <BadgeIcon kind="series" glyph="layers" label="KOSH FAQ" earned={false} />
      <BadgeIcon kind="milestone" glyph="trophy" label="Level 3" earned={false} />
    </div>
  );
}

function Perks() {
  const t = useT();
  return (
    <div>
      <LockedPerk label={t("pro.perk.allQuestions")} />
      <LockedPerk label={t("pro.perk.streakFreeze")} />
      <LockedPerk label={t("pro.perk.certificates")} />
    </div>
  );
}

function NavigationDemo() {
  const t = useT();
  return (
    <div className="rounded-control border-line flex flex-col gap-4 overflow-hidden border">
      <NavBar sticky={false} title="Briddhi Uni" trailing={<XpCounter value={85} />} />
      <NavBar
        sticky={false}
        back={{ href: "#", label: t("nav.allPlaylists") }}
        trailing={<StreakFlame days={7} />}
      />
      <TabBar
        sticky={false}
        current="/home"
        items={[
          { href: "/home", label: t("nav.home"), icon: "home" },
          { href: "/library", label: t("nav.library"), icon: "library" },
          { href: "/leaderboard", label: t("nav.leaderboard"), icon: "rank" },
          { href: "/profile", label: t("nav.profile"), icon: "profile" },
        ]}
      />
    </div>
  );
}

function MotionDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Button variant="secondary" size="md" className="self-start" onClick={() => setOn((v) => !v)}>
        <span lang="en">Play the three springs</span>
      </Button>
      {(Object.keys(springs) as Array<keyof typeof springs>).map((name) => (
        <div key={name} className="flex items-center gap-4">
          <code className="type-footnote text-text-2 w-16">{name}</code>
          <div className="bg-surface relative h-8 flex-1 rounded-full">
            <motion.div
              className="bg-action absolute top-1 size-6 rounded-full"
              animate={{ left: on ? "calc(100% - 28px)" : "4px" }}
              transition={springs[name]}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
