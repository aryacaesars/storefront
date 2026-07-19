/**
 * Canvas button layer — analog `canvas-text.ts` untuk tombol. Item disimpan di
 * settings media block (key `buttons`), dirender sebagai tombol absolut yang
 * bisa digeser/di-resize di dalam frame section (posisi ala hero CTA:
 * xPct/wPct % lebar frame, yPx/hPx design px).
 *
 * Kontrak canvas untuk section baru:
 * - Gambar   → `images[]`  + `CanvasMultiImageItem`
 * - Teks     → `texts[]`   + `CanvasFreeTextLayer`
 * - Tombol   → `buttons[]` + `CanvasBoundButton` (via `CanvasButtonLayer`)
 * - Selection → `SelectedElement` + stamp `canvasElementDomKey`
 * Sidebar Text/Layers dan floating toolbar otomatis pick up dari resolver
 * generik — tidak perlu hardcode section type baru.
 */

export type CanvasButtonVariant = "filled" | "outline" | "ghost"
export type CanvasButtonShape = "rounded" | "pill" | "square"

export type CanvasButtonItem = {
  id: string
  label: string
  /** Left edge as % of frame width */
  xPct: number
  /** Top edge in design px */
  yPx: number
  /** Width as % of frame width */
  wPct: number
  /** Height in design px */
  hPx: number
  bgColor?: string
  textColor?: string
  variant?: CanvasButtonVariant
  shape?: CanvasButtonShape
  /** Border radius dalam design px — override preset `shape` bila diisi. */
  radius?: number
  href?: string
}

export const DEFAULT_CANVAS_BUTTON_ITEM: Omit<CanvasButtonItem, "id"> = {
  label: "Tombol",
  xPct: 40,
  yPx: 40,
  wPct: 20,
  hPx: 48,
}

export const MIN_BUTTON_HEIGHT = 24
export const MAX_BUTTON_HEIGHT = 200

function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function optStr(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined
}

function optNum(value: unknown): number | undefined {
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function normalizeCanvasButton(raw: Record<string, unknown>): CanvasButtonItem {
  return {
    id: raw.id as string,
    label: typeof raw.label === "string" ? raw.label : "",
    xPct: num(raw.xPct, DEFAULT_CANVAS_BUTTON_ITEM.xPct),
    yPx: num(raw.yPx, DEFAULT_CANVAS_BUTTON_ITEM.yPx),
    wPct: num(raw.wPct, DEFAULT_CANVAS_BUTTON_ITEM.wPct),
    hPx: num(raw.hPx, DEFAULT_CANVAS_BUTTON_ITEM.hPx),
    bgColor: optStr(raw.bgColor),
    textColor: optStr(raw.textColor),
    variant:
      raw.variant === "outline" || raw.variant === "ghost" || raw.variant === "filled"
        ? raw.variant
        : undefined,
    shape:
      raw.shape === "pill" || raw.shape === "square" || raw.shape === "rounded"
        ? raw.shape
        : undefined,
    radius: optNum(raw.radius),
    href: optStr(raw.href),
  }
}

export function parseCanvasButtons(
  settings: Record<string, unknown> | undefined,
): CanvasButtonItem[] {
  const raw = settings?.buttons
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).id === "string",
    )
    .map(normalizeCanvasButton)
}

export function addButtonToArray(
  items: CanvasButtonItem[],
  label?: string,
): CanvasButtonItem[] {
  const offset = items.length * 4
  return [
    ...items,
    {
      ...DEFAULT_CANVAS_BUTTON_ITEM,
      id: `button-${Date.now()}`,
      ...(label ? { label } : {}),
      xPct: DEFAULT_CANVAS_BUTTON_ITEM.xPct + offset,
      yPx: DEFAULT_CANVAS_BUTTON_ITEM.yPx + offset,
    },
  ]
}

export function updateButtonInArray(
  items: CanvasButtonItem[],
  id: string,
  patch: Partial<CanvasButtonItem>,
): CanvasButtonItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item))
}

export function deleteButtonFromArray(
  items: CanvasButtonItem[],
  id: string,
): CanvasButtonItem[] {
  return items.filter((item) => item.id !== id)
}
