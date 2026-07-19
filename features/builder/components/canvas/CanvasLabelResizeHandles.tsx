"use client"

import { useCallback, useRef } from "react"
import {
  CanvasTextBoundingBox,
  type BoxCorner,
  type BoxEdge,
} from "@/features/builder/components/canvas/CanvasTextBoundingBox"
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
type Edge = BoxEdge
type Corner = BoxCorner

interface CanvasLabelResizeHandlesProps {
  layout: CategoryLabelLayout
  containerRef: React.RefObject<HTMLElement | null>
  onResize: (patch: ResizePatch) => void
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
    <CanvasTextBoundingBox
      labelPrefix="judul"
      onEdgeDrag={startEdgeDrag}
      onCornerDrag={startCornerDrag}
    />
  )
}
