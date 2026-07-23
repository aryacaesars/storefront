"use client"

import { useMessages } from "@/features/i18n/LocaleProvider"
import { ImageUploadField } from "@/features/builder/components/ImageUploadField"
import {
  SegmentedControl,
  SettingsField,
  SettingsInput,
  SettingsTextarea,
} from "@/features/builder/components/SettingsSection"
import {
  BODY_FONT_OPTIONS,
  fontCssToLabel,
  fontLabelToCss,
  HEADING_FONT_OPTIONS,
} from "@/lib/themes/fonts"
import type { SettingsGroupDef, SettingFieldDef } from "@/themes/engine/settings-schema"
import {
  heroConfigSchema,
  type HeroConfig,
  type ThemeConfig,
} from "@/themes/engine/schema"

const DEFAULT_HERO: HeroConfig = heroConfigSchema.parse({})

interface FieldTextOverride {
  label: string
  hint?: string
  placeholder?: string
}

/** Dictionary lookups keyed by schema id/title — schema itself stays untouched. */
interface ThemeSettingsDict {
  groups: Record<string, string>
  groupDescriptions: Record<string, string>
  fields: Record<string, FieldTextOverride | undefined>
  options: Record<string, string>
}

function useThemeSettingsDict(): ThemeSettingsDict {
  const dict = useMessages().pages.builder.themeSettings
  return {
    groups: dict.groups as Record<string, string>,
    groupDescriptions: dict.groupDescriptions as Record<string, string>,
    fields: dict.fields as Record<string, FieldTextOverride | undefined>,
    options: dict.options as Record<string, string>,
  }
}

interface SettingsGroupsFormProps {
  groups: SettingsGroupDef[]
  config: ThemeConfig
  onConfigChange: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void
  onHeroChange: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void
  className?: string
}

export function SettingsGroupsForm({
  groups,
  config,
  onConfigChange,
  onHeroChange,
  className,
}: SettingsGroupsFormProps) {
  const dict = useThemeSettingsDict()
  const hero = { ...DEFAULT_HERO, ...config.hero }

  return (
    <div className={className ?? "flex flex-col gap-6"}>
      {groups.map((group, index) => (
        <div
          key={group.title}
          className={index > 0 ? "border-t border-gray-100 pt-5" : undefined}
        >
          <h3 className="text-sm font-semibold text-gray-900">
            {dict.groups[group.title] ?? group.title}
          </h3>
          {group.description && (
            <p className="mt-1 text-xs text-gray-400">
              {dict.groupDescriptions[group.description] ?? group.description}
            </p>
          )}
          <div className="mt-3 flex flex-col gap-4">
            {group.fields.map((field) => (
              <SettingFieldRenderer
                key={`${field.scope}.${field.id}`}
                field={field}
                config={config}
                hero={hero}
                onConfigChange={onConfigChange}
                onHeroChange={onHeroChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface SettingFieldRendererProps {
  field: SettingFieldDef
  config: ThemeConfig
  hero: HeroConfig
  onConfigChange: SettingsGroupsFormProps["onConfigChange"]
  onHeroChange: SettingsGroupsFormProps["onHeroChange"]
}

function SettingFieldRenderer({
  field,
  config,
  hero,
  onConfigChange,
  onHeroChange,
}: SettingFieldRendererProps) {
  const dict = useThemeSettingsDict()
  const value =
    field.scope === "hero"
      ? (hero[field.id as keyof HeroConfig] as string | number | undefined)
      : (config[field.id as keyof ThemeConfig] as string | number | undefined)

  const override = dict.fields[field.id]
  const label = override?.label ?? field.label
  const hint = override?.hint ?? field.hint
  const placeholder = override?.placeholder ?? field.placeholder

  return (
    <SettingsField label={label} hint={hint}>
      {field.type === "text" && (
        <SettingsInput
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) =>
            field.scope === "hero"
              ? onHeroChange(field.id as keyof HeroConfig, e.target.value)
              : onConfigChange(field.id as keyof ThemeConfig, e.target.value)
          }
        />
      )}

      {field.type === "textarea" && (
        <SettingsTextarea
          rows={field.rows ?? 2}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) =>
            field.scope === "hero"
              ? onHeroChange(field.id as keyof HeroConfig, e.target.value)
              : onConfigChange(field.id as keyof ThemeConfig, e.target.value)
          }
        />
      )}

      {field.type === "color" && (
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-gray-200">
            <input
              type="color"
              value={config.primaryColor}
              onChange={(e) => onConfigChange("primaryColor", e.target.value)}
              className="absolute inset-0 h-14 w-14 -translate-x-2 -translate-y-2 cursor-pointer opacity-0"
            />
            <div
              className="h-full w-full"
              style={{ backgroundColor: config.primaryColor }}
            />
          </div>
          <SettingsInput
            value={config.primaryColor}
            onChange={(e) => onConfigChange("primaryColor", e.target.value)}
            className="font-mono uppercase"
          />
        </div>
      )}

      {field.type === "image" && (
        <ImageUploadField
          value={typeof value === "string" ? value : undefined}
          placeholder={placeholder ?? "Upload"}
          onChange={(url) =>
            field.scope === "hero"
              ? onHeroChange(field.id as keyof HeroConfig, url)
              : onConfigChange(field.id as keyof ThemeConfig, url)
          }
        />
      )}

      {field.type === "segmented" && field.options && (
        <SegmentedControl
          value={(value as string) ?? field.options[0].value}
          options={field.options.map((option) => ({
            ...option,
            label: dict.options[option.value] ?? option.label,
          }))}
          onChange={(v) =>
            field.scope === "hero"
              ? onHeroChange(field.id as keyof HeroConfig, v as HeroConfig[keyof HeroConfig])
              : onConfigChange(
                  field.id as keyof ThemeConfig,
                  v as ThemeConfig[keyof ThemeConfig],
                )
          }
        />
      )}

      {field.type === "font-heading" && (
        <select
          value={fontCssToLabel(config.headingFont)}
          onChange={(e) => onConfigChange("headingFont", fontLabelToCss(e.target.value))}
          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-indigo-500/30"
        >
          {HEADING_FONT_OPTIONS.map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select>
      )}

      {field.type === "slider" && (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={typeof value === "number" ? value : field.defaultValue ?? 0}
            onChange={(e) =>
              field.scope === "hero"
                ? onHeroChange(
                    field.id as keyof HeroConfig,
                    Number(e.target.value) as unknown as HeroConfig[keyof HeroConfig],
                  )
                : onConfigChange(
                    field.id as keyof ThemeConfig,
                    Number(e.target.value) as unknown as ThemeConfig[keyof ThemeConfig],
                  )
            }
            className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
          />
          <span className="w-12 shrink-0 text-right text-xs font-medium text-gray-500">
            {typeof value === "number" ? value : field.defaultValue ?? 0}
            {field.unit ?? ""}
          </span>
        </div>
      )}

      {field.type === "font-body" && (
        <select
          value={fontCssToLabel(config.bodyFont)}
          onChange={(e) => onConfigChange("bodyFont", fontLabelToCss(e.target.value))}
          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-indigo-500/30"
        >
          {BODY_FONT_OPTIONS.map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select>
      )}
    </SettingsField>
  )
}

