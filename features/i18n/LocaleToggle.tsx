"use client"

import { useLocale } from "@/features/i18n/LocaleProvider"
import { cn } from "@/lib/utils"
import type { Locale } from "@/features/i18n/config"

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale, messages } = useLocale()

  function select(next: Locale) {
    if (next === locale) return
    setLocale(next)
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-white/70 p-0.5 text-[11px] font-semibold",
        className,
      )}
      role="group"
      aria-label={messages.locale.label}
    >
      <button
        type="button"
        onClick={() => select("id")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "id" ? "bg-ink text-white" : "text-slate-500 hover:text-ink",
        )}
        aria-pressed={locale === "id"}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => select("en")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "en" ? "bg-ink text-white" : "text-slate-500 hover:text-ink",
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  )
}
