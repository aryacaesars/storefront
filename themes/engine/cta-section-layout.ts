import type { BlockInstance } from "@/themes/engine/schema"
import {
  CANVAS_BOTTOM_PADDING,
  MIN_WIDTH_PCT,
  parseImageTransform,
  SNAP_PX,
  type CategoryCardLayout,
  type CategoryImage,
} from "@/themes/bento/sections/category-grid-layout"
import {
  MAX_CTA_HEIGHT,
  MIN_CTA_HEIGHT,
  parseHeroCta,
  type HeroCtaData,
} from "@/themes/bento/sections/hero-cta-layout"

export const CTA_SECTION_DESIGN_WIDTH = 1200
export const CTA_SECTION_MIN_HEIGHT = 360
export const CTA_IMAGE_MAX_HEIGHT = 560

export const DEFAULT_CTA_IMAGE_LAYOUT: CategoryCardLayout = {
  xPct: 0,
  wPct: 100,
  yPx: 0,
  hPx: 400,
}

export const DEFAULT_CTA_TITLE_LAYOUT: CategoryCardLayout = {
  xPct: 15,
  wPct: 70,
  yPx: 48,
  hPx: 88,
}

export const DEFAULT_CTA_PRIMARY_LAYOUT: CategoryCardLayout = {
  xPct: 28,
  wPct: 20,
  yPx: 200,
  hPx: 44,
}

export const DEFAULT_CTA_SECONDARY_LAYOUT: CategoryCardLayout = {
  xPct: 50,
  wPct: 22,
  yPx: 200,
  hPx: 44,
}

export type CtaTitleData = {
  id: string
  label: string
  layout: CategoryCardLayout
}

export type CtaImageData = {
  id: string
  layout: CategoryCardLayout
  image: CategoryImage
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function clampImageHeight(hPx: number): number {
  return clamp(hPx, 80, CTA_IMAGE_MAX_HEIGHT)
}

export function parseBoxLayout(
  settings: Record<string, unknown> | undefined,
  fallback: CategoryCardLayout,
  maxHeight = CTA_IMAGE_MAX_HEIGHT,
): CategoryCardLayout {
  const xPct = clamp(Number(settings?.xPct ?? fallback.xPct), 0, 100 - MIN_WIDTH_PCT)
  const wPct = clamp(Number(settings?.wPct ?? fallback.wPct), MIN_WIDTH_PCT, 100 - xPct)
  const yPx = Math.max(0, Math.round(Number(settings?.yPx ?? fallback.yPx) / SNAP_PX) * SNAP_PX)
  const hPx = clamp(Number(settings?.hPx ?? fallback.hPx), 36, maxHeight)

  return { xPct, wPct, yPx, hPx }
}

export function blockToCtaTitle(block: BlockInstance, fallbackLabel: string): CtaTitleData {
  const settings = block.settings as Record<string, unknown> | undefined
  return {
    id: block.id,
    label:
      typeof settings?.label === "string" && settings.label.trim()
        ? settings.label
        : fallbackLabel,
    layout: parseBoxLayout(settings, DEFAULT_CTA_TITLE_LAYOUT, 240),
  }
}

export function blockToCtaImage(block: BlockInstance): CtaImageData {
  const settings = block.settings as Record<string, unknown> | undefined
  return {
    id: block.id,
    layout: parseBoxLayout(settings, DEFAULT_CTA_IMAGE_LAYOUT, CTA_IMAGE_MAX_HEIGHT),
    image: parseImageTransform(settings),
  }
}

export function blockToCtaButton(
  block: BlockInstance,
  fallbackLabel: string,
  layoutFallback: CategoryCardLayout,
  theme?: { primaryColor?: string },
): HeroCtaData {
  const settings = block.settings as Record<string, unknown> | undefined
  const parsed = parseHeroCta(settings, fallbackLabel, false, theme)
  return {
    ...parsed,
    layout: parseBoxLayout(settings, layoutFallback, MAX_CTA_HEIGHT),
  }
}

export function ctaSectionCanvasHeight(layouts: CategoryCardLayout[]): number {
  const maxBottom = layouts.reduce((max, layout) => Math.max(max, layout.yPx + layout.hPx), 0)
  return Math.max(CTA_SECTION_MIN_HEIGHT, maxBottom + CANVAS_BOTTOM_PADDING)
}
