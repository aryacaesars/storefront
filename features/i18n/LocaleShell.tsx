import { cookies } from "next/headers"
import { LOCALE_COOKIE, parseLocale, type Locale } from "@/features/i18n/config"
import { LocaleProvider } from "@/features/i18n/LocaleProvider"

export async function getRequestLocale(): Promise<Locale> {
  const jar = await cookies()
  return parseLocale(jar.get(LOCALE_COOKIE)?.value)
}

export async function LocaleShell({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale()
  return <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
}
