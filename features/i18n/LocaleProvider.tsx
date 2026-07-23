"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
  LOCALE_COOKIE,
  parseLocale,
  type Locale,
} from "@/features/i18n/config"
import { getMessages, type Messages } from "@/features/i18n/messages"

type LocaleContextValue = {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`
  try {
    window.localStorage.setItem(LOCALE_COOKIE, locale)
  } catch {
    // ignore
  }
  document.documentElement.lang = locale === "id" ? "id" : "en"
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: ReactNode
}) {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback(
    (next: Locale) => {
      const parsed = parseLocale(next)
      setLocaleState(parsed)
      persistLocale(parsed)
      router.refresh()
    },
    [router],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      messages: getMessages(locale),
      setLocale,
    }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return ctx
}

export function useMessages(): Messages {
  return useLocale().messages
}

/** Versi optional — null di luar provider (storefront live). */
export function useOptionalMessages(): Messages | null {
  return useContext(LocaleContext)?.messages ?? null
}
