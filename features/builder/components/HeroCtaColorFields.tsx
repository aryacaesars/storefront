"use client"

import {
  SettingsField,
  SettingsInput,
} from "@/features/builder/components/SettingsSection"
import { resolveHeroCtaColors } from "@/themes/bento/sections/hero-cta-layout"

interface HeroCtaColorFieldsProps {
  settings: Record<string, unknown> | undefined
  primaryColor: string
  onChange: (patch: Record<string, unknown>) => void
}

export function HeroCtaColorFields({
  settings,
  primaryColor,
  onChange,
}: HeroCtaColorFieldsProps) {
  const rawBg =
    typeof settings?.ctaBgColor === "string" ? settings.ctaBgColor.trim() : ""
  const rawText =
    typeof settings?.ctaTextColor === "string" ? settings.ctaTextColor.trim() : ""

  const resolved = resolveHeroCtaColors(settings, { primaryColor })

  return (
    <div className="space-y-3 border-t border-gray-100 pt-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        Warna Tombol
      </p>

      <SettingsField
        label="Warna Latar"
        hint={
          resolved.bgFromTheme
            ? `Mengikuti Theme Settings (${primaryColor})`
            : "Override kustom aktif"
        }
      >
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={resolved.bgColor}
            onChange={(e) => onChange({ ctaBgColor: e.target.value })}
            className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white p-0.5"
          />
          <SettingsInput
            value={rawBg}
            placeholder={primaryColor}
            onChange={(e) => onChange({ ctaBgColor: e.target.value })}
          />
          {!resolved.bgFromTheme && (
            <button
              type="button"
              onClick={() => onChange({ ctaBgColor: "" })}
              className="shrink-0 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
              title="Ikuti Warna Utama dari Theme Settings"
            >
              ↺ Theme
            </button>
          )}
        </div>
      </SettingsField>

      <SettingsField
        label="Warna Teks"
        hint={
          resolved.textFromTheme
            ? "Mengikuti default putih (#ffffff)"
            : "Override kustom aktif"
        }
      >
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={resolved.textColor}
            onChange={(e) => onChange({ ctaTextColor: e.target.value })}
            className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white p-0.5"
          />
          <SettingsInput
            value={rawText}
            placeholder="#ffffff"
            onChange={(e) => onChange({ ctaTextColor: e.target.value })}
          />
          {!resolved.textFromTheme && (
            <button
              type="button"
              onClick={() => onChange({ ctaTextColor: "" })}
              className="shrink-0 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
              title="Reset ke putih default"
            >
              ↺ Default
            </button>
          )}
        </div>
      </SettingsField>
    </div>
  )
}
