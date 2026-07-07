"use client"

import { ImageUploadField } from "@/features/builder/components/ImageUploadField"
import {
  DEFAULT_IMAGE_TRANSFORM,
} from "@/themes/bento/sections/category-grid-layout"
import {
  SegmentedControl,
  SettingsField,
  SettingsInput,
  SettingsTextarea,
} from "@/features/builder/components/SettingsSection"
import type { SectionSettingField } from "@/themes/engine/section-settings-schema"

interface BlockSettingsFieldsProps {
  fields: SectionSettingField[]
  settings: Record<string, unknown> | undefined
  onChange: (settings: Record<string, unknown>) => void
  blockIndex?: number
}

export function BlockSettingsFields({
  fields,
  settings,
  onChange,
  blockIndex,
}: BlockSettingsFieldsProps) {
  const current = settings ?? {}

  function handleImageChange(url: string | undefined) {
    if (url) {
      onChange({
        ...current,
        imageUrl: url,
        ...DEFAULT_IMAGE_TRANSFORM,
      })
      return
    }
    onChange({ ...current, imageUrl: "" })
  }

  function handleFieldChange(key: string, value: string | undefined) {
    onChange({ [key]: value ?? "" })
  }

  const visibleFields = fields.filter(
    (field) => field.slots == null || (blockIndex != null && field.slots.includes(blockIndex)),
  )

  return (
    <div className="space-y-3 border-t border-gray-100 pt-3">
      {visibleFields.map((field) => {
        const raw = current[field.key]
        const value = typeof raw === "string" ? raw : ""

        if (field.type === "image") {
          return (
            <SettingsField key={field.key} label={field.label} hint={field.hint}>
              <ImageUploadField
                value={(value as string) || undefined}
                placeholder={field.placeholder ?? "Upload Gambar"}
                onChange={handleImageChange}
              />
            </SettingsField>
          )
        }

        if (field.type === "segmented" && field.options?.length) {
          return (
            <SettingsField key={field.key} label={field.label} hint={field.hint}>
              <SegmentedControl
                value={(value as string) || field.options[0].value}
                options={field.options}
                onChange={(next) => handleFieldChange(field.key, next)}
              />
            </SettingsField>
          )
        }

        if (field.type === "color") {
          return (
            <SettingsField key={field.key} label={field.label} hint={field.hint}>
              <input
                type="color"
                value={value || "#ffffff"}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="h-9 w-full cursor-pointer rounded-lg border border-gray-200 bg-white"
              />
            </SettingsField>
          )
        }

        if (field.type === "textarea") {
          return (
            <SettingsField key={field.key} label={field.label}>
              <SettingsTextarea
                value={value as string}
                placeholder={field.placeholder}
                rows={2}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              />
            </SettingsField>
          )
        }

        return (
          <SettingsField key={field.key} label={field.label}>
            <SettingsInput
              value={value as string}
              placeholder={field.placeholder}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            />
          </SettingsField>
        )
      })}
    </div>
  )
}
