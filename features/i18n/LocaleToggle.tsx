"use client"

import { useId } from "react"
import { useLocale } from "@/features/i18n/LocaleProvider"
import { cn } from "@/lib/utils"
import type { Locale } from "@/features/i18n/config"

function FlagUk({ className }: { className?: string }) {
  const clipId = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="64" height="64" fill="#012169" />
        <path d="M0 0 L64 64 M64 0 L0 64" stroke="#fff" strokeWidth="10" />
        <path d="M0 0 L64 64 M64 0 L0 64" stroke="#C8102E" strokeWidth="6" />
        <path d="M32 0 V64 M0 32 H64" stroke="#fff" strokeWidth="16" />
        <path d="M32 0 V64 M0 32 H64" stroke="#C8102E" strokeWidth="10" />
      </g>
    </svg>
  )
}

function FlagId({ className }: { className?: string }) {
  const clipId = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="64" height="32" fill="#E70011" />
        <rect y="32" width="64" height="32" fill="#fff" />
      </g>
    </svg>
  )
}

const LOCALE_META: Record<
  Locale,
  { code: string; Flag: typeof FlagUk; switchTo: Locale }
> = {
  en: { code: "EN", Flag: FlagUk, switchTo: "id" },
  id: { code: "ID", Flag: FlagId, switchTo: "en" },
}

export function LocaleToggle({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { locale, setLocale, messages } = useLocale()
  const { code, Flag, switchTo } = LOCALE_META[locale]
  const nextLabel =
    switchTo === "en" ? messages.locale.switchToEn : messages.locale.switchToId

  return (
    <button
      type="button"
      onClick={() => setLocale(switchTo)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 text-slate-700 transition-colors hover:bg-white hover:text-ink",
        compact ? "px-2.5 py-1.5" : "px-2 py-1",
        className,
      )}
      aria-label={nextLabel}
      title={nextLabel}
    >
      <Flag className={cn("shrink-0 rounded-full", compact ? "h-4 w-4" : "h-3.5 w-3.5")} />
      <span
        className={cn(
          "font-semibold tracking-wide",
          compact ? "text-xs" : "text-[11px]",
        )}
      >
        {code}
      </span>
    </button>
  )
}
