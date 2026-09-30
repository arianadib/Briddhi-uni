"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/i18n/locales";
import { Bi, useLocale, useT } from "@/lib/preferences/PreferencesProvider";

/** The compliance disclaimer: quiet, but always legible (text-3 is 5.2:1). */
export function Disclaimer({ className }: { className?: string }) {
  const t = useT();
  return <p className={cn("type-footnote measure text-text-3", className)}>{t("disclaimer")}</p>;
}

/** YouTube's hqdefault is 4:3 with letterbox bars; object-cover crops it to 16:9. */
export function youtubeThumb(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * A video in a grid or list. Flat: no shadow, a 16px radius, and a thin
 * progress line only once the learner has started it.
 */
export function VideoCard({
  href,
  youtubeId,
  titleBn,
  titleEn,
  meta,
  progress = 0,
  locked = false,
  priority = false,
}: {
  href: string;
  youtubeId: string;
  titleBn: string;
  titleEn: string;
  meta?: string;
  /** 0–1 */
  progress?: number;
  locked?: boolean;
  priority?: boolean;
}) {
  return (
    <Link href={href} className="group rounded-media flex flex-col gap-3">
      <div className="rounded-media bg-surface relative aspect-video overflow-hidden">
        <Image
          src={youtubeThumb(youtubeId)}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, 100vw"
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-300 group-active:scale-[0.98]",
            locked && "opacity-50",
          )}
        />
        <span className="absolute bottom-2 left-2 flex size-8 items-center justify-center rounded-full bg-black/55 text-white">
          {locked ? (
            <Lock aria-hidden className="size-4" />
          ) : (
            <Play aria-hidden className="ml-0.5 size-4 fill-current" />
          )}
        </span>
        {progress > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
            <div
              className="bg-action h-full"
              style={{ width: `${Math.min(progress, 1) * 100}%` }}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="type-body text-text-1 font-semibold">
          <Bi bn={titleBn} en={titleEn} />
        </span>
        {meta && <span className="type-footnote text-text-2">{meta}</span>}
      </div>
    </Link>
  );
}

/** A leaderboard row. Plain text and a hairline; the learner's own row is bold. */
export function LeaderboardRow({
  rank,
  name,
  xp,
  you = false,
}: {
  rank: number;
  name: string;
  xp: number;
  you?: boolean;
}) {
  const locale = useLocale();
  const t = useT();
  return (
    <div
      className={cn(
        "border-line flex min-h-12 items-center gap-3 border-b",
        you && "rounded-control bg-surface border-transparent px-3",
      )}
    >
      <span className="type-callout text-text-3 w-9 tabular-nums">
        {you ? `#${formatNumber(rank, locale)}` : formatNumber(rank, locale)}
      </span>
      <span className={cn("type-body flex-1 truncate", you ? "font-semibold" : "text-text-1")}>
        {you ? t("leaderboard.you") : name}
      </span>
      <span className="type-callout text-text-2 tabular-nums">{t("xp.total", { xp })}</span>
    </div>
  );
}

/**
 * A series heading with partner co-branding. The partner name is set in the
 * same type as Briddhi's, so it reads as a partnership, not an ad.
 */
export function SeriesHeader({
  titleBn,
  titleEn,
  descriptionBn,
  descriptionEn,
  partner,
  done,
  total,
}: {
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  partner: string;
  done: number;
  total: number;
}) {
  const t = useT();
  return (
    <header className="flex flex-col gap-2">
      <p className="type-callout text-text-2" lang="en">
        Briddhi <span className="text-text-3">×</span>{" "}
        <span className="text-text-1 font-semibold">{partner}</span>
      </p>
      <h2 className="type-title-2 text-text-1">
        <Bi bn={titleBn} en={titleEn} />
      </h2>
      <p className="type-body measure text-text-2">
        <Bi bn={descriptionBn} en={descriptionEn} />
      </p>
      <div className="mt-1 flex items-center gap-3">
        <div className="bg-line h-1 w-24 overflow-hidden rounded-full" aria-hidden>
          <div
            className="bg-action h-full"
            style={{ width: `${(done / Math.max(total, 1)) * 100}%` }}
          />
        </div>
        <span className="type-footnote text-text-2">{t("series.progress", { done, total })}</span>
      </div>
    </header>
  );
}

/** Loading placeholder. Static on purpose: no shimmer, no ambient motion. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rounded-chip bg-surface", className)} />;
}
