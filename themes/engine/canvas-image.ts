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
}

export const DEFAULT_CANVAS_IMAGE_ITEM: Omit<CanvasImageItem, "id" | "src"> = {
  x: 5,
  y: 5,
  width: 45,
  height: 75,
  rotation: 0,
  scale: 1,
}

export function parseCanvasImages(
  settings: Record<string, unknown> | undefined,
): CanvasImageItem[] {
  const raw = settings?.images
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (img): img is CanvasImageItem =>
      typeof img === "object" &&
      img !== null &&
      typeof (img as Record<string, unknown>).id === "string" &&
      typeof (img as Record<string, unknown>).src === "string",
  )
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
