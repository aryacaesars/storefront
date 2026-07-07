"use client"

import { useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  labelResizeFromBottomEdge,
  labelResizeFromCorner,
  labelResizeFromLeftEdge,
  labelResizeFromRightEdge,
  labelResizeFromTopEdge,
  type CategoryLabelLayout,
  type LabelContainerMetrics,
} from "@/themes/bento/sections/category-grid-layout"

type ResizePatch = Partial<CategoryLabelLayout>
type Edge = "top" | "right" | "bottom" | "left"
type Corner = "nw" | "ne" | "se" | "sw"

interface CanvasLabelResizeHandlesProps {
  layout: CategoryLabelLayout
  containerRef: React.RefObject<HTMLElement | null>
  onResize: (patch: ResizePatch) => void
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
        "pointer-events-auto absolute z-[40] flex h-5 w-5 items-center justify-center rounded-full touch-none",
        "border-2 border-white bg-violet-500 shadow-md",
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
        "pointer-events-auto absolute z-[40] rounded-full bg-white/95 shadow ring-1 ring-violet-400/70 touch-none",
        "transition-transform hover:scale-105 active:bg-violet-50",
        className,
      )}
      style={{ cursor }}
    />
  )
}

function getContainerMetrics(element: HTMLElement): LabelContainerMetrics {
  const rect = element.getBoundingClientRect()
  return { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
}

export function CanvasLabelResizeHandles({
  layout,
  containerRef,
  onResize,
}: CanvasLabelResizeHandlesProps) {
  const onResizeRef = useRef(onResize)
  onResizeRef.current = onResize

  const startEdgeDrag = useCallback(
    (edge: Edge) => (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!containerRef.current) return

      event.currentTarget.setPointerCapture(event.pointerId)
      const startLayout = { ...layout }
      const handleEl = event.currentTarget

      function onMove(moveEvent: PointerEvent) {
        if (!containerRef.current) return
        moveEvent.preventDefault()
        const metrics = getContainerMetrics(containerRef.current!)
        let patch: ResizePatch
        switch (edge) {
          case "left":
            patch = labelResizeFromLeftEdge(moveEvent.clientX, metrics, startLayout)
            break
          case "right":
            patch = labelResizeFromRightEdge(moveEvent.clientX, metrics, startLayout)
            break
          case "top":
            patch = labelResizeFromTopEdge(moveEvent.clientY, metrics, startLayout)
            break
          case "bottom":
            patch = labelResizeFromBottomEdge(moveEvent.clientY, metrics, startLayout)
            break
        }
        onResizeRef.current(patch)
      }

      function onUp(moveEvent: PointerEvent) {
        if (handleEl.hasPointerCapture(moveEvent.pointerId)) {
          handleEl.releasePointerCapture(moveEvent.pointerId)
        }
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
        window.removeEventListener("pointercancel", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
      window.addEventListener("pointercancel", onUp)
    },
    [containerRef, layout],
  )

  const startCornerDrag = useCallback(
    (corner: Corner) => (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!containerRef.current) return

      event.currentTarget.setPointerCapture(event.pointerId)
      const startLayout = { ...layout }
      const handleEl = event.currentTarget

      function onMove(moveEvent: PointerEvent) {
        if (!containerRef.current) return
        moveEvent.preventDefault()
        const metrics = getContainerMetrics(containerRef.current!)
        onResizeRef.current(
          labelResizeFromCorner(moveEvent.clientX, moveEvent.clientY, metrics, startLayout, corner),
        )
      }

      function onUp(moveEvent: PointerEvent) {
        if (handleEl.hasPointerCapture(moveEvent.pointerId)) {
          handleEl.releasePointerCapture(moveEvent.pointerId)
        }
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
        window.removeEventListener("pointercancel", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
      window.addEventListener("pointercancel", onUp)
    },
    [containerRef, layout],
  )

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-sm ring-2 ring-violet-500 ring-offset-1 ring-offset-transparent"
      />

      <HandleBar
        label="Tarik atas judul"
        cursor="ns-resize"
        onPointerDown={startEdgeDrag("top")}
        className="left-1/2 top-0 h-2 w-10 -translate-x-1/2 -translate-y-1/2"
      />
      <HandleBar
        label="Tarik bawah judul"
        cursor="ns-resize"
        onPointerDown={startEdgeDrag("bottom")}
        className="bottom-0 left-1/2 h-2 w-10 -translate-x-1/2 translate-y-1/2"
      />
      <HandleBar
        label="Tarik kiri judul"
        cursor="ew-resize"
        onPointerDown={startEdgeDrag("left")}
        className="left-0 top-1/2 h-10 w-2 -translate-x-1/2 -translate-y-1/2"
      />
      <HandleBar
        label="Tarik kanan judul"
        cursor="ew-resize"
        onPointerDown={startEdgeDrag("right")}
        className="right-0 top-1/2 h-10 w-2 translate-x-1/2 -translate-y-1/2"
      />

      <HandleDot
        label="Tarik sudut kiri atas judul"
        cursor="nwse-resize"
        onPointerDown={startCornerDrag("nw")}
        className="-left-2 -top-2"
      />
      <HandleDot
        label="Tarik sudut kanan atas judul"
        cursor="nesw-resize"
        onPointerDown={startCornerDrag("ne")}
        className="-right-2 -top-2"
      />
      <HandleDot
        label="Tarik sudut kiri bawah judul"
        cursor="nesw-resize"
        onPointerDown={startCornerDrag("sw")}
        className="-bottom-2 -left-2"
      />
      <HandleDot
        label="Tarik sudut kanan bawah judul"
        cursor="nwse-resize"
        onPointerDown={startCornerDrag("se")}
        className="-bottom-2 -right-2"
      />
    </>
  )
}
