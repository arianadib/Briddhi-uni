"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/time";
import { useLocale, useT } from "@/lib/preferences/PreferencesProvider";

export type PausePointMark = { at: number; state: "answered" | "upcoming" | "pro" };

/**
 * The video progress bar. Pause points show as small ticks: answered (orange,
 * you earned it), upcoming (hollow), Pro (a quiet grey dot). The visible bar is
 * 4px, but the hit area is 44px tall. Arrow keys seek ±5s.
 */
export function Scrubber({
  duration,
  current,
  pausePoints = [],
  onSeek,
  className,
}: {
  duration: number;
  current: number;
  pausePoints?: PausePointMark[];
  onSeek?: (seconds: number) => void;
  className?: string;
}) {
  const locale = useLocale();
  const t = useT();
  const track = useRef<HTMLDivElement>(null);
  const safeDuration = Math.max(duration, 1);
  const ratio = Math.min(1, Math.max(0, current / safeDuration));

  function seekFromPointer(event: PointerEvent) {
    const rect = track.current?.getBoundingClientRect();
    if (!rect || !onSeek) return;
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    onSeek((x / rect.width) * safeDuration);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!onSeek) return;
    const map: Record<string, number> = {
      ArrowRight: current + 5,
      ArrowUp: current + 5,
      ArrowLeft: current - 5,
      ArrowDown: current - 5,
      Home: 0,
      End: safeDuration,
    };
    if (!(event.key in map)) return;
    event.preventDefault();
    onSeek(Math.min(Math.max(map[event.key], 0), safeDuration));
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={t("player.seek")}
      aria-valuemin={0}
      aria-valuemax={Math.round(safeDuration)}
      aria-valuenow={Math.round(current)}
      aria-valuetext={`${formatTime(current, locale)} / ${formatTime(safeDuration, locale)}`}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        seekFromPointer(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e);
      }}
      className={cn("group relative flex h-11 cursor-pointer touch-none items-center", className)}
    >
      <div ref={track} className="bg-line relative h-1 w-full rounded-full">
        <div
          className="bg-action absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${ratio * 100}%` }}
        />
        {pausePoints.map((point) => (
          <span
            key={point.at}
            aria-hidden
            className={cn(
              "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
              point.state === "answered" && "bg-reward size-2",
              point.state === "upcoming" && "border-text-1 bg-bg size-2 border-[1.5px]",
              point.state === "pro" && "bg-text-3 size-1.5",
            )}
            style={{ left: `${(point.at / safeDuration) * 100}%` }}
          />
        ))}
        <span
          aria-hidden
          className="bg-action absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 group-active:scale-125"
          style={{ left: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
