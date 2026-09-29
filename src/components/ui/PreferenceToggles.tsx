"use client";

import { usePreferences, useT } from "@/lib/preferences/PreferencesProvider";
import type { Locale } from "@/lib/i18n/locales";
import type { Theme } from "@/lib/preferences/cookies";
import { SegmentedControl } from "./SegmentedControl";

/** বাংলা / English. Each label is written in its own language and script. */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = usePreferences();
  const t = useT();
  return (
    <SegmentedControl<Locale>
      label={t("lang.label")}
      value={locale}
      onChange={setLocale}
      className={className}
      segments={[
        { value: "bn", label: "বাংলা", lang: "bn" },
        { value: "en", label: "English", lang: "en" },
      ]}
    />
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = usePreferences();
  const t = useT();
  return (
    <SegmentedControl<Theme>
      label={t("theme.label")}
      value={theme}
      onChange={setTheme}
      className={className}
      segments={[
        { value: "system", label: t("theme.system") },
        { value: "light", label: t("theme.light") },
        { value: "dark", label: t("theme.dark") },
      ]}
    />
  );
}
