import { formatNumber, type Locale } from "@/lib/i18n/locales";

/** 252 → "4:12" (or "৪:১২" in Bangla). Hours appear only when needed. */
export function formatTime(totalSeconds: number, locale: Locale): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const n = (v: number, pad = false) =>
    formatNumber(v, locale).padStart(pad ? 2 : 1, locale === "bn" ? "০" : "0");
  return hours > 0
    ? `${n(hours)}:${n(minutes, true)}:${n(seconds, true)}`
    : `${n(minutes)}:${n(seconds, true)}`;
}
