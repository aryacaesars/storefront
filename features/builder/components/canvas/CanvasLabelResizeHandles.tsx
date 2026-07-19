"use client"

import { useCallback, useRef } from "react"
import {
  CanvasTextBoundingBox,
  type BoxCorner,
  type BoxEdge,
} from "@/features/builder/components/canvas/CanvasTextBoundingBox"
import { createDragSession } from "@/features/builder/components/canvas/visual-frame"
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

      const startLayout = { ...layout }
      const session = createDragSession<ResizePatch>(event, (patch) => onResizeRef.current(patch))
      session.arm()

      session.listen((moveEvent) => {
        if (!containerRef.current) return
        const metrics = getContainerMetrics(containerRef.current)
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
        session.push(patch)
      })
    },
    [containerRef, layout],
  )

  const startCornerDrag = useCallback(
    (corner: Corner) => (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!containerRef.current) return

      const startLayout = { ...layout }
      const session = createDragSession<ResizePatch>(event, (patch) => onResizeRef.current(patch))
      session.arm()

      session.listen((moveEvent) => {
        if (!containerRef.current) return
        const metrics = getContainerMetrics(containerRef.current)
        session.push(
          labelResizeFromCorner(
            moveEvent.clientX,
            moveEvent.clientY,
            metrics,
            startLayout,
            corner,
          ),
        )
      })
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
