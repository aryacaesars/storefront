"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"
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
        "absolute z-30 flex h-3 w-3 items-center justify-center rounded-full",
        "border-2 border-white bg-indigo-500 shadow-md",
        "transition-transform hover:scale-125 active:scale-110",
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
        "absolute z-30 rounded-full bg-white/95 shadow ring-1 ring-indigo-400/70",
        "transition-transform hover:scale-105 active:bg-indigo-50",
        className,
      )}
      style={{ cursor }}
    />
  )
}

export function CanvasResizeHandles({ layout, gridRef, onResize, designWidth, minHeightPx, maxHeightPx }: CanvasResizeHandlesProps) {
  const startEdgeDrag = useCallback(
    (edge: Edge) => (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!gridRef.current) return

      const startY = event.clientY
      const startLayout = { ...layout }

      function onMove(moveEvent: PointerEvent) {
        const metrics = { ...getCanvasMetrics(gridRef.current!), designWidth, minHeightPx, maxHeightPx }
        const deltaY = moveEvent.clientY - startY

        switch (edge) {
          case "left":
            onResize(resizeFromLeftEdge(moveEvent.clientX, metrics, startLayout))
            break
          case "right":
            onResize(resizeFromRightEdge(moveEvent.clientX, metrics, startLayout))
            break
          case "top":
            onResize(resizeFromTopEdge(deltaY, startLayout, metrics))
            break
          case "bottom":
            onResize(resizeFromBottomEdge(deltaY, startLayout.hPx, metrics))
            break
        }
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [gridRef, layout, onResize, designWidth],
  )

  const startCornerDrag = useCallback(
    (corner: Corner) => (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!gridRef.current) return

      const startY = event.clientY
      const startLayout = { ...layout }

      function onMove(moveEvent: PointerEvent) {
        const metrics = { ...getCanvasMetrics(gridRef.current!), designWidth, minHeightPx, maxHeightPx }
        onResize(
          resizeFromCorner(
            moveEvent.clientX,
            moveEvent.clientY - startY,
            metrics,
            startLayout,
            corner,
          ),
        )
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [gridRef, layout, onResize, designWidth],
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
        className="left-1/2 top-0 h-1.5 w-8 -translate-x-1/2 -translate-y-1/2"
      />
      <HandleBar
        label="Tarik bawah"
        cursor="ns-resize"
        onPointerDown={startEdgeDrag("bottom")}
        className="bottom-0 left-1/2 h-1.5 w-8 -translate-x-1/2 translate-y-1/2"
      />
      <HandleBar
        label="Tarik kiri"
        cursor="ew-resize"
        onPointerDown={startEdgeDrag("left")}
        className="left-0 top-1/2 h-8 w-1.5 -translate-x-1/2 -translate-y-1/2"
      />
      <HandleBar
        label="Tarik kanan"
        cursor="ew-resize"
        onPointerDown={startEdgeDrag("right")}
        className="right-0 top-1/2 h-8 w-1.5 translate-x-1/2 -translate-y-1/2"
      />

      <HandleDot
        label="Tarik sudut kiri atas"
        cursor="nwse-resize"
        onPointerDown={startCornerDrag("nw")}
        className="-left-1.5 -top-1.5"
      />
      <HandleDot
        label="Tarik sudut kanan atas"
        cursor="nesw-resize"
        onPointerDown={startCornerDrag("ne")}
        className="-right-1.5 -top-1.5"
      />
      <HandleDot
        label="Tarik sudut kiri bawah"
        cursor="nesw-resize"
        onPointerDown={startCornerDrag("sw")}
        className="-bottom-1.5 -left-1.5"
      />
      <HandleDot
        label="Tarik sudut kanan bawah"
        cursor="nwse-resize"
        onPointerDown={startCornerDrag("se")}
        className="-bottom-1.5 -right-1.5"
      />
    </>
  )
}
