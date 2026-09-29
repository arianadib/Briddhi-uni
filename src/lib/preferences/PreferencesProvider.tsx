"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { dictionaries, interpolate, type MessageKey } from "@/lib/i18n/dictionaries";
import { formatNumber, type Locale } from "@/lib/i18n/locales";
import { LOCALE_COOKIE, THEME_COOKIE, writePreferenceCookie, type Theme } from "./cookies";

type Preferences = {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

/**
 * Holds language and theme. Both switch instantly on the client (no reload,
 * no round trip) and are saved to cookies so the next server render matches.
 */
export function PreferencesProvider({
  initialLocale,
  initialTheme,
  children,
}: {
  initialLocale: Locale;
  initialTheme: Theme;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [theme, setThemeState] = useState(initialTheme);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    writePreferenceCookie(LOCALE_COOKIE, next);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    const root = document.documentElement;
    if (next === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
    writePreferenceCookie(THEME_COOKIE, next);
  }, []);

  const value = useMemo(
    () => ({ locale, theme, setLocale, setTheme }),
    [locale, theme, setLocale, setTheme],
  );
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): Preferences {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return context;
}

export function useLocale(): Locale {
  return usePreferences().locale;
}

/**
 * Returns a translate function for the current language. Numeric values are
 * formatted in that language, so {xp: 10} renders as ১০ in Bangla.
 */
export function useT() {
  const locale = useLocale();
  return useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const formatted = vars
        ? Object.fromEntries(
            Object.entries(vars).map(([name, v]) => [
              name,
              typeof v === "number" ? formatNumber(v, locale) : v,
            ]),
          )
        : undefined;
      return interpolate(dictionaries[locale][key], formatted);
    },
    [locale],
  );
}

/** Renders whichever of two content strings matches the current language. */
export function Bi({ bn, en }: { bn: string; en: string }) {
  return <>{useLocale() === "bn" ? bn : en}</>;
}
