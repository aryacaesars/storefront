"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import {
  CanvasTextBoundingBox,
  type BoxCorner,
  type BoxEdge,
} from "@/features/builder/components/canvas/CanvasTextBoundingBox"
import {
  updateTextInArray,
  type CanvasTextItem,
} from "@/themes/engine/canvas-text"
import {
  canvasElementDomKey,
  type SectionEditorState,
} from "@/themes/engine/section-editor"
import { fontLabelToCss } from "@/lib/themes/fonts"

const MIN_TEXT_WIDTH_PCT = 8
const MIN_FONT_PX = 10
const MAX_FONT_PX = 1000
/** Sama dengan title hero — drag baru aktif setelah pointer geser melewati ambang ini. */
const DRAG_THRESHOLD_PX = 4

interface CanvasFreeTextLayerProps {
  items: CanvasTextItem[]
  /** Section terseleksi (boleh klik untuk select). */
  editable: boolean
  /** Media block terseleksi (boleh drag/resize/edit). */
  interactive: boolean
  sectionId?: string
  blockId?: string
  editor?: SectionEditorState
  /** Lebar design untuk skala fontSize (default 1200). */
  designWidth?: number
  onItemsChange: (items: CanvasTextItem[]) => void
}

/**
 * Layer teks bebas di atas frame section — item dari settings `texts` pada
 * media block. Ditambahkan lewat sidebar Text; styling lewat floating toolbar.
 */
export function CanvasFreeTextLayer({
  items,
  editable,
  interactive,
  sectionId,
  blockId,
  editor,
  designWidth = 1200,
  onItemsChange,
}: CanvasFreeTextLayerProps) {
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
      className={cn("absolute inset-0 z-30", !editable && "pointer-events-none")}
      style={{ pointerEvents: "none" }}
    >
      {items.map((item) => (
        <CanvasFreeTextBox
          key={item.id}
          item={item}
          scale={scale}
          editable={editable}
          interactive={interactive}
          selected={
            selectedElement?.kind === "text" &&
            selectedElement.sectionId === sectionId &&
            selectedElement.blockId === blockId &&
            selectedElement.itemId === item.id
          }
          domKey={
            sectionId && blockId
              ? canvasElementDomKey({
                  kind: "text",
                  sectionId,
                  blockId,
                  itemId: item.id,
                })
              : undefined
          }
          containerRef={containerRef}
          onSelect={() => {
            if (!sectionId || !blockId || !editor) return
            editor.onSelectBlock?.(sectionId, blockId)
            editor.onSelectElement?.({
              kind: "text",
              sectionId,
              blockId,
              itemId: item.id,
            })
          }}
          onChange={(patch) => onItemsChange(updateTextInArray(items, item.id, patch))}
        />
      ))}
    </div>
  )
}

interface CanvasFreeTextBoxProps {
  item: CanvasTextItem
  scale: number
  editable: boolean
  interactive: boolean
  selected: boolean
  domKey?: string
  containerRef: React.RefObject<HTMLDivElement | null>
  onSelect: () => void
  onChange: (patch: Partial<CanvasTextItem>) => void
}

function CanvasFreeTextBox({
  item,
  scale,
  editable,
  interactive,
  selected,
  domKey,
  containerRef,
  onSelect,
  onChange,
}: CanvasFreeTextBoxProps) {
  const stateRef = useRef({ item, onChange })
  stateRef.current = { item, onChange }

  function frameSize() {
    const el = containerRef.current
    return { w: el?.clientWidth || 1, h: el?.clientHeight || 1 }
  }

  // Pola sama dengan HeroTitleLine: pointer down = select, drag jalan setelah
  // melewati threshold (blur contentEditable dulu) — klik tetap bisa masuk mode
  // edit teks, drag n drop tetap mulus. Handle chrome stopPropagation sendiri.
  function startMove(event: React.PointerEvent<HTMLElement>) {
    if (!editable) return
    event.stopPropagation()
    onSelect()
    const startX = event.clientX
    const startY = event.clientY
    const { x: ox, y: oy } = stateRef.current.item
    const { w, h } = frameSize()
    let dragging = false

    function onPointerMove(e: PointerEvent) {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (!dragging && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD_PX) return
      dragging = true
      e.preventDefault()
      const active = document.activeElement
      if (active instanceof HTMLElement && active.isContentEditable) {
        active.blur()
      }
      stateRef.current.onChange({
        x: Math.round(Math.max(-10, Math.min(95, ox + (dx / w) * 100)) * 10) / 10,
        y: Math.round(Math.max(-10, Math.min(95, oy + (dy / h) * 100)) * 10) / 10,
      })
    }
    function onUp() {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onUp)
  }

  function startWidthResize(edge: "left" | "right") {
    return function (event: React.PointerEvent<HTMLElement>) {
      event.preventDefault()
      event.stopPropagation()
      const startX = event.clientX
      const { x: ox, width: ow } = stateRef.current.item
      const { w } = frameSize()
      const rightEdge = ox + ow

      function onPointerMove(e: PointerEvent) {
        const dxPct = ((e.clientX - startX) / w) * 100
        if (edge === "right") {
          stateRef.current.onChange({
            width:
              Math.round(Math.max(MIN_TEXT_WIDTH_PCT, Math.min(100, ow + dxPct)) * 10) / 10,
          })
        } else {
          const x = Math.max(-10, Math.min(rightEdge - MIN_TEXT_WIDTH_PCT, ox + dxPct))
          stateRef.current.onChange({
            x: Math.round(x * 10) / 10,
            width: Math.round((rightEdge - x) * 10) / 10,
          })
        }
      }
      function onUp() {
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerup", onUp)
      }
      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onUp)
    }
  }

  /** flipX/flipY: tarik menjauh dari tengah = perbesar; 0 = abaikan sumbu itu. */
  function startFontScale(flipX: 0 | 1 | -1, flipY: 0 | 1 | -1) {
    return function (event: React.PointerEvent<HTMLElement>) {
      event.preventDefault()
      event.stopPropagation()
      const startX = event.clientX
      const startY = event.clientY
      const startFont = stateRef.current.item.fontSize

      function onPointerMove(e: PointerEvent) {
        const delta =
          ((e.clientX - startX) * flipX + (e.clientY - startY) * flipY) / 2
        const next = startFont + delta / Math.max(scale, 0.05)
        stateRef.current.onChange({
          fontSize: Math.round(Math.max(MIN_FONT_PX, Math.min(MAX_FONT_PX, next))),
        })
      }
      function onUp() {
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerup", onUp)
      }
      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onUp)
    }
  }

  const textStyle: React.CSSProperties = {
    fontFamily: item.fontFamily
      ? fontLabelToCss(item.fontFamily)
      : "var(--theme-heading-font)",
    fontSize: `${Math.max(8, item.fontSize * scale)}px`,
    fontWeight: item.fontWeight ?? 700,
    fontStyle: item.fontStyle ?? "normal",
    lineHeight: item.lineHeight ?? 1.1,
    color: item.color ?? "#111111",
    ...(item.letterSpacing !== undefined && { letterSpacing: `${item.letterSpacing}em` }),
    ...(item.textDecoration && { textDecoration: item.textDecoration }),
    ...(item.textTransform && { textTransform: item.textTransform }),
    ...(item.opacity !== undefined && item.opacity !== 100 && { opacity: item.opacity / 100 }),
  }

  return (
    <div
      data-canvas-element={domKey}
      className={cn("absolute", editable && "cursor-move")}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.width}%`,
        pointerEvents: editable ? "auto" : "none",
        zIndex: selected ? 40 : 30,
      }}
      onPointerDown={editable ? startMove : undefined}
      onClick={
        editable
          ? (e) => {
              e.stopPropagation()
              onSelect()
            }
          : undefined
      }
    >
      {interactive && selected ? (
        <CanvasInlineText
          value={item.value}
          onChange={(value) => onChange({ value })}
          className="block w-full"
          style={textStyle}
        />
      ) : (
        <p className="block w-full" style={textStyle}>
          {item.value}
        </p>
      )}

      {interactive && selected && (
        <CanvasTextBoundingBox
          labelPrefix="teks"
          onEdgeDrag={(edge: BoxEdge) =>
            edge === "left" || edge === "right"
              ? startWidthResize(edge)
              : startFontScale(0, edge === "top" ? -1 : 1)
          }
          onCornerDrag={(corner: BoxCorner) =>
            startFontScale(
              corner === "nw" || corner === "sw" ? -1 : 1,
              corner === "nw" || corner === "ne" ? -1 : 1,
            )
          }
        />
      )}
    </div>
  )
}
