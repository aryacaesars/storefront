"use client"

import { cn } from "@/lib/utils"
import {
  getPasswordStrength,
  type PasswordStrengthLevel,
} from "@/features/auth/password-rules"
import { useMessages } from "@/features/i18n/LocaleProvider"

const BAR_COLOR: Record<Exclude<PasswordStrengthLevel, "empty">, string> = {
  weak: "bg-red-500",
  fair: "bg-amber-400",
  strong: "bg-emerald-500",
}

const LABEL_COLOR: Record<Exclude<PasswordStrengthLevel, "empty">, string> = {
  weak: "text-red-600",
  fair: "text-amber-600",
  strong: "text-emerald-600",
}

export function PasswordStrengthBar({ password }: { password: string }) {
  const t = useMessages()
  const strength = getPasswordStrength(password)
  if (strength.level === "empty") return null

  const label =
    strength.level === "weak"
      ? t.auth.strengthWeak
      : strength.level === "fair"
        ? t.auth.strengthFair
        : t.auth.strengthStrong

  return (
    <div className="space-y-1.5 px-0.5" aria-live="polite">
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            BAR_COLOR[strength.level],
          )}
          style={{ width: `${strength.percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] leading-none text-slate-400">{t.auth.strengthLabel}</p>
        <p
          className={cn(
            "text-[11px] font-semibold leading-none",
            LABEL_COLOR[strength.level],
          )}
        >
          {label}
        </p>
      </div>
    </div>
  )
}
