"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { CanvasFreeTextLayer } from "@/features/builder/components/canvas/CanvasFreeTextLayer"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import { parseImageTransform } from "@/themes/bento/sections/category-grid-layout"
import {
  canvasElementDomKey,
  type SelectedElementKind,
} from "@/themes/engine/section-editor"
import {
  parseCanvasImages,
  updateImageInArray,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"
import { parseCanvasTexts } from "@/themes/engine/canvas-text"

export function CallToActionSection({ settings, blocks, canvas }: SectionProps) {
  const title = getStringSetting(settings, "title", "Experience the Art of Less")
  const primaryLabel = getStringSetting(settings, "primaryLabel", "Explore Collections")
  const secondaryLabel = getStringSetting(settings, "secondaryLabel", "Read the Journal")

  const imageBlock = blocks?.[0]
  const imageSettings = imageBlock?.settings as Record<string, unknown> | undefined
  const image = parseImageTransform(imageSettings)
  const canvasImages = parseCanvasImages(imageSettings)
  const canvasTexts = parseCanvasTexts(imageSettings)

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected && imageBlock)
  const interactive = editable && editor?.selectedBlockId === imageBlock?.id
  const inBuilder = Boolean(editor)

  const sectionId = canvas?.sectionId
  const selectedElement = editor?.selectedElement ?? null
  const activeImageId =
    selectedElement?.kind === "image" &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === imageBlock?.id
      ? selectedElement.itemId ?? null
      : null

  const selectElement = (
    kind: SelectedElementKind,
    blockId: string | undefined,
    itemId?: string,
  ) => {
    if (!blockId || !sectionId || !editor) return
    editor.onSelectBlock?.(sectionId, blockId)
    editor.onSelectElement?.({ kind, sectionId, blockId, itemId })
  }

  const elementDomKey = (
    kind: SelectedElementKind,
    blockId: string | undefined,
    itemId?: string,
  ) =>
    blockId && sectionId
      ? canvasElementDomKey({ kind, sectionId, blockId, itemId })
      : undefined

  function guardBuilderClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (inBuilder) event.preventDefault()
  }

  function onMultiImageChange(imageId: string, patch: Partial<CanvasImageItem>) {
    if (!imageBlock || !editor) return
    const updated = updateImageInArray(parseCanvasImages(imageSettings), imageId, patch)
    editor.onBlockChange?.(canvas!.sectionId, imageBlock.id, { images: updated })
  }

  return (
    <section
      className="relative overflow-hidden px-6 py-24 text-center"
      style={{ backgroundColor: "var(--theme-primary)" }}
    >
      {/* Uploaded images — drag, resize, rotate (same wrapper as Hero) */}
      {canvasImages.length > 0 && imageBlock && (
        <div
          className={cn("absolute inset-0", !editable && "pointer-events-none")}
          onClick={
            editable
              ? (event) => {
                  event.stopPropagation()
                  editor?.onSelectBlock?.(canvas!.sectionId, imageBlock.id)
                  editor?.onSelectElement?.(null)
                }
              : undefined
          }
        >
          {canvasImages.map((img) => (
            <CanvasMultiImageItem
              key={img.id}
              item={img}
              selected={interactive && activeImageId === img.id}
              editable={interactive}
              domKey={elementDomKey("image", imageBlock.id, img.id)}
                cropping={editor?.croppingElementKey === elementDomKey("image", imageBlock.id, img.id)}
              onSelect={() => selectElement("image", imageBlock.id, img.id)}
              onChange={(patch) => onMultiImageChange(img.id, patch)}
            />
          ))}
        </div>
      )}

      {/* Fallback: single legacy image when images array is empty */}
      {canvasImages.length === 0 && (image.url || editable) && imageBlock && (
        <div
          className={cn("absolute inset-0", !editable && "pointer-events-none")}
          onClick={
            editable
              ? (event) => {
                  event.stopPropagation()
                  selectElement("image", imageBlock.id)
                }
              : undefined
          }
        >
          <CanvasImageFrame
            image={image}
            interactive={interactive}
            domKey={elementDomKey("image", imageBlock.id)}
            onChange={(patch) =>
              editor?.onBlockChange?.(canvas!.sectionId, imageBlock.id, patch)
            }
          />
        </div>
      )}

      <CanvasFreeTextLayer
        items={canvasTexts}
        editable={editable}
        interactive={interactive}
        sectionId={sectionId}
        blockId={imageBlock?.id}
        editor={editor}
        onItemsChange={(texts) =>
          imageBlock && editor?.onBlockChange?.(canvas!.sectionId, imageBlock.id, { texts })
        }
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2
          className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {title}
        </h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            onClick={guardBuilderClick}
            className="inline-flex h-11 items-center border border-white px-8 text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-white hover:text-[var(--theme-primary)]"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/about"
            onClick={guardBuilderClick}
            className="inline-flex h-11 items-center px-8 text-xs font-bold tracking-[0.14em] text-white/80 uppercase transition-colors hover:text-white"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
