"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { CanvasGridOverlay } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasPositionedBox } from "@/features/builder/components/canvas/CanvasPositionedBox"
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
          <CanvasPositionedBox
            key={layer.id}
            layout={{
              xPct: layer.xPct,
              yPx: layer.yPx,
              wPct: layer.wPct,
              hPx: layer.hPx,
            }}
            scale={scale}
            designWidth={designWidth}
            canvasRef={canvasRef}
            editable={editable}
            selected={Boolean(editable && editor?.selectedBlockId === layer.id)}
            onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, layer.id)}
            onChange={(patch) => editor?.onBlockChange?.(canvas!.sectionId, layer.id, patch)}
            minHeightPx={MIN_LAYER_HEIGHT}
            maxHeightPx={MAX_LAYER_HEIGHT}
            zIndex={layer.zIndex}
            isEmpty={!layer.image.url}
            hideWhenEmpty
            showSelectionRing={false}
            innerClassName="rounded-xl"
            emptyPlaceholder={
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p className="text-center text-[11px] leading-relaxed text-gray-400">
                  Klik untuk pilih
                  <br />
                  gambar di panel kiri
                </p>
              </div>
            }
          >
            <CanvasImageFrame
              image={layer.image}
              interactive={editable && editor?.selectedBlockId === layer.id}
              onChange={(patch) =>
                editor?.onBlockChange?.(canvas!.sectionId, layer.id, patch)
              }
            />
          </CanvasPositionedBox>
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
            Klik elemen untuk pilih · drag box untuk geser · handle biru untuk resize
          </p>
        )}
      </div>
    </section>
  )
}
