"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"
import { createDragSession } from "@/features/builder/components/canvas/visual-frame"
import {
  getCanvasMetrics,
  resizeFromBottomEdge,
  resizeFromCorner,
  resizeFromLeftEdge,
  resizeFromRightEdge,
  resizeFromTopEdge,
  type CategoryCardLayout,
} from "@/themes/bento/sections/category-grid-layout"

type ResizePatch = Partial<CategoryCardLayout>
type Edge = "top" | "right" | "bottom" | "left"
type Corner = "nw" | "ne" | "se" | "sw"

interface CanvasResizeHandlesProps {
  layout: CategoryCardLayout
  gridRef: React.RefObject<HTMLDivElement | null>
  onResize: (patch: ResizePatch) => void
  /** Design width to scale resize deltas against (mobile uses a smaller one). */
  designWidth?: number
  /** Minimum box height in design px (defaults to MIN_CARD_HEIGHT). */
  minHeightPx?: number
  /** Maximum box height in design px (defaults to MAX_CARD_HEIGHT). */
  maxHeightPx?: number
}

function HandleDot({
  className,
  cursor,
  label,
  onPointerDown,
}: {
  className?: string
  cursor: string
  label: string
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onPointerDown}
      className={cn(
        // Larger hit target with small visual dot — easier when zoomed.
        "absolute z-30 flex h-11 w-11 touch-none items-center justify-center",
        "before:block before:h-3.5 before:w-3.5 before:rounded-full",
        "before:border-2 before:border-white before:bg-indigo-500 before:shadow-md",
        "transition-transform hover:scale-110 active:scale-105",
        className,
      )}
      style={{ cursor }}
    />
  )
}

function HandleBar({
  className,
  cursor,
  label,
  onPointerDown,
}: {
  className?: string
  cursor: string
  label: string
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onPointerDown}
      className={cn(
        "absolute z-30 touch-none rounded-full bg-white/95 shadow ring-1 ring-indigo-400/70",
        "transition-transform hover:scale-105 active:bg-indigo-50",
        className,
      )}
      style={{ cursor }}
    />
  )
}

export function CanvasResizeHandles({
  layout,
  gridRef,
  onResize,
  designWidth,
  minHeightPx,
  maxHeightPx,
}: CanvasResizeHandlesProps) {
  const startEdgeDrag = useCallback(
    (edge: Edge) => (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!gridRef.current) return

      const startY = event.clientY
      const startLayout = { ...layout }
      const session = createDragSession(event, onResize)

      session.listen((moveEvent) => {
        const metrics = {
          ...getCanvasMetrics(gridRef.current!),
          designWidth,
          minHeightPx,
          maxHeightPx,
        }
        const deltaY = moveEvent.clientY - startY

        switch (edge) {
          case "left":
            session.push(resizeFromLeftEdge(moveEvent.clientX, metrics, startLayout))
            break
          case "right":
            session.push(resizeFromRightEdge(moveEvent.clientX, metrics, startLayout))
            break
          case "top":
            session.push(resizeFromTopEdge(deltaY, startLayout, metrics))
            break
          case "bottom":
            session.push(resizeFromBottomEdge(deltaY, startLayout.hPx, metrics))
            break
        }
      })
    },
    [gridRef, layout, onResize, designWidth, minHeightPx, maxHeightPx],
  )

  const startCornerDrag = useCallback(
    (corner: Corner) => (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!gridRef.current) return

      const startY = event.clientY
      const startLayout = { ...layout }
      const session = createDragSession(event, onResize)

      session.listen((moveEvent) => {
        const metrics = {
          ...getCanvasMetrics(gridRef.current!),
          designWidth,
          minHeightPx,
          maxHeightPx,
        }
        session.push(
          resizeFromCorner(
            moveEvent.clientX,
            moveEvent.clientY - startY,
            metrics,
            startLayout,
            corner,
          ),
        )
      })
    },
    [gridRef, layout, onResize, designWidth, minHeightPx, maxHeightPx],
  )

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[12px] ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent"
      />

      <HandleBar
        label="Tarik atas"
        cursor="ns-resize"
        onPointerDown={startEdgeDrag("top")}
        className="left-1/2 top-0 h-3 w-12 -translate-x-1/2 -translate-y-1/2"
      />
      <HandleBar
        label="Tarik bawah"
        cursor="ns-resize"
        onPointerDown={startEdgeDrag("bottom")}
        className="bottom-0 left-1/2 h-3 w-12 -translate-x-1/2 translate-y-1/2"
      />
      <HandleBar
        label="Tarik kiri"
        cursor="ew-resize"
        onPointerDown={startEdgeDrag("left")}
        className="left-0 top-1/2 h-12 w-3 -translate-x-1/2 -translate-y-1/2"
      />
      <HandleBar
        label="Tarik kanan"
        cursor="ew-resize"
        onPointerDown={startEdgeDrag("right")}
        className="right-0 top-1/2 h-12 w-3 translate-x-1/2 -translate-y-1/2"
      />

      <HandleDot
        label="Tarik sudut kiri atas"
        cursor="nwse-resize"
        onPointerDown={startCornerDrag("nw")}
        className="-left-5 -top-5"
      />
      <HandleDot
        label="Tarik sudut kanan atas"
        cursor="nesw-resize"
        onPointerDown={startCornerDrag("ne")}
        className="-right-5 -top-5"
      />
      <HandleDot
        label="Tarik sudut kiri bawah"
        cursor="nesw-resize"
        onPointerDown={startCornerDrag("sw")}
        className="-bottom-5 -left-5"
      />
      <HandleDot
        label="Tarik sudut kanan bawah"
        cursor="nwse-resize"
        onPointerDown={startCornerDrag("se")}
        className="-bottom-5 -right-5"
      />
    </>
  )
}
