"use client"

import { SettingsGroupsForm } from "@/features/builder/components/SettingsGroupsForm"
import { THEME_SETTINGS_GROUPS } from "@/themes/engine/settings-schema"
import type { HeroConfig, ThemeConfig } from "@/themes/engine/schema"

interface ThemeSettingsPanelProps {
  config: ThemeConfig
  onConfigChange: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void
  onHeroChange: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void
}

export function ThemeSettingsPanel({
  config,
  onConfigChange,
  onHeroChange,
}: ThemeSettingsPanelProps) {
  return (
    <div className="p-5">
      <SettingsGroupsForm
        groups={THEME_SETTINGS_GROUPS}
        config={config}
        onConfigChange={onConfigChange}
        onHeroChange={onHeroChange}
      />
    </div>
  )
}
