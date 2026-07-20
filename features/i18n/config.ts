export const LOCALES = ["id", "en"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_COOKIE = "etalase_locale"

export function parseLocale(value: string | undefined | null): Locale {
  if (value === "en" || value === "id") return value
  return DEFAULT_LOCALE
}
