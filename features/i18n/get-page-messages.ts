import { getRequestLocale } from "@/features/i18n/LocaleShell"
import { getMessages, type Messages } from "@/features/i18n/messages"

/** Server Components: load copy for the request locale cookie. */
export async function getPageMessages(): Promise<Messages["pages"]> {
  const locale = await getRequestLocale()
  return getMessages(locale).pages
}

export async function getFullMessages(): Promise<Messages> {
  const locale = await getRequestLocale()
  return getMessages(locale)
}
