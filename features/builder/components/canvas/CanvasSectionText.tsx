"use client"

import { cn } from "@/lib/utils"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import {
  labelStyleOverrides,
  parseLabelStyle,
} from "@/themes/bento/sections/category-grid-layout"
import {
  canvasElementDomKey,
  isSameSelectedElement,
} from "@/themes/engine/section-editor"
import type { SectionCanvasContext } from "@/themes/engine/section-registry"
import type { BlockInstance } from "@/themes/engine/schema"

interface CanvasSectionTextProps {
  canvas?: SectionCanvasContext
  /** Host block type `section-text` yang menyimpan teks + style overrides. */
  block?: BlockInstance
  /** Teks default saat block belum ada / label kosong. */
  fallback: string
  /** Basis ukuran font (px) yang dikalikan labelSizeScale. */
  basePx: number
  as?: "h2" | "h3" | "p"
  className?: string
  baseStyle?: React.CSSProperties
}

function num(value: unknown, fallbackValue: number): number {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallbackValue
}

/**
 * Teks section yang bisa diklik di builder — muncul di floating toolbar
 * (typography + warna) memakai keys label* yang sama dengan label category.
 * Di storefront live (canvas undefined) render statis dengan style overrides.
 */
export function CanvasSectionText({
  canvas,
  block,
  fallback,
  basePx,
  as: Tag = "p",
  className,
  baseStyle,
}: CanvasSectionTextProps) {
  const settings = block?.settings as Record<string, unknown> | undefined
  const text =
    typeof settings?.label === "string" && settings.label !== ""
      ? settings.label
      : fallback
  const ls = parseLabelStyle(settings)
  const style: React.CSSProperties = {
    ...baseStyle,
    fontSize: `${Math.max(8, num(settings?.labelBasePx, basePx) * ls.sizeScale)}px`,
    ...labelStyleOverrides(ls),
  }

  const editor = canvas?.editor
  const editable = Boolean(
    editor && block && canvas && editor.selectedSectionId === canvas.sectionId,
  )

  if (!editable || !editor || !block || !canvas) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    )
  }

  const elementRef = {
    kind: "text" as const,
    sectionId: canvas.sectionId,
    blockId: block.id,
    itemId: "label",
  }
  const selected = isSameSelectedElement(editor.selectedElement, elementRef)

  const select = () => {
    editor.onSelectBlock?.(canvas.sectionId, block.id)
    editor.onSelectElement?.(elementRef)
  }

  return (
    <div
      data-canvas-element={canvasElementDomKey(elementRef)}
      className={cn("cursor-pointer", selected && "ring-2 ring-indigo-400")}
      onClick={(event) => {
        event.stopPropagation()
        select()
      }}
    >
      {selected ? (
        <CanvasInlineText
          value={text}
          onChange={(label) =>
            editor.onBlockChange?.(canvas.sectionId, block.id, { label })
          }
          className={className}
          style={style}
        />
      ) : (
        <Tag className={className} style={style}>
          {text}
        </Tag>
      )}
    </div>
  )
}

/** Cari host block `section-text` berdasarkan id (fallback: block pertama bertipe itu). */
export function findSectionTextBlock(
  blocks: BlockInstance[] | undefined,
  blockId: string,
): BlockInstance | undefined {
  return (
    blocks?.find((b) => b.id === blockId && b.type === "section-text") ??
    undefined
  )
}
