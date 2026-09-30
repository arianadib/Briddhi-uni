"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { LoaderCircle, Pause, Play, RotateCcw } from "lucide-react";
import { NavBar } from "@/components/ui/Navigation";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { AnswerOption, type AnswerState } from "@/components/ui/AnswerOption";
import { CountdownRing } from "@/components/ui/CountdownRing";
import { ProMark, XpChip, XpCounter } from "@/components/ui/Rewards";
import { Scrubber } from "@/components/ui/Scrubber";
import { Disclaimer, youtubeThumb } from "@/components/ui/Content";
import { Bi, useLocale, useT } from "@/lib/preferences/PreferencesProvider";
import { optionLetters } from "@/lib/i18n/locales";
import { formatTime } from "@/lib/time";
import { springs } from "@/lib/motion";
import { hapticTick } from "@/lib/haptics";
import { track } from "@/lib/analytics";
import { XP, answerXp } from "@/lib/xp";
import { quizRules } from "@/lib/quiz/rules";
import {
  createStops,
  markStop,
  resolveSeek,
  stopReached,
  tickState,
  type Stop,
} from "@/lib/quiz/engine";
import { createAdapter } from "@/lib/player/youtube";
import type { PlayerAdapter } from "@/lib/player/types";
import {
  answeredIds,
  awardXp,
  markCompleted,
  recordAnswer,
  savePosition,
  savedPosition,
  useTotalXp,
} from "@/lib/progress/store";

export type LessonStop = { id: string; at: number; tier: "free" | "pro" };
export type FreeQuestion = {
  stopId: string;
  promptBn: string;
  promptEn: string;
  options: Array<{ bn: string; en: string }>;
  correctIndex: number;
  explanationBn: string;
  explanationEn: string;
};

type Phase = "watching" | "question" | "teaser" | "ended";
type Result = "none" | "correct" | "incorrect" | "revealed";
type Flight = { xp: number; from: DOMRect; to: DOMRect };

/** A jump bigger than this between two polls wasn't playback, it was a seek. */
const MAX_PLAYBACK_STEP_SECONDS = 2;
const POSITION_SAVE_EVERY_SECONDS = 5;

/** Placeholder shown blurred in the Pro teaser. The real Pro question never reaches the browser. */
const proPlaceholder = {
  bn: "এই প্রশ্নটি Pro সদস্যদের জন্য, পর্বের এই অংশের মূল ধারণা নিয়ে",
  en: "This question is for Pro members, on the key idea from this part",
};

export function LessonPlayer({
  video,
  series,
  stops: initialStops,
  freeQuestion,
  isSample,
}: {
  video: {
    id: string;
    youtubeId: string;
    titleBn: string;
    titleEn: string;
    episode: number;
    durationSeconds: number;
  };
  series: { id: string; titleBn: string; titleEn: string; partner: string };
  stops: LessonStop[];
  freeQuestion: FreeQuestion | null;
  isSample: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const questionTitleId = useId();

  const hostRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const adapterRef = useRef<PlayerAdapter | null>(null);
  const previousTimeRef = useRef(0);
  const lastSavedRef = useRef(0);

  const [stops, setStopsState] = useState<Stop[]>(() =>
    createStops(initialStops.map((s) => ({ id: s.id, atSeconds: s.at, tier: s.tier }))),
  );
  const stopsRef = useRef(stops);
  const setStops = useCallback((next: Stop[]) => {
    stopsRef.current = next;
    setStopsState(next);
  }, []);

  const [status, setStatus] = useState<"poster" | "loading" | "ready" | "error">("poster");
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds);
  const [phase, setPhaseState] = useState<Phase>("watching");
  const phaseRef = useRef<Phase>("watching");
  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const [selected, setSelected] = useState<number | null>(null);
  const [attempt, setAttempt] = useState<1 | 2>(1);
  const [result, setResult] = useState<Result>("none");
  const [flight, setFlight] = useState<Flight | null>(null);
  const [pendingXp, setPendingXp] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const totalXp = useTotalXp();
  const title = locale === "bn" ? video.titleBn : video.titleEn;

  // Questions answered on an earlier visit stay answered.
  useEffect(() => {
    const done = answeredIds();
    if (stopsRef.current.some((s) => done.has(s.id))) {
      setStops(stopsRef.current.map((s) => (done.has(s.id) ? { ...s, status: "answered" } : s)));
    }
  }, [setStops]);

  const openStop = useCallback(
    (stop: Stop) => {
      if (stop.tier === "free" && freeQuestion) {
        setSelected(null);
        setAttempt(1);
        setResult("none");
        setPhase("question");
      } else {
        setPhase("teaser");
        track("pro_teaser_shown", { videoId: video.id, stopId: stop.id });
      }
    },
    [freeQuestion, setPhase, video.id],
  );

  const onEnded = useCallback(() => {
    setPhase("ended");
    setPlaying(false);
    markCompleted(video.id);
    awardXp("video_complete", video.id, XP.finishVideo);
    savePosition(video.id, 0);
    track("video_completed", { videoId: video.id });
  }, [setPhase, video.id]);

  /** Every seek goes through the engine, so the free question can't be skipped. */
  const seekTo = useCallback(
    (to: number) => {
      const adapter = adapterRef.current;
      if (!adapter) return;
      const from = adapter.getCurrentTime();
      const decision = resolveSeek(stopsRef.current, from, to);
      setStops(decision.stops);
      adapter.seek(decision.target);
      previousTimeRef.current = decision.target;
      if (decision.glidedBack) {
        setAnnouncement(t("player.glideBack"));
        if (reduceMotion) setTime(decision.target);
        else
          animate(to, decision.target, {
            duration: 0.45,
            ease: [0.2, 0.8, 0.2, 1],
            onUpdate: setTime,
          });
      } else {
        setTime(decision.target);
      }
    },
    [reduceMotion, setStops, t],
  );

  async function start() {
    if (!hostRef.current) return;
    setStatus("loading");
    try {
      let adapter = adapterRef.current;
      if (!adapter) {
        adapter = createAdapter({ provider: "youtube", id: video.youtubeId });
        adapterRef.current = adapter;
        adapter.on("play", () => {
          setPlaying(true);
          setBuffering(false);
          setStarted(true);
        });
        adapter.on("pause", () => setPlaying(false));
        adapter.on("buffering", () => setBuffering(true));
        adapter.on("ended", onEnded);
        adapter.on("error", () => setStatus("error"));
      }
      // Resume where the learner left off, but never past an unanswered free question.
      const resume = resolveSeek(stopsRef.current, 0, savedPosition(video.id));
      setStops(resume.stops);
      previousTimeRef.current = resume.target;
      await adapter.load(
        hostRef.current,
        { provider: "youtube", id: video.youtubeId },
        {
          startSeconds: resume.target,
        },
      );
      setDuration(adapter.getDuration() || video.durationSeconds);
      setStatus("ready");
      adapter.play();
      track("video_started", { videoId: video.id, from: resume.target });
    } catch {
      setStatus("error");
    }
  }

  // The watch loop: poll every frame while playing (and 4× a second when the
  // tab is hidden, where frames stop), stop at pause points, save position.
  useEffect(() => {
    if (status !== "ready") return;
    let frame = 0;
    let lastUiUpdate = 0;

    function check() {
      const adapter = adapterRef.current;
      if (!adapter || phaseRef.current !== "watching") return;
      const now = adapter.getCurrentTime();
      const previous = previousTimeRef.current;
      const step = now - previous;

      if (step >= 0 && step < MAX_PLAYBACK_STEP_SECONDS) {
        const stop = stopReached(stopsRef.current, previous, now);
        if (stop) {
          adapter.pause();
          previousTimeRef.current = stop.at;
          setTime(stop.at);
          openStop(stop);
          return;
        }
        previousTimeRef.current = now;
      } else if (step >= MAX_PLAYBACK_STEP_SECONDS) {
        // A jump we didn't make (keyboard in the iframe, network recovery): guard it too.
        const decision = resolveSeek(stopsRef.current, previous, now);
        setStops(decision.stops);
        previousTimeRef.current = decision.target;
        if (decision.glidedBack) adapter.seek(decision.target);
      } else {
        previousTimeRef.current = now;
      }

      if (Math.abs(now - lastSavedRef.current) >= POSITION_SAVE_EVERY_SECONDS) {
        lastSavedRef.current = now;
        savePosition(video.id, now);
      }
      const clock = performance.now();
      if (clock - lastUiUpdate > 100) {
        lastUiUpdate = clock;
        setTime(now);
      }
    }

    function loop() {
      check();
      frame = requestAnimationFrame(loop);
    }
    frame = requestAnimationFrame(loop);
    const hiddenTimer = window.setInterval(() => {
      if (document.hidden) check();
    }, 250);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(hiddenTimer);
    };
  }, [status, openStop, setStops, video.id]);

  useEffect(() => () => adapterRef.current?.destroy(), []);

  function togglePlay() {
    const adapter = adapterRef.current;
    if (status === "poster" || status === "error") {
      void start();
      return;
    }
    if (!adapter || phase === "question" || phase === "teaser") return;
    if (phase === "ended") {
      setPhase("watching");
      previousTimeRef.current = 0;
      adapter.seek(0);
      adapter.play();
      return;
    }
    if (adapter.isPlaying()) {
      adapter.pause();
      savePosition(video.id, adapter.getCurrentTime());
    } else adapter.play();
  }

  function onPlayerKey(event: KeyboardEvent) {
    if (event.target !== event.currentTarget) return;
    if (event.key === " " || event.key === "k") {
      event.preventDefault();
      togglePlay();
    } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const adapter = adapterRef.current;
      if (adapter && phase === "watching")
        seekTo(adapter.getCurrentTime() + (event.key === "ArrowRight" ? 5 : -5));
    }
  }

  // ── The free question ────────────────────────────────────────────────
  function answer() {
    if (!freeQuestion || selected === null) return;
    const correct = selected === freeQuestion.correctIndex;
    track("question_answered", {
      videoId: video.id,
      stopId: freeQuestion.stopId,
      attempt,
      correct,
    });

    if (correct) {
      setResult("correct");
      recordAnswer(freeQuestion.stopId, true, attempt);
      hapticTick();
      const amount = answerXp(attempt, true);
      const awarded = awardXp(
        attempt === 1 ? "answer_first_try" : "answer_retry",
        freeQuestion.stopId,
        amount,
      );
      // Hold the counter back until the chip lands, unless motion is reduced.
      // The feedback line only exists after this render, so measure it after.
      if (!reduceMotion && awarded > 0) {
        setPendingXp(awarded);
        window.setTimeout(() => {
          const from = feedbackRef.current?.getBoundingClientRect();
          const to = counterRef.current?.getBoundingClientRect();
          if (from && to) setFlight({ xp: awarded, from, to });
          else setPendingXp(0);
        }, 220);
      }
    } else if (attempt === 1) {
      setResult("incorrect");
    } else {
      setResult("revealed");
      recordAnswer(freeQuestion.stopId, false, 2);
    }
  }

  function tryAgain() {
    setAttempt(2);
    setSelected(null);
    setResult("none");
  }

  function continueWatching() {
    if (!freeQuestion) return;
    setStops(markStop(stopsRef.current, freeQuestion.stopId, "answered"));
    setPhase("watching");
    adapterRef.current?.play();
  }

  const endTeaser = useCallback(() => {
    if (phaseRef.current !== "teaser") return;
    const current = stopsRef.current.find(
      (s) =>
        s.tier === "pro" && s.status === "pending" && Math.abs(s.at - previousTimeRef.current) < 1,
    );
    if (current) setStops(markStop(stopsRef.current, current.id, "teased"));
    setPhase("watching");
    adapterRef.current?.play();
  }, [setPhase, setStops]);

  function optionState(i: number): AnswerState {
    if (!freeQuestion) return "idle";
    if (result === "correct") return i === freeQuestion.correctIndex ? "correct" : "dimmed";
    if (result === "revealed")
      return i === freeQuestion.correctIndex ? "correct" : i === selected ? "incorrect" : "dimmed";
    if (result === "incorrect") return i === selected ? "incorrect" : "idle";
    return i === selected ? "selected" : "idle";
  }

  const dimmed = phase === "question" || phase === "teaser";
  const resolved = result === "correct" || result === "revealed";

  return (
    <div className="bg-bg min-h-dvh">
      <NavBar
        back={{ href: "/library", label: t("nav.allPlaylists") }}
        trailing={
          <span ref={counterRef}>
            <XpCounter value={totalXp - pendingXp} className="text-[15px]" />
          </span>
        }
      />

      <main className="mx-auto max-w-[960px] md:px-8 md:pt-6">
        {/* The player. Full-bleed on phones, rounded on larger screens. */}
        <section
          aria-label={t("player.region", { title })}
          tabIndex={0}
          onKeyDown={onPlayerKey}
          className="focus-visible:ring-action md:rounded-media outline-none focus-visible:ring-2"
        >
          <motion.div
            className="md:rounded-media relative aspect-video overflow-hidden bg-black"
            animate={
              dimmed
                ? {
                    scale: 0.94,
                    filter: phase === "teaser" ? "brightness(0.7)" : "brightness(0.45)",
                  }
                : { scale: 1, filter: "brightness(1)" }
            }
            transition={springs.gentle}
          >
            <div ref={hostRef} className="absolute inset-0 [&_iframe]:size-full" />

            {/* Poster until the first frame plays: no layout shift, no black flash. */}
            {!started && (
              <Image
                src={youtubeThumb(video.youtubeId)}
                alt=""
                fill
                priority
                sizes="(min-width: 960px) 960px, 100vw"
                className="object-cover"
              />
            )}

            {/* Catches taps so YouTube's own UI never appears; we own play/pause. */}
            <button
              type="button"
              onClick={togglePlay}
              disabled={dimmed}
              aria-label={playing ? t("player.pause") : t("player.play")}
              className="absolute inset-0 flex items-center justify-center"
            >
              {(!started || !playing) && phase === "watching" && status !== "error" && (
                <span className="flex size-16 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform duration-150 active:scale-95">
                  {status === "loading" || buffering ? (
                    <LoaderCircle aria-hidden className="size-7 animate-spin" />
                  ) : (
                    <Play aria-hidden className="ml-1 size-7 fill-current" />
                  )}
                </span>
              )}
            </button>

            {status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 p-6 text-center">
                <p className="type-callout max-w-[32ch] text-white">{t("player.error")}</p>
                <Button size="md" onClick={() => void start()}>
                  {t("player.retry")}
                </Button>
              </div>
            )}

            {phase === "ended" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-center">
                <p className="type-headline text-white">{t("player.finished")}</p>
                <XpChip xp={XP.finishVideo} />
                <Button size="md" variant="secondary" onClick={togglePlay}>
                  <RotateCcw aria-hidden className="size-4" />
                  {t("player.replay")}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Controls */}
          <div className="gutter flex items-center gap-2 md:px-0">
            <button
              type="button"
              onClick={togglePlay}
              disabled={dimmed}
              aria-label={playing ? t("player.pause") : t("player.play")}
              className="rounded-control text-text-1 active:bg-surface disabled:text-text-3 -ml-2 flex size-11 shrink-0 items-center justify-center"
            >
              {playing ? (
                <Pause aria-hidden className="size-5 fill-current" />
              ) : (
                <Play aria-hidden className="size-5 fill-current" />
              )}
            </button>
            <Scrubber
              className="flex-1"
              duration={duration}
              current={time}
              onSeek={status === "ready" && phase === "watching" ? seekTo : undefined}
              pausePoints={stops.map((s) => ({ at: s.at, state: tickState(s) }))}
            />
            <span className="type-footnote text-text-2 shrink-0 tabular-nums">
              {formatTime(time, locale)} / {formatTime(duration, locale)}
            </span>
          </div>
        </section>

        <div className="gutter flex flex-col gap-2 pt-2 pb-12 md:px-0">
          <p className="type-callout text-text-2">
            <span lang="en">
              Briddhi <span className="text-text-3">×</span>{" "}
              <span className="text-text-1 font-semibold">{series.partner}</span>
            </span>
            <span className="text-text-3"> · </span>
            <Bi bn={series.titleBn} en={series.titleEn} />
            <span className="text-text-3"> · </span>
            {t("video.episode", { n: video.episode })}
          </p>
          <h1 className="type-title-2 text-text-1">{title}</h1>
          {isSample && <p className="type-footnote text-text-3">{t("quiz.sample")}</p>}
          <Disclaimer className="mt-6" />
        </div>
      </main>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* The free question: can't be dismissed, only answered. */}
      <Sheet open={phase === "question"} labelledBy={questionTitleId}>
        {freeQuestion && (
          <div className="mx-auto flex max-w-[560px] flex-col gap-4">
            <p className="type-callout text-reward-text">
              {t("quiz.question")} · {t("quiz.xpReward", { xp: answerXp(attempt, true) })}
            </p>
            <h2 id={questionTitleId} className="type-title-2 text-text-1">
              <Bi bn={freeQuestion.promptBn} en={freeQuestion.promptEn} />
            </h2>
            <div
              role="radiogroup"
              aria-labelledby={questionTitleId}
              className="flex flex-col gap-2"
            >
              {freeQuestion.options.map((option, i) => (
                <AnswerOption
                  key={option.en}
                  letter={optionLetters[locale][i]}
                  state={optionState(i)}
                  disabled={resolved || result === "incorrect"}
                  onSelect={() => setSelected(i)}
                >
                  <Bi bn={option.bn} en={option.en} />
                </AnswerOption>
              ))}
            </div>
            <div aria-live="polite" className="min-h-6">
              {result === "correct" && (
                <p ref={feedbackRef} className="type-callout text-text-1">
                  <span className="text-correct font-semibold">{t("quiz.correct")}</span>{" "}
                  <Bi bn={freeQuestion.explanationBn} en={freeQuestion.explanationEn} />
                </p>
              )}
              {result === "incorrect" && (
                <p className="type-callout text-text-1">
                  <span className="text-incorrect font-semibold">{t("quiz.incorrect")}</span>{" "}
                  {t("quiz.oneMoreTry")}
                </p>
              )}
              {result === "revealed" && (
                <p className="type-callout text-text-1">
                  {t("quiz.answerIs", {
                    answer: optionLetters[locale][freeQuestion.correctIndex],
                  })}{" "}
                  <Bi bn={freeQuestion.explanationBn} en={freeQuestion.explanationEn} />
                </p>
              )}
            </div>
            {resolved ? (
              <Button fullWidth onClick={continueWatching}>
                {t("action.continueWatching")}
              </Button>
            ) : result === "incorrect" ? (
              <Button fullWidth onClick={tryAgain}>
                {t("action.tryAgain")}
              </Button>
            ) : (
              <Button fullWidth disabled={selected === null} onClick={answer}>
                {t("action.answer")}
              </Button>
            )}
          </div>
        )}
      </Sheet>

      {/* The Pro teaser: 3 seconds, never blocks. Tap to continue sooner. */}
      <Sheet open={phase === "teaser"}>
        <button
          type="button"
          onClick={endTeaser}
          className="mx-auto flex w-full max-w-[560px] flex-col gap-3 pb-2 text-left"
        >
          <span className="flex items-center justify-between">
            <ProMark />
            <CountdownRing seconds={quizRules.proTeaserSeconds} onDone={endTeaser} />
          </span>
          <span aria-hidden className="type-title-2 text-text-1 blur-[7px] select-none">
            <Bi bn={proPlaceholder.bn} en={proPlaceholder.en} />
          </span>
          <span className="type-callout text-text-2">{t("quiz.proLocked")}</span>
          <span className="sr-only">{t("quiz.resuming")}</span>
        </button>
      </Sheet>

      {/* "+10 XP" flies from the answer to the header counter on an arc. */}
      {flight && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-[70]"
          initial={{
            x: flight.from.left,
            y: flight.from.top,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: [flight.from.left, (flight.from.left + flight.to.left) / 2, flight.to.left],
            y: [flight.from.top, Math.min(flight.from.top, flight.to.top) - 60, flight.to.top],
            scale: [1, 1.1, 0.7],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.65, ease: [0.3, 0, 0.2, 1], times: [0, 0.45, 1] }}
          onAnimationComplete={() => {
            setFlight(null);
            setPendingXp(0);
          }}
        >
          <XpChip xp={flight.xp} />
        </motion.div>
      )}
    </div>
  );
}
