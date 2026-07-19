import type { BlockInstance } from "@/themes/engine/schema"
import {
  parseImageTransform,
  CANVAS_BOTTOM_PADDING,
  type CategoryImage,
} from "@/themes/bento/sections/category-grid-layout"

export const IMAGE_LAYERS_DESIGN_WIDTH = 1200
export const IMAGE_LAYERS_MOBILE_DESIGN_WIDTH = 390
export const IMAGE_LAYERS_DESIGN_HEIGHT = 420

export const MIN_LAYER_HEIGHT = 80
export const MAX_LAYER_HEIGHT = 720
export const MIN_LAYER_WIDTH_PCT = 8
export const MAX_IMAGE_LAYERS = 6

export type ImageLayerData = {
  id: string
  xPct: number
  yPx: number
  wPct: number
  hPx: number
  image: CategoryImage
  zIndex: number
}

function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function blockToImageLayer(block: BlockInstance, index: number): ImageLayerData {
  const s = block.settings as Record<string, unknown> | undefined
  return {
    id: block.id,
    xPct: clamp(num(s?.xPct, 5), 0, 90),
    yPx: clamp(num(s?.yPx, 20), 0, 9999),
    wPct: clamp(num(s?.wPct, 42), MIN_LAYER_WIDTH_PCT, 100),
    hPx: clamp(num(s?.hPx, 380), MIN_LAYER_HEIGHT, MAX_LAYER_HEIGHT),
    image: parseImageTransform(s),
    zIndex: index + 1,
  }
}

export function defaultImageLayers(): ImageLayerData[] {
  return [
    {
      id: "img-layer-1",
      xPct: 5,
      yPx: 20,
      wPct: 42,
      hPx: 380,
      image: { url: undefined, scale: 100, x: 0, y: 0, rotation: 0, sliderScale: 1, opacity: 100, flipH: false, flipV: false },
      zIndex: 1,
    },
    {
      id: "img-layer-2",
      xPct: 53,
      yPx: 20,
      wPct: 42,
      hPx: 380,
      image: { url: undefined, scale: 100, x: 0, y: 0, rotation: 0, sliderScale: 1, opacity: 100, flipH: false, flipV: false },
      zIndex: 2,
    },
  ]
}

export function imageLayersCanvasHeight(layers: ImageLayerData[]): number {
  if (!layers.length) return IMAGE_LAYERS_DESIGN_HEIGHT
  const maxBottom = Math.max(...layers.map((l) => l.yPx + l.hPx))
  return maxBottom + CANVAS_BOTTOM_PADDING
}
