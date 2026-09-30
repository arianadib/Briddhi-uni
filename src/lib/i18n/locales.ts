export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

const numberFormats: Record<Locale, Intl.NumberFormat> = {
  bn: new Intl.NumberFormat("bn-BD"),
  en: new Intl.NumberFormat("en-US"),
};

/** Formats a number in the learner's language: ১,২৪০ in Bangla, 1,240 in English. */
export function formatNumber(value: number, locale: Locale): string {
  return numberFormats[locale].format(value);
}

/** Option letters for answers: ক খ গ ঘ in Bangla, A B C D in English. */
export const optionLetters: Record<Locale, readonly string[]> = {
  bn: ["ক", "খ", "গ", "ঘ"],
  en: ["A", "B", "C", "D"],
};
