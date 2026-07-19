"use client"

import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { CanvasFreeTextLayer } from "@/features/builder/components/canvas/CanvasFreeTextLayer"
import { CanvasButtonLayer } from "@/features/builder/components/canvas/CanvasButtonLayer"
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
import {
  getCtaCanvasSpec,
  resolveSectionCanvasTexts,
  resolveSectionCanvasButtons,
} from "@/themes/engine/cta-canvas"

const SPEC = getCtaCanvasSpec("minimalist", "call-to-action")!

export function CallToActionSection({ settings, blocks, canvas }: SectionProps) {
  const imageBlock = blocks?.[0]
  const imageSettings = imageBlock?.settings as Record<string, unknown> | undefined
  const image = parseImageTransform(imageSettings)
  const canvasImages = parseCanvasImages(imageSettings)
  const canvasTexts = resolveSectionCanvasTexts(
    "minimalist",
    "call-to-action",
    settings,
    imageSettings,
  )
  const canvasButtons = resolveSectionCanvasButtons(
    "minimalist",
    "call-to-action",
    settings,
    imageSettings,
  )

  const editor = canvas?.editor
  const sectionId = canvas?.sectionId
  const isSectionSelected = editor?.selectedSectionId === sectionId
  const editable = Boolean(editor)
  const interactive = isSectionSelected && editor?.selectedBlockId === imageBlock?.id

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

  function onMultiImageChange(imageId: string, patch: Partial<CanvasImageItem>) {
    if (!imageBlock || !editor) return
    const updated = updateImageInArray(parseCanvasImages(imageSettings), imageId, patch)
    editor.onBlockChange?.(canvas!.sectionId, imageBlock.id, { images: updated })
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--theme-primary)",
        aspectRatio: `${SPEC.frame.width} / ${SPEC.frame.height}`,
      }}
    >
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
              cropping={
                editor?.croppingElementKey ===
                elementDomKey("image", imageBlock.id, img.id)
              }
              onSelect={() => selectElement("image", imageBlock.id, img.id)}
              onChange={(patch) => onMultiImageChange(img.id, patch)}
            />
          ))}
        </div>
      )}

      {canvasImages.length === 0 && Boolean(image.url) && imageBlock && (
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
        designWidth={SPEC.frame.width}
        onItemsChange={(texts) =>
          imageBlock &&
          editor?.onBlockChange?.(canvas!.sectionId, imageBlock.id, { texts })
        }
      />

      <CanvasButtonLayer
        items={canvasButtons}
        editable={editable}
        sectionId={sectionId}
        blockId={imageBlock?.id}
        editor={editor}
        designWidth={SPEC.frame.width}
        onItemsChange={(buttons) =>
          imageBlock &&
          editor?.onBlockChange?.(canvas!.sectionId, imageBlock.id, { buttons })
        }
      />
    </section>
  )
}
