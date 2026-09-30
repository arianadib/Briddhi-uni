"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { PreferencesProvider } from "@/lib/preferences/PreferencesProvider";
import type { Locale } from "@/lib/i18n/locales";
import type { Theme } from "@/lib/preferences/cookies";

/** Client-side providers for the whole app. */
export function Providers({
  locale,
  theme,
  children,
}: {
  locale: Locale;
  theme: Theme;
  children: ReactNode;
}) {
  return (
    <PreferencesProvider initialLocale={locale} initialTheme={theme}>
      {/* "user" honours prefers-reduced-motion: transforms are skipped, fades stay. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </PreferencesProvider>
  );
}
