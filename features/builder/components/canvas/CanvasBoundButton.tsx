"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasMeasurementBadge } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasResizeHandles } from "@/features/builder/components/canvas/CanvasResizeHandles"
import {
  createDragSession,
  visualFrameSize,
} from "@/features/builder/components/canvas/visual-frame"
import {
  MAX_BUTTON_HEIGHT,
  MIN_BUTTON_HEIGHT,
  type CanvasButtonShape,
  type CanvasButtonVariant,
} from "@/themes/engine/canvas-button"
import type { CategoryCardLayout } from "@/themes/bento/sections/category-grid-layout"

/**
 * Tombol canvas resmi — bounding box drag/resize + label inline-edit, dipakai
 * hero CTA (via CanvasHeroCta) dan `buttons[]` section CTA (via
 * CanvasButtonLayer). Layout ala hero: xPct/wPct % lebar frame, yPx/hPx design
 * px yang diskalakan `scale`.
 */
interface CanvasBoundButtonProps {
  label: string
  layout: CategoryCardLayout
  href: string
  editable: boolean
  selected: boolean
  scale: number
  designWidth: number
  frameRef: React.RefObject<HTMLDivElement | null>
  bgColor?: string
  textColor?: string
  variant?: CanvasButtonVariant
  shape?: CanvasButtonShape
  /** Border radius dalam design px — override preset `shape` bila diisi. */
  radius?: number
  minHeightPx?: number
  maxHeightPx?: number
  /** Stamped as data-canvas-element so selection chrome can find this node. */
  domKey?: string
  onSelect: () => void
  onChange: (patch: Record<string, unknown>) => void
}

const DRAG_THRESHOLD_PX = 4

export function CanvasBoundButton({
  label,
  layout,
  href,
  editable,
  selected,
  scale,
  designWidth,
  frameRef,
  bgColor,
  textColor,
  variant = "filled",
  shape = "rounded",
  radius,
  minHeightPx = MIN_BUTTON_HEIGHT,
  maxHeightPx = MAX_BUTTON_HEIGHT,
  domKey,
  onSelect,
  onChange,
}: CanvasBoundButtonProps) {
  // Drag pindah posisi — pola sama dengan teks: select dulu, drag aktif setelah
  // threshold (blur label contentEditable saat mulai geser).
  function startMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!editable) return
    event.stopPropagation()
    onSelect()
    const frame = frameRef.current
    if (!frame) return
    const startX = event.clientX
    const startY = event.clientY
    const start = { ...layout }
    const { w: frameWidth, h: frameHeight } = visualFrameSize(frame)
    const designHeight = (frame.clientHeight || 1) / (scale || 1)
    let dragging = false
    const session = createDragSession(event, onChange)

    session.listen((e) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (!dragging && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD_PX) return
      dragging = true
      e.preventDefault()
      const active = document.activeElement
      if (active instanceof HTMLElement && active.isContentEditable) {
        active.blur()
      }
      const xPct = Math.max(
        0,
        Math.min(100 - start.wPct, start.xPct + (dx / frameWidth) * 100),
      )
      // Map screen dy through visual height → design px (accounts for CSS zoom).
      const yPx = Math.max(
        0,
        Math.min(designHeight - start.hPx, start.yPx + dy * (designHeight / frameHeight)),
      )
      session.push({
        xPct: Math.round(xPct * 10) / 10,
        yPx: Math.round(yPx),
      })
    })
  }

  const isOutline = variant === "outline"
  const isGhost = variant === "ghost"
  const resolvedTextColor =
    (textColor ?? "").trim() ||
    (isOutline || isGhost ? "#ffffff" : "var(--theme-primary)")

  const boxStyle: React.CSSProperties = {
    position: "absolute",
    left: `${layout.xPct}%`,
    width: `${layout.wPct}%`,
    top: `${layout.yPx * scale}px`,
    height: `${layout.hPx * scale}px`,
    // Di atas layer gambar (z-10), judul (z-15), overlay, dan free-text (≤40).
    zIndex: 50,
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor:
      isOutline || isGhost ? "transparent" : bgColor || "#ffffff",
    color: resolvedTextColor,
    fontFamily: "var(--theme-heading-font)",
    fontSize: `${Math.max(12, layout.hPx * scale * 0.38)}px`,
    ...(isOutline && {
      border: `1.5px solid ${resolvedTextColor}`,
      boxShadow: "none",
    }),
    // Radius custom (design px, ikut scale) menang atas preset shape class.
    ...(radius !== undefined && {
      borderRadius: `${Math.max(0, radius) * scale}px`,
    }),
  }

  const shapeClass = cn(
    shape === "pill" && "rounded-full",
    shape === "square" && "rounded-none",
    shape === "rounded" && "rounded-[47px] capitalize shadow-lg",
    isGhost && "shadow-none",
  )

  const className = cn(
    "pointer-events-auto flex items-center justify-center overflow-visible px-6 font-black uppercase tracking-[0.14em]",
    shapeClass,
    editable && "cursor-pointer",
    !editable && "hover:opacity-80",
  )

  const labelNode = editable ? (
    <CanvasInlineText
      value={label}
      onChange={(value) => onChange({ label: value })}
      className="max-w-full truncate text-center outline-none focus:ring-2 focus:ring-indigo-300/50 rounded-sm"
    />
  ) : (
    <span className="max-w-full truncate text-center">{label}</span>
  )

  const handleResize = (patch: Partial<CategoryCardLayout>) => onChange(patch)

  if (editable) {
    return (
      <div
        role="button"
        tabIndex={0}
        style={boxStyle}
        data-canvas-element={domKey}
        className={cn(
          "pointer-events-auto cursor-move",
          editable && !selected && "ring-2 ring-transparent",
        )}
        onPointerDown={startMove}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onSelect()
        }}
        onKeyDown={(event) => {
          const target = event.target as HTMLElement | null
          if (
            target?.isContentEditable ||
            target?.closest('[contenteditable="true"], [role="textbox"], input, textarea')
          ) {
            return
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            event.stopPropagation()
            onSelect()
          }
        }}
      >
        {selected && (
          <CanvasMeasurementBadge
            layout={layout}
            imageScale={100}
            hasImage={false}
          />
        )}
        <div
          className={cn(
            "flex h-full w-full items-center justify-center",
            shapeClass,
            className,
            selected && "ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent",
          )}
          style={buttonStyle}
        >
          {labelNode}
        </div>
        {selected && (
          <CanvasResizeHandles
            layout={layout}
            gridRef={frameRef}
            onResize={handleResize}
            designWidth={designWidth}
            minHeightPx={minHeightPx}
            maxHeightPx={maxHeightPx}
          />
        )}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={className}
      style={{ ...boxStyle, ...buttonStyle }}
    >
      {label}
    </Link>
  )
}
