import type { Locale } from "@/lib/i18n/locales";

export const LOCALE_COOKIE = "uni_locale";
export const THEME_COOKIE = "uni_theme";

export const themes = ["system", "light", "dark"] as const;
export type Theme = (typeof themes)[number];

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (themes as readonly string[]).includes(value);
}

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Persists a preference from the browser so the next server render matches. */
export function writePreferenceCookie(name: typeof LOCALE_COOKIE, value: Locale): void;
export function writePreferenceCookie(name: typeof THEME_COOKIE, value: Theme): void;
export function writePreferenceCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}
