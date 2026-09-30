"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useAnimate } from "motion/react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { springs } from "@/lib/motion";
import { levelFor } from "@/lib/levels";
import { formatNumber } from "@/lib/i18n/locales";
import { useLocale, useT } from "@/lib/preferences/PreferencesProvider";
import type { MessageKey } from "@/lib/i18n/dictionaries";

/** "+10 XP" on an orange fill. Text on orange is always dark (6.9:1). */
export function XpChip({ xp, className }: { xp: number; className?: string }) {
  const t = useT();
  return (
    <span
      className={cn(
        "bg-reward text-on-reward inline-flex h-7 items-center rounded-full px-3 text-[14px] font-bold tabular-nums",
        className,
      )}
    >
      {t("xp.gained", { xp })}
    </span>
  );
}

/**
 * The header XP total. Counts up over 400ms when it increases, then pulses
 * once with `bouncy`. It sits in a fixed-width box so the digits don't jitter.
 */
export function XpCounter({ value, className }: { value: number; className?: string }) {
  const locale = useLocale();
  const t = useT();
  const [shown, setShown] = useState(value);
  const previous = useRef(value);
  const [scope, animateScope] = useAnimate();

  useEffect(() => {
    const from = previous.current;
    previous.current = value;
    if (from === value) return;
    const controls = animate(from, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (v) => setShown(Math.round(v)),
    });
    if (value > from && scope.current) {
      animateScope(scope.current, { scale: [1, 1.14, 1] }, springs.bouncy);
    }
    return () => controls.stop();
  }, [value, scope, animateScope]);

  const digits = String(value).length;
  return (
    <span
      ref={scope}
      className={cn("text-reward-text inline-flex items-baseline gap-1 font-semibold", className)}
    >
      <span
        aria-hidden
        className="tabular-nums"
        style={{ minWidth: `${digits + 0.5}ch`, textAlign: "right" }}
      >
        {formatNumber(shown, locale)}
      </span>
      <span aria-hidden className="text-[0.8em]">
        XP
      </span>
      {/* Announces the final total once, not every frame of the count-up. */}
      <span className="sr-only" aria-live="polite">
        {t("xp.total", { xp: value })}
      </span>
    </span>
  );
}

/**
 * Progress to the next level as a ring around the level number.
 * The arc animates with `gentle` when XP changes.
 */
export function LevelRing({ xp, size = 44 }: { xp: number; size?: number }) {
  const locale = useLocale();
  const t = useT();
  const { level, next, progress } = levelFor(xp);
  const name = t(`level.name.${level}` as MessageKey);
  const label =
    t("level.label", { n: level, name }) +
    (next !== null ? `, ${t("level.progress", { xp, next })}` : "");
  const stroke = Math.max(3, size / 12);
  const r = (size - stroke) / 2;

  return (
    <span
      role="img"
      aria-label={label}
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--reward)"
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: Math.max(progress, 0.001) }}
          transition={springs.gentle}
        />
      </svg>
      <span
        aria-hidden
        className="text-text-1 absolute inset-0 flex items-center justify-center font-semibold"
        style={{ fontSize: size * 0.36 }}
      >
        {formatNumber(level, locale)}
      </span>
    </span>
  );
}

/** Milestone tiers: the flame grows at 3, 7 and 30 days. */
function flameSize(days: number): number {
  if (days >= 30) return 28;
  if (days >= 7) return 24;
  if (days >= 3) return 21;
  return 18;
}

/**
 * The streak flame. Still by default: no ambient flicker. It animates once,
 * only when `celebrate` is set (a milestone was just reached).
 */
export function StreakFlame({
  days,
  celebrate = false,
  showLabel = true,
}: {
  days: number;
  celebrate?: boolean;
  showLabel?: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const size = flameSize(days);
  const lit = days > 0;
  const label = lit ? t("streak.days", { n: days }) : t("streak.none");

  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={label}>
      <motion.svg
        aria-hidden
        width={size}
        height={size}
        viewBox="0 0 24 24"
        initial={false}
        animate={celebrate ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={springs.bouncy}
        className={lit ? "text-reward" : "text-text-3"}
      >
        <path
          d="M12 2.5c.6 3.1-1 4.9-2.6 6.6C7.8 10.8 6 12.7 6 15.6 6 19 8.7 21.5 12 21.5s6-2.5 6-5.9c0-2.2-1-4-2.4-5.3-.2 1.4-.9 2.6-2.1 3.2.4-3.8-.9-7.6-1.5-11z"
          fill={lit ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={lit ? 0 : 1.6}
          strokeLinejoin="round"
        />
        {lit && (
          <path
            d="M12 21.5c-1.7 0-3-1.3-3-3 0-1.6 1.1-2.6 2-3.5.3 1 1 1.6 1.8 1.9-.1-.9.2-1.9.8-2.6.9 1 1.4 2.1 1.4 3.3 0 2.1-1.3 3.9-3 3.9z"
            fill="var(--on-reward)"
            opacity={0.18}
          />
        )}
      </motion.svg>
      {showLabel && (
        <span
          aria-hidden
          className={cn("type-callout tabular-nums", lit ? "text-text-1" : "text-text-3")}
        >
          {formatNumber(days, locale)}
        </span>
      )}
    </span>
  );
}

/** The Pro mark: monochrome and quiet. Premium through restraint. */
export function ProMark({ className }: { className?: string }) {
  const t = useT();
  return (
    <span
      className={cn(
        "rounded-chip border-line text-text-1 inline-flex h-6 items-center gap-1 border px-2 text-[12px] font-semibold",
        className,
      )}
      lang="en"
    >
      <Lock aria-hidden className="size-3" strokeWidth={2.5} />
      {t("pro.mark")}
    </span>
  );
}

/** A perk the learner doesn't have yet. Locked is a quiet state, not a coloured one. */
export function LockedPerk({ label }: { label: string }) {
  return (
    <div className="border-line flex min-h-12 items-center gap-3 border-b last:border-b-0">
      <Lock aria-hidden className="text-text-3 size-4 shrink-0" />
      <span className="type-body text-text-2 flex-1">{label}</span>
      <ProMark />
    </div>
  );
}
