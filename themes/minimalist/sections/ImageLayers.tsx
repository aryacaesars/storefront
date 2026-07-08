"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { CanvasGridOverlay } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasResizeHandles } from "@/features/builder/components/canvas/CanvasResizeHandles"
import type { SectionProps } from "@/themes/engine/section-registry"
import type { BlockInstance } from "@/themes/engine/schema"
import {
  blockToImageLayer,
  defaultImageLayers,
  imageLayersCanvasHeight,
  IMAGE_LAYERS_DESIGN_HEIGHT,
  IMAGE_LAYERS_DESIGN_WIDTH,
  IMAGE_LAYERS_MOBILE_DESIGN_WIDTH,
  MIN_LAYER_HEIGHT,
  MAX_LAYER_HEIGHT,
  type ImageLayerData,
} from "@/themes/engine/image-layer-layout"

const DRAG_THRESHOLD = 4

interface ImageLayerFrameProps {
  layer: ImageLayerData
  editable: boolean
  selected: boolean
  scale: number
  designWidth: number
  canvasRef: React.RefObject<HTMLDivElement | null>
  onSelect: () => void
  onChange: (patch: Record<string, unknown>) => void
}

function ImageLayerFrame({
  layer,
  editable,
  selected,
  scale,
  designWidth,
  canvasRef,
  onSelect,
  onChange,
}: ImageLayerFrameProps) {
  const startFrameMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const startX = event.clientX
      const startY = event.clientY
      const originXPct = layer.xPct
      const originYPx = layer.yPx
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
            Math.min(100 - layer.wPct, Math.round((originXPct + dxPct) * 10) / 10),
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
    [canvasRef, layer, onChange, scale],
  )

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${layer.xPct}%`,
    top: `${layer.yPx * scale}px`,
    width: `${layer.wPct}%`,
    height: `${layer.hPx * scale}px`,
    zIndex: layer.zIndex,
  }

  const layout = {
    xPct: layer.xPct,
    yPx: layer.yPx,
    wPct: layer.wPct,
    hPx: layer.hPx,
  }

  if (!editable) {
    if (!layer.image.url) return null
    return (
      <div style={style} className="overflow-hidden rounded-xl">
        <CanvasImageFrame image={layer.image} interactive={false} onChange={() => {}} />
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      style={style}
      className="overflow-visible"
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
      {selected && (
        <button
          type="button"
          aria-label="Drag untuk pindah frame gambar"
          onPointerDown={startFrameMove}
          className="absolute -top-5 left-1/2 z-[35] flex h-5 -translate-x-1/2 cursor-grab touch-none items-center gap-1 rounded-full bg-indigo-500 px-2.5 shadow-md"
        >
          <span className="pointer-events-none select-none text-[9px] font-semibold text-white">
            ⠿ pindah
          </span>
        </button>
      )}

      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-xl",
          !layer.image.url && "bg-gray-100",
          selected && "ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent",
        )}
      >
        {!layer.image.url && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-center text-[11px] leading-relaxed text-gray-400">
              Klik untuk pilih<br />gambar di panel kiri
            </p>
          </div>
        )}
        <CanvasImageFrame image={layer.image} interactive={selected} onChange={onChange} />
      </div>

      {selected && (
        <CanvasResizeHandles
          layout={layout}
          gridRef={canvasRef}
          onResize={onChange}
          designWidth={designWidth}
          minHeightPx={MIN_LAYER_HEIGHT}
          maxHeightPx={MAX_LAYER_HEIGHT}
        />
      )}
    </div>
  )
}

export function ImageLayers({ blocks, canvas, isMobile = false }: SectionProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState(
    isMobile ? IMAGE_LAYERS_MOBILE_DESIGN_WIDTH : IMAGE_LAYERS_DESIGN_WIDTH,
  )

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      setMeasuredWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected)

  const layers: ImageLayerData[] = !blocks
    ? defaultImageLayers()
    : blocks.length > 0
      ? blocks.map((block: BlockInstance, index: number) => blockToImageLayer(block, index))
      : []

  const designWidth = isMobile ? IMAGE_LAYERS_MOBILE_DESIGN_WIDTH : IMAGE_LAYERS_DESIGN_WIDTH
  const scale = measuredWidth > 0 ? measuredWidth / designWidth : 1
  const designCanvasHeight = layers.length > 0
    ? imageLayersCanvasHeight(layers)
    : IMAGE_LAYERS_DESIGN_HEIGHT
  const canvasHeightPx = designCanvasHeight * scale

  if (!editable && layers.every((l) => !l.image.url)) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 @2xl:px-6 @2xl:py-14">
      <div
        ref={canvasRef}
        className={cn(
          "relative w-full",
          editable &&
            "min-h-[80px] rounded-2xl bg-gray-50/80 ring-1 ring-dashed ring-gray-300",
        )}
        style={{ height: canvasHeightPx }}
        onClick={
          editable
            ? (event) => {
                if (event.target === canvasRef.current) {
                  editor?.onSelectBlock?.(canvas!.sectionId, null)
                }
              }
            : undefined
        }
      >
        {editable && layers.length > 0 && (
          <CanvasGridOverlay canvasHeight={designCanvasHeight} scale={scale} />
        )}

        {layers.map((layer) => (
          <ImageLayerFrame
            key={layer.id}
            layer={layer}
            editable={editable}
            selected={Boolean(editable && editor?.selectedBlockId === layer.id)}
            scale={scale}
            designWidth={designWidth}
            canvasRef={canvasRef}
            onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, layer.id)}
            onChange={(patch) => editor?.onBlockChange?.(canvas!.sectionId, layer.id, patch)}
          />
        ))}

        {editable && layers.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-center text-[11px] text-gray-400">
              Tambah gambar dari panel kiri
            </p>
          </div>
        )}

        {editable && layers.length > 0 && !editor?.selectedBlockId && (
          <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-30 text-center text-[10px] text-gray-400">
            Klik frame untuk pilih · drag badge "pindah" untuk geser · handle biru untuk resize
          </p>
        )}
      </div>
    </section>
  )
}
