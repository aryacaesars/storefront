import type { BlockInstance } from "@/themes/engine/schema"

/**
 * Free-form bento layout. Cards are positioned absolutely inside the canvas:
 * - horizontal (xPct / wPct) is a percentage of canvas width → stays responsive
 * - vertical (yPx / hPx) is absolute pixels → independent of any row grid
 *
 * No column/row snapping: every edge resizes continuously.
 */

export const MIN_WIDTH_PCT = 12
export const MIN_CARD_HEIGHT = 100
export const MAX_CARD_HEIGHT = 600
/** Min gap kept below the lowest card so the canvas never clips a drop-shadow. */
export const CANVAS_BOTTOM_PADDING = 8
/**
 * Reference width the px layout (yPx/hPx) is authored against. At render time
 * the canvas scales by actualWidth / DESIGN_WIDTH so both axes stay
 * proportional → identical layout at any container width (customize == live).
 */
export const DESIGN_WIDTH = 1200
/** Design width the MOBILE free-form layout is authored against (≈ phone frame). */
export const MOBILE_DESIGN_WIDTH = 390

export const MAX_CATEGORY_CARDS = 4
/** Snap card edges to this % grid when resizing. */
export const SNAP_PCT = 2
/** Snap card vertical px to this grid when resizing. */
export const SNAP_PX = 8

/** Uploaded image is sized as % of card width; pannable within the clip frame. */
export const MIN_IMG_SCALE = 20
export const MAX_IMG_SCALE = 400
/** Upload default: 100% = fit & center inside frame (resize handle to zoom). */
export const DEFAULT_IMG_SCALE = 100

export const DEFAULT_IMAGE_TRANSFORM = {
  imgScale: DEFAULT_IMG_SCALE,
  imgX: 0,
  imgY: 0,
  imgRotation: 0,
  imgSliderScale: 1,
} as const

export type CategoryImage = {
  url?: string
  /** Image width as % of card width (zoom). */
  scale: number
  /** Pan offset from centre, % of frame. */
  x: number
  y: number
  /** Rotation in degrees (−180–180). */
  rotation: number
  /** Precision scale multiplier (0.1–5, default 1). */
  sliderScale: number
}

export type CategoryCardLayout = {
  /** Left offset as % of canvas width (0–100). */
  xPct: number
  /** Width as % of canvas width. */
  wPct: number
  /** Top offset in px. */
  yPx: number
  /** Height in px. */
  hPx: number
}

export type LabelLayer = "front" | "behind"

export function parseLabelLayer(value: unknown): LabelLayer {
  return value === "behind" ? "behind" : "front"
}

/** Label box inside a card — all values are % of the card bounds. */
export type CategoryLabelLayout = {
  xPct: number
  yPct: number
  wPct: number
  hPct: number
}

export type LabelContainerMetrics = {
  width: number
  height: number
  left: number
  top: number
}

export const MIN_LABEL_PCT = 4

const DEFAULT_LABEL_LAYOUTS: Record<"sm" | "md" | "lg", CategoryLabelLayout> = {
  sm: { xPct: 8, yPct: 8, wPct: 78, hPct: 30 },
  md: { xPct: 8, yPct: 8, wPct: 68, hPct: 24 },
  lg: { xPct: 8, yPct: 8, wPct: 62, hPct: 18 },
}

export function inferLabelSize(layout: CategoryCardLayout): "sm" | "md" | "lg" {
  if (layout.hPx <= 170) return "sm"
  if (layout.wPct >= 50 && layout.hPx >= 240) return "lg"
  return "md"
}

function hasLabelBox(settings: Record<string, unknown> | undefined): boolean {
  return (
    settings != null &&
    ("labelXPct" in settings ||
      "labelYPct" in settings ||
      "labelWPct" in settings ||
      "labelHPct" in settings)
  )
}

function parseLabelLayout(
  settings: Record<string, unknown> | undefined,
  cardLayout: CategoryCardLayout,
): CategoryLabelLayout {
  const size = inferLabelSize(cardLayout)
  const fallback = DEFAULT_LABEL_LAYOUTS[size]

  if (!hasLabelBox(settings)) {
    const legacyScale = num(settings?.labelScale, 100) / 100
    if (legacyScale !== 1) {
      return {
        xPct: fallback.xPct,
        yPct: fallback.yPct,
        wPct: roundPct(clamp(fallback.wPct * Math.sqrt(legacyScale), MIN_LABEL_PCT, 100)),
        hPct: roundPct(clamp(fallback.hPct * legacyScale, MIN_LABEL_PCT, 100)),
      }
    }
    return fallback
  }

  const xPct = clamp(num(settings?.labelXPct, fallback.xPct), 0, 100 - MIN_LABEL_PCT)
  const wPct = clamp(num(settings?.labelWPct, fallback.wPct), MIN_LABEL_PCT, 100 - xPct)
  const yPct = clamp(num(settings?.labelYPct, fallback.yPct), 0, 100 - MIN_LABEL_PCT)
  const hPct = clamp(num(settings?.labelHPct, fallback.hPct), MIN_LABEL_PCT, 100 - yPct)

  return {
    xPct: roundPct(xPct),
    yPct: roundPct(yPct),
    wPct: roundPct(wPct),
    hPct: roundPct(hPct),
  }
}

function labelPctFromPointerX(pointerX: number, metrics: LabelContainerMetrics): number {
  if (metrics.width <= 0) return 0
  const raw = ((pointerX - metrics.left) / metrics.width) * 100
  return clamp(Math.round(raw * 10) / 10, 0, 100)
}

function labelPctFromPointerY(pointerY: number, metrics: LabelContainerMetrics): number {
  if (metrics.height <= 0) return 0
  const raw = ((pointerY - metrics.top) / metrics.height) * 100
  return clamp(Math.round(raw * 10) / 10, 0, 100)
}

function roundLabelPct(value: number): number {
  return Math.round(value * 10) / 10
}

export function labelResizeFromLeftEdge(
  pointerX: number,
  metrics: LabelContainerMetrics,
  start: CategoryLabelLayout,
): Pick<CategoryLabelLayout, "xPct" | "wPct"> {
  const rightEdge = start.xPct + start.wPct
  const xPct = clamp(labelPctFromPointerX(pointerX, metrics), 0, rightEdge - MIN_LABEL_PCT)
  return { xPct, wPct: roundLabelPct(rightEdge - xPct) }
}

export function labelResizeFromRightEdge(
  pointerX: number,
  metrics: LabelContainerMetrics,
  start: CategoryLabelLayout,
): Pick<CategoryLabelLayout, "wPct"> {
  const wPct = clamp(
    labelPctFromPointerX(pointerX, metrics) - start.xPct,
    MIN_LABEL_PCT,
    100 - start.xPct,
  )
  return { wPct: roundLabelPct(wPct) }
}

export function labelResizeFromTopEdge(
  pointerY: number,
  metrics: LabelContainerMetrics,
  start: CategoryLabelLayout,
): Pick<CategoryLabelLayout, "yPct" | "hPct"> {
  const bottom = start.yPct + start.hPct
  const yPct = clamp(labelPctFromPointerY(pointerY, metrics), 0, bottom - MIN_LABEL_PCT)
  return { yPct, hPct: roundLabelPct(bottom - yPct) }
}

export function labelResizeFromBottomEdge(
  pointerY: number,
  metrics: LabelContainerMetrics,
  start: CategoryLabelLayout,
): Pick<CategoryLabelLayout, "hPct"> {
  const hPct = clamp(
    labelPctFromPointerY(pointerY, metrics) - start.yPct,
    MIN_LABEL_PCT,
    100 - start.yPct,
  )
  return { hPct: roundLabelPct(hPct) }
}

export function labelResizeFromCorner(
  pointerX: number,
  pointerY: number,
  metrics: LabelContainerMetrics,
  start: CategoryLabelLayout,
  corner: "nw" | "ne" | "sw" | "se",
): Partial<CategoryLabelLayout> {
  const patch: Partial<CategoryLabelLayout> = {}

  if (corner === "nw" || corner === "sw") {
    Object.assign(patch, labelResizeFromLeftEdge(pointerX, metrics, start))
  } else {
    Object.assign(patch, labelResizeFromRightEdge(pointerX, metrics, start))
  }

  if (corner === "nw" || corner === "ne") {
    Object.assign(patch, labelResizeFromTopEdge(pointerY, metrics, start))
  } else {
    Object.assign(patch, labelResizeFromBottomEdge(pointerY, metrics, start))
  }

  return patch
}

export function labelMoveFromDelta(
  deltaX: number,
  deltaY: number,
  metrics: LabelContainerMetrics,
  start: CategoryLabelLayout,
): Pick<CategoryLabelLayout, "xPct" | "yPct"> {
  if (metrics.width <= 0 || metrics.height <= 0) {
    return { xPct: start.xPct, yPct: start.yPct }
  }
  const dxPct = (deltaX / metrics.width) * 100
  const dyPct = (deltaY / metrics.height) * 100
  const xPct = clamp(start.xPct + dxPct, 0, 100 - start.wPct)
  const yPct = clamp(start.yPct + dyPct, 0, 100 - start.hPct)
  return { xPct: roundLabelPct(xPct), yPct: roundLabelPct(yPct) }
}

export function labelLayoutToPatch(layout: Partial<CategoryLabelLayout>): Record<string, unknown> {
  const patch: Record<string, unknown> = {}
  if (layout.xPct !== undefined) patch.labelXPct = layout.xPct
  if (layout.yPct !== undefined) patch.labelYPct = layout.yPct
  if (layout.wPct !== undefined) patch.labelWPct = layout.wPct
  if (layout.hPct !== undefined) patch.labelHPct = layout.hPct
  return patch
}

export type CategoryCardData = {
  id: string
  slug: string
  label: string
  /** Solid fill behind uploaded image (PNG transparency). */
  bgColor: string
  image: CategoryImage
  layout: CategoryCardLayout
  labelLayer: LabelLayer
  labelLayout: CategoryLabelLayout
}

export type CanvasMetrics = {
  width: number
  left: number
  /** Design width to scale against (DESIGN_WIDTH desktop, MOBILE_DESIGN_WIDTH mobile). */
  designWidth?: number
  /** Minimum box height in design px (defaults to MIN_CARD_HEIGHT). */
  minHeightPx?: number
  /** Maximum box height in design px (defaults to MAX_CARD_HEIGHT). */
  maxHeightPx?: number
}

function minBoxHeight(metrics: CanvasMetrics): number {
  return metrics.minHeightPx ?? MIN_CARD_HEIGHT
}

function maxBoxHeight(metrics: CanvasMetrics): number {
  return metrics.maxHeightPx ?? MAX_CARD_HEIGHT
}

export const DEFAULT_CARD_LAYOUTS: CategoryCardLayout[] = [
  { xPct: 0, wPct: 50, yPx: 0, hPx: 280 },
  { xPct: 52, wPct: 48, yPx: 0, hPx: 280 },
  { xPct: 0, wPct: 66, yPx: 292, hPx: 240 },
  { xPct: 68, wPct: 32, yPx: 292, hPx: 240 },
]

const DEFAULT_META = [
  { slug: "tablets", label: "Fill It With NEO", bgColor: "#ffc300" },
  { slug: "speakers", label: "Great Experience", bgColor: "#007be0" },
  { slug: "earphones", label: "Sound Directly In Your EAR!", bgColor: "#ff4040" },
  {
    slug: "gaming",
    label: "Play With Your Friends",
    bgColor: "#d0cbcb",
  },
] as const

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

function hexFromImageClass(imageClass: string): string | undefined {
  const match = imageClass.match(/#([0-9a-fA-F]{6})/)
  return match ? `#${match[1]}` : undefined
}

export function parseCardBgColor(
  settings: Record<string, unknown> | undefined,
  index: number,
): string {
  const direct = settings?.cardBgColor
  if (typeof direct === "string" && HEX_COLOR.test(direct.trim())) {
    return direct.trim()
  }

  const legacyClass =
    typeof settings?.imageClass === "string" ? settings.imageClass.trim() : ""
  if (legacyClass) {
    const fromClass = hexFromImageClass(legacyClass)
    if (fromClass) return fromClass
  }

  return DEFAULT_META[index]?.bgColor ?? "#9ca3af"
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Coerce an unknown setting to a finite number, else fallback. */
function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function parseImageTransform(settings: Record<string, unknown> | undefined): CategoryImage {
  const url =
    typeof settings?.imageUrl === "string" && settings.imageUrl.trim()
      ? settings.imageUrl
      : undefined
  return {
    url,
    scale: clamp(num(settings?.imgScale, DEFAULT_IMG_SCALE), MIN_IMG_SCALE, MAX_IMG_SCALE),
    x: Math.round(num(settings?.imgX, 0)),
    y: Math.round(num(settings?.imgY, 0)),
    rotation: clamp(Math.round(num(settings?.imgRotation, 0)), -180, 180),
    sliderScale: clamp(num(settings?.imgSliderScale, 1), 0.1, 5),
  }
}

/** Percentages snap to SNAP_PCT grid; pixels to SNAP_PX. */
function roundPct(value: number): number {
  return Math.round(value / SNAP_PCT) * SNAP_PCT
}

function snapPx(value: number): number {
  return Math.round(value / SNAP_PX) * SNAP_PX
}

function clampHeight(value: number, min = MIN_CARD_HEIGHT, max = MAX_CARD_HEIGHT): number {
  return clamp(snapPx(value), min, max)
}

function parseLayout(settings: Record<string, unknown> | undefined, index: number): CategoryCardLayout {
  const fallback = DEFAULT_CARD_LAYOUTS[index] ?? DEFAULT_CARD_LAYOUTS[0]
  const xPct = clamp(Number(settings?.xPct ?? fallback.xPct), 0, 100 - MIN_WIDTH_PCT)
  const wPct = clamp(Number(settings?.wPct ?? fallback.wPct), MIN_WIDTH_PCT, 100 - xPct)
  const yPx = Math.max(0, snapPx(Number(settings?.yPx ?? fallback.yPx)))
  const hPx = clampHeight(Number(settings?.hPx ?? fallback.hPx))

  return { xPct: roundPct(xPct), wPct: roundPct(wPct), yPx, hPx }
}

export function blockToCategoryCard(block: BlockInstance, index: number): CategoryCardData {
  const s = block.settings as Record<string, unknown> | undefined
  const fallback = DEFAULT_META[index]

  return {
    id: block.id,
    slug: typeof s?.slug === "string" ? s.slug : fallback?.slug ?? `category-${index}`,
    label: typeof s?.label === "string" ? s.label : fallback?.label ?? "Category",
    bgColor: parseCardBgColor(s, index),
    image: parseImageTransform(s),
    layout: parseLayout(s, index),
    labelLayer: parseLabelLayer(s?.labelLayer),
    labelLayout: parseLabelLayout(s, parseLayout(s, index)),
  }
}

export function defaultCategoryCards(): CategoryCardData[] {
  return DEFAULT_META.slice(0, MAX_CATEGORY_CARDS).map((meta, index) => ({
    id: `bento-cat-${index}`,
    ...meta,
    image: { url: undefined, scale: DEFAULT_IMG_SCALE, x: 0, y: 0, rotation: 0, sliderScale: 1 },
    layout: DEFAULT_CARD_LAYOUTS[index],
    labelLayer: "front",
    labelLayout: DEFAULT_LABEL_LAYOUTS[inferLabelSize(DEFAULT_CARD_LAYOUTS[index])],
  }))
}

/** Gap between cards in the mobile vertical stack (design px). */
export const MOBILE_STACK_GAP = 16

/**
 * Default MOBILE arrangement = the responsive stack: each card full-width,
 * stacked vertically (matches the non-editable mobile view). Used as the
 * starting layout in the editor until the user saves a custom mobile layout.
 */
export function mobileStackLayouts(cards: CategoryCardData[]): CategoryCardLayout[] {
  let y = 0
  return cards.map((card) => {
    const hPx = card.layout.hPx
    const layout: CategoryCardLayout = { xPct: 0, wPct: 100, yPx: y, hPx }
    y += hPx + MOBILE_STACK_GAP
    return layout
  })
}

/** Total canvas height needed to contain every card (px). */
export function canvasHeight(cards: CategoryCardData[]): number {
  return cards.reduce(
    (max, card) => Math.max(max, card.layout.yPx + card.layout.hPx),
    0,
  ) + CANVAS_BOTTOM_PADDING
}

export function getCanvasMetrics(element: HTMLElement): CanvasMetrics {
  const rect = element.getBoundingClientRect()
  return { width: rect.width, left: rect.left }
}

/** Pointer X → percentage of canvas width (0–100). */
function pctFromPointerX(pointerX: number, metrics: CanvasMetrics): number {
  if (metrics.width <= 0) return 0
  return clamp(((pointerX - metrics.left) / metrics.width) * 100, 0, 100)
}

export function resizeFromLeftEdge(
  pointerX: number,
  metrics: CanvasMetrics,
  start: CategoryCardLayout,
): Pick<CategoryCardLayout, "xPct" | "wPct"> {
  const rightEdge = start.xPct + start.wPct
  const xPct = clamp(pctFromPointerX(pointerX, metrics), 0, rightEdge - MIN_WIDTH_PCT)
  return { xPct: roundPct(xPct), wPct: roundPct(rightEdge - xPct) }
}

export function resizeFromRightEdge(
  pointerX: number,
  metrics: CanvasMetrics,
  start: CategoryCardLayout,
): Pick<CategoryCardLayout, "wPct"> {
  const wPct = clamp(pctFromPointerX(pointerX, metrics) - start.xPct, MIN_WIDTH_PCT, 100 - start.xPct)
  return { wPct: roundPct(wPct) }
}

/** Visual px → design px: dragging at a scaled canvas must map back to design coords. */
function designScale(metrics: CanvasMetrics): number {
  const scale = metrics.width / (metrics.designWidth ?? DESIGN_WIDTH)
  return scale > 0 ? scale : 1
}

export function resizeFromTopEdge(
  deltaY: number,
  start: CategoryCardLayout,
  metrics: CanvasMetrics,
): Pick<CategoryCardLayout, "yPx" | "hPx"> {
  const dy = deltaY / designScale(metrics)
  const bottom = start.yPx + start.hPx
  const minH = minBoxHeight(metrics)
  const yPx = clamp(start.yPx + dy, 0, bottom - minH)
  return { yPx: snapPx(yPx), hPx: clampHeight(bottom - yPx, minH, maxBoxHeight(metrics)) }
}

export function resizeFromBottomEdge(
  deltaY: number,
  startHeight: number,
  metrics: CanvasMetrics,
): Pick<CategoryCardLayout, "hPx"> {
  return {
    hPx: clampHeight(
      startHeight + deltaY / designScale(metrics),
      minBoxHeight(metrics),
      maxBoxHeight(metrics),
    ),
  }
}

export function resizeFromCorner(
  pointerX: number,
  deltaY: number,
  metrics: CanvasMetrics,
  start: CategoryCardLayout,
  corner: "nw" | "ne" | "sw" | "se",
): Partial<CategoryCardLayout> {
  const patch: Partial<CategoryCardLayout> = {}

  if (corner === "nw" || corner === "sw") {
    Object.assign(patch, resizeFromLeftEdge(pointerX, metrics, start))
  } else {
    Object.assign(patch, resizeFromRightEdge(pointerX, metrics, start))
  }

  if (corner === "nw" || corner === "ne") {
    Object.assign(patch, resizeFromTopEdge(deltaY, start, metrics))
  } else {
    Object.assign(patch, resizeFromBottomEdge(deltaY, start.hPx, metrics))
  }

  return patch
}
