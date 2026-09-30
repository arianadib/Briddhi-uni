"use client";

import { Flame, Layers, Play, Sparkles, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/preferences/PreferencesProvider";

export type BadgeKind = "video" | "series" | "milestone";
export type BadgeGlyph = "play" | "layers" | "flame" | "trophy" | "sparkles";

const glyphs: Record<BadgeGlyph, LucideIcon> = {
  play: Play,
  layers: Layers,
  flame: Flame,
  trophy: Trophy,
  sparkles: Sparkles,
};

/**
 * The badge family. One visual grammar: the kind sets the outer shape
 * (video: circle, series: hexagon, milestone: shield), the glyph sits inside
 * at a fixed size and stroke. Earned badges fill orange; locked ones are
 * outlines. No emoji.
 */
const shapes: Record<BadgeKind, string> = {
  video: "M32 4a28 28 0 1 1 0 56a28 28 0 1 1 0-56z",
  series:
    "M28.5 5.1a7 7 0 0 1 7 0l19 11a7 7 0 0 1 3.5 6v19.8a7 7 0 0 1-3.5 6l-19 11a7 7 0 0 1-7 0l-19-11a7 7 0 0 1-3.5-6V22.1a7 7 0 0 1 3.5-6z",
  milestone:
    "M30 4.6a6 6 0 0 1 4 0l18 6.5a6 6 0 0 1 4 5.7v14.4c0 13.2-9.3 23.6-22.2 28.3a6 6 0 0 1-3.6 0C17.3 54.8 8 44.4 8 31.2V16.8a6 6 0 0 1 4-5.7z",
};

export function BadgeIcon({
  kind,
  glyph,
  label,
  earned,
  size = 64,
}: {
  kind: BadgeKind;
  glyph: BadgeGlyph;
  label: string;
  earned: boolean;
  size?: number;
}) {
  const t = useT();
  const Glyph = glyphs[glyph];
  return (
    <figure className="flex w-20 flex-col items-center gap-2 text-center">
      <span
        role="img"
        aria-label={earned ? label : `${label}, ${t("badge.locked")}`}
        className="relative inline-flex"
        style={{ width: size, height: size }}
      >
        <svg aria-hidden viewBox="0 0 64 64" width={size} height={size}>
          <path
            d={shapes[kind]}
            fill={earned ? "var(--reward)" : "var(--bg)"}
            stroke={earned ? "none" : "var(--line)"}
            strokeWidth={2}
          />
        </svg>
        <Glyph
          aria-hidden
          strokeWidth={2.25}
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            earned ? "text-on-reward" : "text-text-3",
          )}
          style={{ width: size * 0.38, height: size * 0.38 }}
        />
      </span>
      <figcaption className={cn("type-footnote", earned ? "text-text-1" : "text-text-3")}>
        {label}
      </figcaption>
    </figure>
  );
}
