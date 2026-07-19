import { fontLabelToCss } from "@/lib/themes/fonts"

export interface HeroTitleStyleOverride {
  color: string | undefined
  fontFamily: string | undefined
  fontWeight: number | undefined
  fontStyle: "normal" | "italic" | undefined
  /** Multiplier on the box-derived font size (0.5–1.5, default 1). */
  sizeScale: number
  /** Letter spacing in em (−0.1–0.5). */
  letterSpacing: number | undefined
  /** Unitless line-height (0.8–2). */
  lineHeight: number | undefined
  textDecoration: "underline" | "none" | undefined
  textTransform: "uppercase" | "capitalize" | "none" | undefined
  /** Opacity 0–100 (100 = opaque). */
  opacity: number
}

const VALID_WEIGHTS = new Set([100, 200, 300, 400, 500, 600, 700, 800, 900])

/** Settings keys that make up a title-line style (without the line prefix). */
export const HERO_TITLE_STYLE_KEYS = [
  "Color",
  "FontFamily",
  "FontWeight",
  "FontStyle",
  "SizeScale",
  "LetterSpacing",
  "LineHeight",
  "TextDecoration",
  "TextTransform",
  "Opacity",
] as const

function num(value: unknown): number | undefined {
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Parse per-title style overrides from block settings.
 * Settings keys: `${line}Color`, `${line}FontFamily`, `${line}FontWeight`,
 * `${line}FontStyle`, `${line}SizeScale`, `${line}LetterSpacing`,
 * `${line}LineHeight`, `${line}TextDecoration`, `${line}TextTransform`,
 * `${line}Opacity` — for line "title1" | "title2".
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
  const sizeScale = num(settings?.[`${line}SizeScale`])
  const letterSpacing = num(settings?.[`${line}LetterSpacing`])
  const lineHeight = num(settings?.[`${line}LineHeight`])
  const textDecoration = settings?.[`${line}TextDecoration`]
  const textTransform = settings?.[`${line}TextTransform`]
  const opacity = num(settings?.[`${line}Opacity`])

  return {
    color: typeof color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : undefined,
    fontFamily:
      typeof fontFamily === "string" && fontFamily ? fontLabelToCss(fontFamily) : undefined,
    fontWeight: VALID_WEIGHTS.has(weight) ? weight : undefined,
    fontStyle: fontStyle === "italic" ? "italic" : fontStyle === "normal" ? "normal" : undefined,
    sizeScale: sizeScale !== undefined ? clamp(sizeScale, 0.5, 1.5) : 1,
    letterSpacing: letterSpacing !== undefined ? clamp(letterSpacing, -0.1, 0.5) : undefined,
    lineHeight: lineHeight !== undefined ? clamp(lineHeight, 0.8, 2) : undefined,
    textDecoration:
      textDecoration === "underline" ? "underline" : textDecoration === "none" ? "none" : undefined,
    textTransform:
      textTransform === "uppercase"
        ? "uppercase"
        : textTransform === "capitalize"
          ? "capitalize"
          : textTransform === "none"
            ? "none"
            : undefined,
    opacity: opacity !== undefined ? clamp(opacity, 0, 100) : 100,
  }
}

/**
 * Override-only CSS (letter/line spacing, decoration, transform, opacity) —
 * layered ON TOP of each theme's bespoke base style so theme defaults survive.
 */
export function heroTitleOverrideCss(
  styleOverride: HeroTitleStyleOverride,
): React.CSSProperties {
  return {
    ...(styleOverride.letterSpacing !== undefined && {
      letterSpacing: `${styleOverride.letterSpacing}em`,
    }),
    ...(styleOverride.lineHeight !== undefined && {
      lineHeight: styleOverride.lineHeight,
    }),
    ...(styleOverride.textDecoration && {
      textDecoration: styleOverride.textDecoration,
    }),
    ...(styleOverride.textTransform && {
      textTransform: styleOverride.textTransform,
    }),
    ...(styleOverride.opacity !== 100 && { opacity: styleOverride.opacity / 100 }),
  }
}

/** CSS for a title line from its box height + overrides (shared by hero renderers). */
export function heroTitleLineCss(
  styleOverride: HeroTitleStyleOverride,
  labelBoxHeightPx: number,
  minFontPx = 14,
): React.CSSProperties {
  return {
    fontFamily: styleOverride.fontFamily ?? "var(--theme-heading-font)",
    fontSize: `${Math.max(minFontPx, labelBoxHeightPx * 0.72 * styleOverride.sizeScale)}px`,
    lineHeight: 1.05,
    fontWeight: styleOverride.fontWeight ?? 700,
    fontStyle: styleOverride.fontStyle ?? "normal",
    ...(styleOverride.color && { color: styleOverride.color }),
    ...heroTitleOverrideCss(styleOverride),
  }
}

/**
 * Copy-style payload: extract a line's SET style keys (line-prefix stripped).
 * Only meaningful values are captured; returns null when the line has no
 * overrides at all — paste with an empty clipboard would otherwise wipe the
 * target's styles.
 */
export function extractHeroTitleStyle(
  settings: Record<string, unknown> | undefined,
  line: "title1" | "title2",
): Record<string, unknown> | null {
  const out: Record<string, unknown> = {}
  for (const key of HERO_TITLE_STYLE_KEYS) {
    const value = settings?.[`${line}${key}`]
    if (value === undefined || value === null || value === "") continue
    out[key] = value
  }
  return Object.keys(out).length > 0 ? out : null
}

/**
 * Paste-style payload: re-prefix captured style keys for the target line.
 * Non-destructive — only keys present in the copied payload are written, so
 * pasting never clears styles the source didn't define.
 */
export function applyHeroTitleStylePatch(
  style: Record<string, unknown>,
  line: "title1" | "title2",
): Record<string, unknown> {
  const patch: Record<string, unknown> = {}
  for (const key of HERO_TITLE_STYLE_KEYS) {
    const value = style[key]
    if (value === undefined || value === null || value === "") continue
    patch[`${line}${key}`] = value
  }
  return patch
}
