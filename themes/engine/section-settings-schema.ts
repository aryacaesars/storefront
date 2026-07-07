import type { TemplateId } from "@/themes/engine/schema"

export type SectionSettingFieldType = "text" | "textarea" | "image" | "url" | "color" | "segmented"

export type SectionSettingOption = {
  value: string
  label: string
}

export type SectionSettingField = {
  key: string
  label: string
  type: SectionSettingFieldType
  placeholder?: string
  hint?: string
  options?: SectionSettingOption[]
  /** Bento category-grid: only show this field for block indices listed here. */
  slots?: number[]
}

const MINIMALIST_SECTION_SETTINGS: Record<string, SectionSettingField[]> = {
  "product-grid": [
    {
      key: "title",
      label: "Heading",
      type: "text",
      placeholder: "Trending Now",
    },
  ],
  "call-to-action": [
    {
      key: "title",
      label: "Heading",
      type: "text",
      placeholder: "Experience the Art of Less",
    },
    {
      key: "primaryLabel",
      label: "Primary button",
      type: "text",
      placeholder: "Explore Collections",
    },
    {
      key: "secondaryLabel",
      label: "Secondary button",
      type: "text",
      placeholder: "Read the Journal",
    },
  ],
}

const BOLD_SECTION_SETTINGS: Record<string, SectionSettingField[]> = {
  "call-to-action": [
    {
      key: "title",
      label: "Heading",
      type: "text",
      placeholder: "BECOME PART OF THE MOMENTUM.",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      type: "textarea",
      placeholder: "Join the elite circle of athletes…",
    },
    {
      key: "primaryLabel",
      label: "Primary button",
      type: "text",
      placeholder: "SHOP THE SERIES",
    },
    {
      key: "secondaryLabel",
      label: "Secondary button",
      type: "text",
      placeholder: "OUR STORY",
    },
  ],
}

const FASHION_SECTION_SETTINGS: Record<string, SectionSettingField[]> = {
  "newsletter-cta": [
    {
      key: "title",
      label: "Heading",
      type: "text",
      placeholder: "Join Our World",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      type: "textarea",
      placeholder: "Sign up for early access…",
    },
  ],
}

const BENTO_SECTION_SETTINGS: Record<string, SectionSettingField[]> = {
  "product-grid": MINIMALIST_SECTION_SETTINGS["product-grid"],
  "call-to-action": MINIMALIST_SECTION_SETTINGS["call-to-action"],
}

const SECTION_SETTINGS_BY_TEMPLATE: Partial<
  Record<TemplateId, Record<string, SectionSettingField[]>>
> = {
  minimalist: MINIMALIST_SECTION_SETTINGS,
  bold: BOLD_SECTION_SETTINGS,
  fashion: FASHION_SECTION_SETTINGS,
  bento: BENTO_SECTION_SETTINGS,
}

export function getSectionSettingFields(
  templateId: TemplateId,
  sectionType: string,
): SectionSettingField[] {
  return SECTION_SETTINGS_BY_TEMPLATE[templateId]?.[sectionType] ?? []
}

export function sectionHasSettings(
  templateId: TemplateId,
  sectionType: string,
): boolean {
  return getSectionSettingFields(templateId, sectionType).length > 0
}

/** Read a string from section instance settings with fallback. */
export function getStringSetting(
  settings: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const value = settings?.[key]
  return typeof value === "string" && value.trim() !== "" ? value : fallback
}
