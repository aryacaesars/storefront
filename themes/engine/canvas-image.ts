/** Normalized crop rect — fractions (0..1) of the virtual (un-cropped) image box. */
export type CanvasImageCrop = {
  x: number
  y: number
  w: number
  h: number
}

/** Per-image state for the multi-image canvas layer. */
export type CanvasImageItem = {
  id: string
  src: string
  /** Left edge as % of canvas width */
  x: number
  /** Top edge as % of canvas height */
  y: number
  /** Bounding box width as % of canvas width */
  width: number
  /** Bounding box height as % of canvas height */
  height: number
  /** Rotation in degrees */
  rotation: number
  /** Extra zoom multiplier applied inside the bounding box (1 = fill box) */
  scale: number
  /** Opacity 0–100 (100 = opaque) */
  opacity: number
  flipH: boolean
  flipV: boolean
  /** Visible region of the virtual box; box geometry always equals the crop region. */
  crop?: CanvasImageCrop
}

export const DEFAULT_CANVAS_IMAGE_ITEM: Omit<CanvasImageItem, "id" | "src"> = {
  x: 5,
  y: 5,
  width: 45,
  height: 75,
  rotation: 0,
  scale: 1,
  opacity: 100,
  flipH: false,
  flipV: false,
}

function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

const MIN_CROP_FRACTION = 0.02

export function parseCanvasImageCrop(value: unknown): CanvasImageCrop | undefined {
  if (typeof value !== "object" || value === null) return undefined
  const raw = value as Record<string, unknown>
  const w = clamp(num(raw.w, 1), MIN_CROP_FRACTION, 1)
  const h = clamp(num(raw.h, 1), MIN_CROP_FRACTION, 1)
  const x = clamp(num(raw.x, 0), 0, 1 - w)
  const y = clamp(num(raw.y, 0), 0, 1 - h)
  if (x === 0 && y === 0 && w === 1 && h === 1) return undefined
  return { x, y, w, h }
}

function normalizeCanvasImage(raw: Record<string, unknown>): CanvasImageItem {
  return {
    id: raw.id as string,
    src: raw.src as string,
    x: num(raw.x, DEFAULT_CANVAS_IMAGE_ITEM.x),
    y: num(raw.y, DEFAULT_CANVAS_IMAGE_ITEM.y),
    width: num(raw.width, DEFAULT_CANVAS_IMAGE_ITEM.width),
    height: num(raw.height, DEFAULT_CANVAS_IMAGE_ITEM.height),
    rotation: num(raw.rotation, 0),
    scale: num(raw.scale, 1),
    opacity: clamp(num(raw.opacity, 100), 0, 100),
    flipH: raw.flipH === true,
    flipV: raw.flipV === true,
    crop: parseCanvasImageCrop(raw.crop),
  }
}

export function parseCanvasImages(
  settings: Record<string, unknown> | undefined,
): CanvasImageItem[] {
  const raw = settings?.images
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (img): img is Record<string, unknown> =>
        typeof img === "object" &&
        img !== null &&
        typeof (img as Record<string, unknown>).id === "string" &&
        typeof (img as Record<string, unknown>).src === "string",
    )
    .map(normalizeCanvasImage)
}

export function addImageToArray(
  items: CanvasImageItem[],
  src: string,
): CanvasImageItem[] {
  const id = `img-${Date.now()}`
  const offset = items.length * 3
  return [
    ...items,
    {
      id,
      src,
      ...DEFAULT_CANVAS_IMAGE_ITEM,
      x: DEFAULT_CANVAS_IMAGE_ITEM.x + offset,
      y: DEFAULT_CANVAS_IMAGE_ITEM.y + offset,
    },
  ]
}

export function deleteImageFromArray(
  items: CanvasImageItem[],
  id: string,
): CanvasImageItem[] {
  return items.filter((img) => img.id !== id)
}

export function updateImageInArray(
  items: CanvasImageItem[],
  id: string,
  patch: Partial<CanvasImageItem>,
): CanvasImageItem[] {
  return items.map((img) => (img.id === id ? { ...img, ...patch } : img))
}

/**
 * Auto-fit canvas images for mobile when no mobile override exists.
 * Keeps relative arrangement but clamps into the phone frame so desktop
 * positions don't overflow / look tiny.
 */
export function mobileFitCanvasImages(items: CanvasImageItem[]): CanvasImageItem[] {
  if (items.length === 0) return items

  if (items.length === 1) {
    const img = items[0]!
    const width = clamp(Math.max(img.width, 55), 50, 86)
    const aspect = img.width > 0 ? img.height / img.width : 1.2
    const height = clamp(width * aspect, 30, 78)
    return [
      {
        ...img,
        width,
        height,
        x: round1((100 - width) / 2),
        y: clamp(img.y, 6, 100 - height - 4),
      },
    ]
  }

  return items.map((img) => {
    const width = clamp(img.width, 28, 88)
    const height = clamp(img.height, 18, 80)
    return {
      ...img,
      width,
      height,
      x: clamp(img.x, 2, 100 - width),
      y: clamp(img.y, 2, 100 - height),
    }
  })
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

/** Move an image within the array (array order = Z order, last on top). */
export function moveImageInArray(
  items: CanvasImageItem[],
  id: string,
  to: "forward" | "backward" | "front" | "back",
): CanvasImageItem[] {
  const from = items.findIndex((img) => img.id === id)
  if (from === -1) return items
  const target =
    to === "forward"
      ? Math.min(items.length - 1, from + 1)
      : to === "backward"
        ? Math.max(0, from - 1)
        : to === "front"
          ? items.length - 1
          : 0
  if (target === from) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(target, 0, moved)
  return next
}

/**
 * Virtual (un-cropped) box of an item in canvas % coords. Cropping stores the
 * visible region as the item box; this reconstructs the full-image box for
 * crop-mode editing.
 */
export function virtualBoxFromCrop(item: CanvasImageItem): {
  x: number
  y: number
  width: number
  height: number
} {
  const crop = item.crop
  if (!crop) return { x: item.x, y: item.y, width: item.width, height: item.height }
  const width = item.width / crop.w
  const height = item.height / crop.h
  return {
    x: item.x - crop.x * width,
    y: item.y - crop.y * height,
    width,
    height,
  }
}
