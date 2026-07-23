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
  labelResizeFromLeftEdge,
  labelResizeFromRightEdge,
  labelResizeFromTopEdge,
  MIN_LABEL_PCT,
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

  // Drag sudut = uniform scale ala box teks CTA: lebar & tinggi (→ font) membesar
  // dengan faktor sama, sudut berlawanan jadi anchor — box tidak bisa gepeng.
  const startCornerDrag = useCallback(
    (corner: Corner) => (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!containerRef.current) return

      const startX = event.clientX
      const startLayout = { ...layout }
      const anchorRight = startLayout.xPct + startLayout.wPct
      const anchorBottom = startLayout.yPct + startLayout.hPct
      const isEast = corner === "ne" || corner === "se"
      const isSouth = corner === "sw" || corner === "se"
      const session = createDragSession<ResizePatch>(event, (patch) => onResizeRef.current(patch))
      session.arm()

      session.listen((moveEvent) => {
        if (!containerRef.current) return
        const metrics = getContainerMetrics(containerRef.current)
        if (metrics.width <= 0) return

        const dxPct = ((moveEvent.clientX - startX) / metrics.width) * 100
        const rawW = isEast ? startLayout.wPct + dxPct : startLayout.wPct - dxPct
        const maxW = isEast ? 100 - startLayout.xPct : anchorRight
        const newW = Math.max(MIN_LABEL_PCT, Math.min(maxW, rawW))
        const factor = newW / startLayout.wPct

        const maxH = isSouth ? 100 - startLayout.yPct : anchorBottom
        const newH = Math.max(MIN_LABEL_PCT, Math.min(maxH, startLayout.hPct * factor))

        const round = (v: number) => Math.round(v * 10) / 10
        session.push({
          wPct: round(newW),
          hPct: round(newH),
          ...(isEast ? {} : { xPct: round(Math.max(0, anchorRight - newW)) }),
          ...(isSouth ? {} : { yPct: round(Math.max(0, anchorBottom - newH)) }),
        })
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
