"use client"

import { DESIGN_WIDTH } from "@/themes/bento/sections/category-grid-layout"

const VERTICAL_GUIDES = [0, 25, 50, 75, 100]
const HORIZONTAL_STEP = 40

interface CanvasGridOverlayProps {
  canvasHeight: number
  scale: number
}

export function CanvasGridOverlay({ canvasHeight, scale }: CanvasGridOverlayProps) {
  const hLines = Math.ceil(canvasHeight / HORIZONTAL_STEP)

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[12px]"
    >
      {VERTICAL_GUIDES.map((pct) => (
        <div
          key={`v-${pct}`}
          className="absolute top-0 bottom-0 w-px bg-indigo-300/40"
          style={{ left: `${pct}%` }}
        />
      ))}
      {Array.from({ length: hLines + 1 }, (_, i) => i * HORIZONTAL_STEP).map((y) => (
        <div
          key={`h-${y}`}
          className="absolute right-0 left-0 h-px bg-indigo-300/40"
          style={{ top: `${y * scale}px` }}
        />
      ))}
      <div className="absolute top-1 left-2 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-medium text-indigo-500/80">
        Grid {DESIGN_WIDTH}px · snap 2% / 8px
      </div>
    </div>
  )
}

interface CanvasMeasurementBadgeProps {
  layout: { xPct: number; wPct: number; yPx: number; hPx: number }
  imageScale?: number
  hasImage?: boolean
}

export function CanvasMeasurementBadge({ layout, imageScale, hasImage }: CanvasMeasurementBadgeProps) {
  return (
    <div className="pointer-events-none absolute -top-7 left-0 z-40 flex flex-wrap gap-1">
      <span className="rounded bg-indigo-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow">
        W {layout.wPct}% · H {layout.hPx}px
      </span>
      <span className="rounded bg-indigo-600/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow">
        X {layout.xPct}% · Y {layout.yPx}px
      </span>
      {hasImage && imageScale != null && (
        <span className="rounded bg-violet-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow">
          Zoom {imageScale}%
        </span>
      )}
    </div>
  )
}
