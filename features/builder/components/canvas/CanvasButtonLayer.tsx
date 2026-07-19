"use client"

import { useEffect, useRef, useState } from "react"
import { CanvasBoundButton } from "@/features/builder/components/canvas/CanvasBoundButton"
import {
  updateButtonInArray,
  type CanvasButtonItem,
} from "@/themes/engine/canvas-button"
import {
  canvasElementDomKey,
  type SectionEditorState,
} from "@/themes/engine/section-editor"

interface CanvasButtonLayerProps {
  items: CanvasButtonItem[]
  /** Section terseleksi / builder aktif (boleh klik, drag, resize). */
  editable: boolean
  sectionId?: string
  blockId?: string
  editor?: SectionEditorState
  /** Lebar design untuk skala yPx/hPx (default 1200). */
  designWidth?: number
  /** Tujuan link saat render publik (item.href menang bila ada). */
  defaultHref?: string
  onItemsChange: (items: CanvasButtonItem[]) => void
}

/**
 * Layer tombol di atas frame section — item dari settings `buttons` pada media
 * block. Analog `CanvasFreeTextLayer` untuk teks; styling lewat floating
 * toolbar.
 */
export function CanvasButtonLayer({
  items,
  editable,
  sectionId,
  blockId,
  editor,
  designWidth = 1200,
  defaultHref = "/products",
  onItemsChange,
}: CanvasButtonLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      if (width > 0) setScale(width / designWidth)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [designWidth])

  if (items.length === 0) return null

  const selectedElement = editor?.selectedElement

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-30"
      style={{ pointerEvents: "none" }}
    >
      {items.map((item) => (
        <CanvasBoundButton
          key={item.id}
          label={item.label}
          layout={{ xPct: item.xPct, wPct: item.wPct, yPx: item.yPx, hPx: item.hPx }}
          href={item.href || defaultHref}
          editable={editable}
          selected={
            selectedElement?.kind === "button" &&
            selectedElement.sectionId === sectionId &&
            selectedElement.blockId === blockId &&
            selectedElement.itemId === item.id
          }
          scale={scale}
          designWidth={designWidth}
          frameRef={containerRef}
          bgColor={item.bgColor}
          textColor={item.textColor}
          variant={item.variant}
          shape={item.shape}
          radius={item.radius}
          domKey={
            sectionId && blockId
              ? canvasElementDomKey({
                  kind: "button",
                  sectionId,
                  blockId,
                  itemId: item.id,
                })
              : undefined
          }
          onSelect={() => {
            if (!sectionId || !blockId || !editor) return
            editor.onSelectBlock?.(sectionId, blockId)
            editor.onSelectElement?.({
              kind: "button",
              sectionId,
              blockId,
              itemId: item.id,
            })
          }}
          onChange={(patch) =>
            onItemsChange(
              updateButtonInArray(items, item.id, patch as Partial<CanvasButtonItem>),
            )
          }
        />
      ))}
    </div>
  )
}
