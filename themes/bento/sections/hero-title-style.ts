import { fontLabelToCss } from "@/lib/themes/fonts"

export interface HeroTitleStyleOverride {
  color: string | undefined
  fontFamily: string | undefined
  fontWeight: number | undefined
  fontStyle: "normal" | "italic" | undefined
}

const VALID_WEIGHTS = new Set([100, 200, 300, 400, 500, 600, 700, 800, 900])

/**
 * Parse per-title style overrides from block settings.
 * Settings keys: title1Color, title1FontFamily, title1FontWeight, title1FontStyle
 *                title2Color, title2FontFamily, title2FontWeight, title2FontStyle
 * Returns undefined for each field when not set — component falls back to theme default.
 */
export function parseHeroTitleStyle(
  settings: Record<string, unknown> | undefined,
  line: "title1" | "title2",
): HeroTitleStyleOverride {
  const color = settings?.[`${line}Color`]
  const fontFamily = settings?.[`${line}FontFamily`]
  const fontWeight = settings?.[`${line}FontWeight`]
  const fontStyle = settings?.[`${line}FontStyle`]
  const weight = Number(fontWeight)
  return {
    color: typeof color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : undefined,
    fontFamily:
      typeof fontFamily === "string" && fontFamily ? fontLabelToCss(fontFamily) : undefined,
    fontWeight: VALID_WEIGHTS.has(weight) ? weight : undefined,
    fontStyle: fontStyle === "italic" ? "italic" : fontStyle === "normal" ? "normal" : undefined,
  }
}
