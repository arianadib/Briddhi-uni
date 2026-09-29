import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { LOCALE_COOKIE, THEME_COOKIE, isTheme, type Theme } from "./cookies";

/** Reads the learner's language and theme so the first paint is already right. */
export async function readPreferences(): Promise<{ locale: Locale; theme: Theme }> {
  const store = await cookies();
  const locale = store.get(LOCALE_COOKIE)?.value;
  const theme = store.get(THEME_COOKIE)?.value;
  return {
    locale: isLocale(locale) ? locale : defaultLocale,
    theme: isTheme(theme) ? theme : "system",
  };
}
