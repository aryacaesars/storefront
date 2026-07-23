"use client"

import { cn } from "@/lib/utils"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { CanvasFreeTextLayer } from "@/features/builder/components/canvas/CanvasFreeTextLayer"
import { CanvasButtonLayer } from "@/features/builder/components/canvas/CanvasButtonLayer"
import type { SectionProps } from "@/themes/engine/section-registry"
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

const SPEC = getCtaCanvasSpec("bold", "call-to-action")!

export function CallToActionSection({ settings, blocks, canvas }: SectionProps) {
  const contentBlock = blocks?.[0]
  const contentSettings = contentBlock?.settings as Record<string, unknown> | undefined
  const canvasImages = parseCanvasImages(contentSettings)
  const canvasTexts = resolveSectionCanvasTexts(
    "bold",
    "call-to-action",
    settings,
    contentSettings,
  )
  const canvasButtons = resolveSectionCanvasButtons(
    "bold",
    "call-to-action",
    settings,
    contentSettings,
  )

  const editor = canvas?.editor
  const sectionId = canvas?.sectionId
  const isSectionSelected = editor?.selectedSectionId === sectionId
  const editable = Boolean(editor)
  const interactive =
    isSectionSelected && editor?.selectedBlockId === contentBlock?.id

  const selectedElement = editor?.selectedElement ?? null
  const activeImageId =
    selectedElement?.kind === "image" &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === contentBlock?.id
      ? selectedElement.itemId ?? null
      : null

  const elementDomKey = (
    kind: SelectedElementKind,
    blockId: string | undefined,
    itemId?: string,
  ) =>
    blockId && sectionId
      ? canvasElementDomKey({ kind, sectionId, blockId, itemId })
      : undefined

  function onMultiImageChange(imageId: string, patch: Partial<CanvasImageItem>) {
    if (!contentBlock || !editor) return
    const updated = updateImageInArray(
      parseCanvasImages(contentSettings),
      imageId,
      patch,
    )
    editor.onBlockChange?.(canvas!.sectionId, contentBlock.id, { images: updated })
  }

  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{ aspectRatio: `${SPEC.frame.width} / ${SPEC.frame.height}` }}
    >
      <CanvasFreeTextLayer
        items={canvasTexts}
        editable={editable}
        interactive={interactive}
        sectionId={sectionId}
        blockId={contentBlock?.id}
        editor={editor}
        designWidth={SPEC.frame.width}
        renderLayer="behind"
        onItemsChange={(texts) =>
          contentBlock &&
          editor?.onBlockChange?.(canvas!.sectionId, contentBlock.id, { texts })
        }
      />

      {canvasImages.length > 0 && contentBlock && (
        <div
          className={cn("absolute inset-0", !editable && "pointer-events-none")}
          onClick={
            editable
              ? (event) => {
                  event.stopPropagation()
                  editor?.onSelectBlock?.(canvas!.sectionId, contentBlock.id)
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
              domKey={elementDomKey("image", contentBlock.id, img.id)}
              cropping={
                editor?.croppingElementKey ===
                elementDomKey("image", contentBlock.id, img.id)
              }
              onSelect={() => {
                if (!editor || !sectionId) return
                editor.onSelectBlock?.(sectionId, contentBlock.id)
                editor.onSelectElement?.({
                  kind: "image",
                  sectionId,
                  blockId: contentBlock.id,
                  itemId: img.id,
                })
              }}
              onChange={(patch) => onMultiImageChange(img.id, patch)}
            />
          ))}
        </div>
      )}

      <CanvasFreeTextLayer
        items={canvasTexts}
        editable={editable}
        interactive={interactive}
        sectionId={sectionId}
        blockId={contentBlock?.id}
        editor={editor}
        designWidth={SPEC.frame.width}
        onItemsChange={(texts) =>
          contentBlock &&
          editor?.onBlockChange?.(canvas!.sectionId, contentBlock.id, { texts })
        }
      />

      <CanvasButtonLayer
        items={canvasButtons}
        editable={editable}
        sectionId={sectionId}
        blockId={contentBlock?.id}
        editor={editor}
        designWidth={SPEC.frame.width}
        onItemsChange={(buttons) =>
          contentBlock &&
          editor?.onBlockChange?.(canvas!.sectionId, contentBlock.id, { buttons })
        }
      />
    </section>
  )
}
