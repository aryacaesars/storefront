"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"
import { CanvasResizeHandles } from "@/features/builder/components/canvas/CanvasResizeHandles"
import type { CategoryCardLayout } from "@/themes/bento/sections/category-grid-layout"

const DRAG_THRESHOLD = 4

export interface CanvasPositionedBoxProps {
  layout: CategoryCardLayout
  scale: number
  designWidth: number
  canvasRef: React.RefObject<HTMLDivElement | null>
  editable: boolean
  selected: boolean
  onSelect: () => void
  onChange: (patch: Partial<CategoryCardLayout>) => void
  minHeightPx?: number
  maxHeightPx?: number
  zIndex?: number
  /** Hide in preview when empty (no children rendered). */
  hideWhenEmpty?: boolean
  isEmpty?: boolean
  emptyPlaceholder?: React.ReactNode
  innerClassName?: string
  /** Set false when children already draw their own selection chrome (e.g. CanvasImageFrame). */
  showSelectionRing?: boolean
  /** Set false when children draw their own resize/rotate handles (e.g. CanvasImageFrame). */
  showResizeHandles?: boolean
  children: React.ReactNode
}

export function CanvasPositionedBox({
  layout,
  scale,
  designWidth,
  canvasRef,
  editable,
  selected,
  onSelect,
  onChange,
  minHeightPx,
  maxHeightPx,
  zIndex = 10,
  hideWhenEmpty = false,
  isEmpty = false,
  emptyPlaceholder,
  innerClassName,
  showSelectionRing = true,
  showResizeHandles = true,
  children,
}: CanvasPositionedBoxProps) {
  const startFrameMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.target instanceof HTMLElement && event.target.closest('[contenteditable="true"]')) {
        return
      }
      event.stopPropagation()
      const startX = event.clientX
      const startY = event.clientY
      const originXPct = layout.xPct
      const originYPx = layout.yPx
      let dragging = false

      function onMove(moveEvent: PointerEvent) {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        if (!dragging && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return
        dragging = true
        moveEvent.preventDefault()
        const canvasWidth = canvasRef.current?.clientWidth ?? 1
        const dxPct = (dx / canvasWidth) * 100
        const dyDesign = dy / scale
        onChange({
          xPct: Math.max(
            0,
            Math.min(100 - layout.wPct, Math.round((originXPct + dxPct) * 10) / 10),
          ),
          yPx: Math.max(0, Math.round(originYPx + dyDesign)),
        })
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [canvasRef, layout.wPct, layout.xPct, layout.yPx, onChange, scale],
  )

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${layout.xPct}%`,
    top: `${layout.yPx * scale}px`,
    width: `${layout.wPct}%`,
    height: `${layout.hPx * scale}px`,
    zIndex,
  }

  if (!editable) {
    if (hideWhenEmpty && isEmpty) return null
    return (
      <div style={style} className={cn("overflow-hidden", innerClassName)}>
        {children}
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      style={style}
      className={cn("overflow-visible", selected && "cursor-move")}
      onPointerDown={selected ? startFrameMove : undefined}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onSelect()
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
    >
      <div
        className={cn(
          "absolute inset-0 overflow-hidden",
          isEmpty && "bg-white/10",
          selected && showSelectionRing && "ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent",
          innerClassName,
        )}
      >
        {isEmpty && emptyPlaceholder}
        {children}
      </div>

      {selected && showResizeHandles && (
        <CanvasResizeHandles
          layout={layout}
          gridRef={canvasRef}
          onResize={onChange}
          designWidth={designWidth}
          minHeightPx={minHeightPx}
          maxHeightPx={maxHeightPx}
        />
      )}
    </div>
  )
}
