import {
  DESIGN_WIDTH,
  MOBILE_DESIGN_WIDTH,
  MIN_WIDTH_PCT,
  type CategoryCardLayout,
} from "@/themes/bento/sections/category-grid-layout"

export const HERO_DESIGN_WIDTH = DESIGN_WIDTH
export const HERO_DESIGN_HEIGHT = 580
export const HERO_MOBILE_DESIGN_WIDTH = MOBILE_DESIGN_WIDTH

export const MIN_CTA_HEIGHT = 36
export const MAX_CTA_HEIGHT = 120

/** Title position in design px (scaled at render). */
export const HERO_TITLE_LEFT = 40
export const HERO_TITLE_TOP = 56
export const HERO_TITLE_FONT_BASE = 80

export const HERO_TITLE_LEFT_MOBILE = 24
export const HERO_TITLE_TOP_MOBILE = 40
export const HERO_TITLE_FONT_BASE_MOBILE = 52

export type HeroCtaData = {
  label: string
  bgColor: string
  textColor: string
  layout: CategoryCardLayout
  /** True when block has no ctaBgColor override — follows theme primaryColor. */
  bgFromTheme?: boolean
  /** True when block has no ctaTextColor override — follows default (#ffffff). */
  textFromTheme?: boolean
  /** Corner radius override in design px; null = theme default shape. */
  radius?: number | null
}

export const MAX_CTA_RADIUS = 60

export function parseCtaRadius(
  settings: Record<string, unknown> | undefined,
): number | null {
  const raw = settings?.ctaRadius
  if (raw == null || raw === "") return null
  const n = Number(raw)
  if (!Number.isFinite(n)) return null
  return clamp(Math.round(n), 0, MAX_CTA_RADIUS)
}

export type HeroCtaThemeFallback = {
  primaryColor?: string
  defaultTextColor?: string
}

export function resolveHeroCtaColors(
  settings: Record<string, unknown> | undefined,
  theme: HeroCtaThemeFallback = {},
): Pick<HeroCtaData, "bgColor" | "textColor" | "bgFromTheme" | "textFromTheme"> {
  const primaryColor = theme.primaryColor?.trim() || "#3D4F6F"
  const defaultTextColor = theme.defaultTextColor?.trim() || "#ffffff"

  const rawBg =
    typeof settings?.ctaBgColor === "string" ? settings.ctaBgColor.trim() : ""
  const rawText =
    typeof settings?.ctaTextColor === "string" ? settings.ctaTextColor.trim() : ""

  return {
    bgColor: rawBg || primaryColor,
    textColor: rawText || defaultTextColor,
    bgFromTheme: rawBg === "",
    textFromTheme: rawText === "",
  }
}

export const DEFAULT_CTA_LAYOUT_DESKTOP: CategoryCardLayout = {
  xPct: 70,
  wPct: 24,
  yPx: 459,
  hPx: 56,
}

export const DEFAULT_CTA_LAYOUT_MOBILE: CategoryCardLayout = {
  xPct: 8,
  wPct: 84,
  yPx: 510,
  hPx: 52,
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function hasBoxLayout(settings: Record<string, unknown> | undefined): boolean {
  return (
    settings != null &&
    ("xPct" in settings || "wPct" in settings || "yPx" in settings || "hPx" in settings)
  )
}

/** Convert legacy center+scale CTA settings into a bounding box. */
function legacyToLayout(
  ctaXPct: number,
  ctaYPct: number,
  ctaScale: number,
  designHeight = HERO_DESIGN_HEIGHT,
): CategoryCardLayout {
  const wPct = clamp(Math.round((280 * ctaScale) / 100 / (HERO_DESIGN_WIDTH / 100)), MIN_WIDTH_PCT, 50)
  const hPx = clamp(Math.round((56 * ctaScale) / 100), MIN_CTA_HEIGHT, MAX_CTA_HEIGHT)
  const xPct = clamp(Math.round(ctaXPct - wPct / 2), 0, 100 - wPct)
  const centerY = (ctaYPct / 100) * designHeight
  const yPx = clamp(Math.round(centerY - hPx / 2), 0, designHeight - hPx)
  return { xPct, wPct, yPx, hPx }
}

function parseLayout(
  settings: Record<string, unknown> | undefined,
  fallback: CategoryCardLayout,
  designHeight = HERO_DESIGN_HEIGHT,
): CategoryCardLayout {
  if (!hasBoxLayout(settings)) {
    if (
      settings &&
      ("ctaXPct" in settings || "ctaYPct" in settings || "ctaScale" in settings)
    ) {
      return legacyToLayout(
        num(settings.ctaXPct, 82),
        num(settings.ctaYPct, 84),
        num(settings.ctaScale, 100),
        designHeight,
      )
    }
    return fallback
  }

  return {
    xPct: clamp(Math.round(num(settings?.xPct, fallback.xPct)), 0, 100 - MIN_WIDTH_PCT),
    wPct: clamp(Math.round(num(settings?.wPct, fallback.wPct)), MIN_WIDTH_PCT, 100),
    yPx: clamp(Math.round(num(settings?.yPx, fallback.yPx)), 0, designHeight - MIN_CTA_HEIGHT),
    hPx: clamp(
      Math.round(num(settings?.hPx, fallback.hPx)),
      MIN_CTA_HEIGHT,
      MAX_CTA_HEIGHT,
    ),
  }
}

export function parseHeroCta(
  settings: Record<string, unknown> | undefined,
  fallbackLabel: string,
  isMobile = false,
  theme?: HeroCtaThemeFallback,
  designHeight = HERO_DESIGN_HEIGHT,
): HeroCtaData {
  const layoutFallback = isMobile ? DEFAULT_CTA_LAYOUT_MOBILE : DEFAULT_CTA_LAYOUT_DESKTOP
  const colors = resolveHeroCtaColors(settings, theme)

  return {
    label:
      typeof settings?.label === "string" && settings.label.trim()
        ? settings.label
        : fallbackLabel,
    ...colors,
    radius: parseCtaRadius(settings),
    layout: parseLayout(settings, layoutFallback, designHeight),
  }
}
