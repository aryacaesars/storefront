import type { TemplateId } from "./schema"

export interface ThemePalette {
  bg: string
  text: string
  muted: string
}

export const THEME_PALETTES: Record<TemplateId, ThemePalette> = {
  minimalist: {
    bg: "#F9F9FB",
    text: "#1A2B3C",
    muted: "#64748B",
  },
  bold: {
    bg: "#0D0E10",
    text: "#F5F5F5",
    muted: "#9CA3AF",
  },
  fashion: {
    bg: "#FAFAF8",
    text: "#1C1C1A",
    muted: "#9C8F7E",
  },
  bento: {
    bg: "#F5F5F5",
    text: "#1A1A1A",
    muted: "#888888",
  },
}

export function getThemePalette(templateId: TemplateId): ThemePalette {
  return THEME_PALETTES[templateId]
}
