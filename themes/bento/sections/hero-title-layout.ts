import {
  MIN_LABEL_PCT,
  type CategoryLabelLayout,
} from "@/themes/bento/sections/category-grid-layout"
import {
  HERO_DESIGN_HEIGHT,
  HERO_DESIGN_WIDTH,
  HERO_MOBILE_DESIGN_WIDTH,
  HERO_TITLE_FONT_BASE,
  HERO_TITLE_FONT_BASE_MOBILE,
  HERO_TITLE_LEFT,
  HERO_TITLE_LEFT_MOBILE,
  HERO_TITLE_TOP,
  HERO_TITLE_TOP_MOBILE,
} from "@/themes/bento/sections/hero-cta-layout"

export type HeroTitleLine = "title1" | "title2"

const LINE_PREFIX: Record<HeroTitleLine, string> = {
  title1: "title1Label",
  title2: "title2Label",
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function roundPct(value: number): number {
  return Math.round(value * 10) / 10
}

function hasTitleLabelBox(
  settings: Record<string, unknown> | undefined,
  line: HeroTitleLine,
): boolean {
  const prefix = LINE_PREFIX[line]
  return (
    settings != null &&
    (`${prefix}XPct` in settings ||
      `${prefix}YPct` in settings ||
      `${prefix}WPct` in settings ||
      `${prefix}HPct` in settings)
  )
}

export function defaultHeroTitle1Layout(isMobile: boolean): CategoryLabelLayout {
  const designW = isMobile ? HERO_MOBILE_DESIGN_WIDTH : HERO_DESIGN_WIDTH
  const left = isMobile ? HERO_TITLE_LEFT_MOBILE : HERO_TITLE_LEFT
  const top = isMobile ? HERO_TITLE_TOP_MOBILE : HERO_TITLE_TOP
  const fontBase = isMobile ? HERO_TITLE_FONT_BASE_MOBILE : HERO_TITLE_FONT_BASE

  return {
    xPct: roundPct((left / designW) * 100),
    yPct: roundPct((top / HERO_DESIGN_HEIGHT) * 100),
    wPct: isMobile ? 88 : 55,
    hPct: roundPct((fontBase / HERO_DESIGN_HEIGHT) * 100),
  }
}

export function defaultHeroTitle2Layout(
  isMobile: boolean,
  title1?: CategoryLabelLayout,
): CategoryLabelLayout {
  const t1 = title1 ?? defaultHeroTitle1Layout(isMobile)
  return {
    xPct: t1.xPct,
    yPct: roundPct(t1.yPct + t1.hPct),
    wPct: t1.wPct,
    hPct: t1.hPct,
  }
}

export function parseHeroTitleLayout(
  settings: Record<string, unknown> | undefined,
  line: HeroTitleLine,
  isMobile: boolean,
): CategoryLabelLayout {
  const prefix = LINE_PREFIX[line]
  const fallback =
    line === "title1"
      ? defaultHeroTitle1Layout(isMobile)
      : defaultHeroTitle2Layout(isMobile)

  if (!hasTitleLabelBox(settings, line)) {
    const legacyScale = num(settings?.fontScale, 100) / 100
    if (legacyScale !== 1) {
      const base =
        line === "title1"
          ? fallback
          : defaultHeroTitle2Layout(
              isMobile,
              parseHeroTitleLayout(settings, "title1", isMobile),
            )
      return {
        xPct: base.xPct,
        yPct: base.yPct,
        wPct: roundPct(clamp(base.wPct * Math.sqrt(legacyScale), MIN_LABEL_PCT, 100)),
        hPct: roundPct(clamp(base.hPct * legacyScale, MIN_LABEL_PCT, 100)),
      }
    }

    if (line === "title2" && !hasTitleLabelBox(settings, "title1")) {
      return defaultHeroTitle2Layout(
        isMobile,
        parseHeroTitleLayout(settings, "title1", isMobile),
      )
    }

    return fallback
  }

  const xPct = clamp(num(settings?.[`${prefix}XPct`], fallback.xPct), 0, 100 - MIN_LABEL_PCT)
  const wPct = clamp(num(settings?.[`${prefix}WPct`], fallback.wPct), MIN_LABEL_PCT, 100 - xPct)
  const yPct = clamp(num(settings?.[`${prefix}YPct`], fallback.yPct), 0, 100 - MIN_LABEL_PCT)
  const hPct = clamp(num(settings?.[`${prefix}HPct`], fallback.hPct), MIN_LABEL_PCT, 100 - yPct)

  return {
    xPct: roundPct(xPct),
    yPct: roundPct(yPct),
    wPct: roundPct(wPct),
    hPct: roundPct(hPct),
  }
}

export function heroTitleLayoutToPatch(
  line: HeroTitleLine,
  layout: Partial<CategoryLabelLayout>,
): Record<string, number> {
  const prefix = LINE_PREFIX[line]
  const patch: Record<string, number> = {}
  if (layout.xPct !== undefined) patch[`${prefix}XPct`] = layout.xPct
  if (layout.yPct !== undefined) patch[`${prefix}YPct`] = layout.yPct
  if (layout.wPct !== undefined) patch[`${prefix}WPct`] = layout.wPct
  if (layout.hPct !== undefined) patch[`${prefix}HPct`] = layout.hPct
  return patch
}

/** Flatten both title label layouts into a single settings patch (for mobile seed). */
export function heroTitleLayoutsToPatch(
  title1: CategoryLabelLayout,
  title2: CategoryLabelLayout,
): Record<string, number> {
  return {
    ...heroTitleLayoutToPatch("title1", title1),
    ...heroTitleLayoutToPatch("title2", title2),
  }
}
