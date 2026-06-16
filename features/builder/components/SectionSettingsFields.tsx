"use client"

import {
  SettingsField,
  SettingsInput,
  SettingsTextarea,
} from "@/features/builder/components/SettingsSection"
import {
  getSectionSettingFields,
  type SectionSettingField,
} from "@/themes/engine/section-settings-schema"
import type { TemplateId } from "@/themes/engine/schema"

interface SectionSettingsFieldsProps {
  templateId: TemplateId
  sectionType: string
  settings: Record<string, unknown> | undefined
  onChange: (settings: Record<string, unknown>) => void
}

function renderField(
  field: SectionSettingField,
  value: string,
  onFieldChange: (key: string, next: string) => void,
) {
  if (field.type === "textarea") {
    return (
      <SettingsTextarea
        value={value}
        placeholder={field.placeholder}
        rows={3}
        onChange={(event) => onFieldChange(field.key, event.target.value)}
      />
    )
  }

  return (
    <SettingsInput
      value={value}
      placeholder={field.placeholder}
      onChange={(event) => onFieldChange(field.key, event.target.value)}
    />
  )
}

export function SectionSettingsFields({
  templateId,
  sectionType,
  settings,
  onChange,
}: SectionSettingsFieldsProps) {
  const fields = getSectionSettingFields(templateId, sectionType)
  if (fields.length === 0) {
    return null
  }

  const current = settings ?? {}

  function handleFieldChange(key: string, value: string) {
    onChange({
      ...current,
      [key]: value,
    })
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        const value = typeof current[field.key] === "string" ? current[field.key] : ""
        return (
          <SettingsField key={field.key} label={field.label}>
            {renderField(field, value as string, handleFieldChange)}
          </SettingsField>
        )
      })}
    </div>
  )
}
