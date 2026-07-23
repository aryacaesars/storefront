"use client"

import { cn } from "@/lib/utils"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { CanvasFreeTextLayer } from "@/features/builder/components/canvas/CanvasFreeTextLayer"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
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
} from "@/themes/engine/cta-canvas"

const SPEC = getCtaCanvasSpec("fashion", "newsletter-cta")!

export function NewsletterCTA({ settings, blocks, canvas }: SectionProps) {
  const primaryLabel = getStringSetting(settings, "primaryLabel", "SUBSCRIBE")

  const contentBlock = blocks?.[0]
  const contentSettings = contentBlock?.settings as Record<string, unknown> | undefined
  const canvasImages = parseCanvasImages(contentSettings)
  const canvasTexts = resolveSectionCanvasTexts(
    "fashion",
    "newsletter-cta",
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

  function patchSetting(key: string, value: string) {
    if (!sectionId) return
    editor?.onSectionSettingsChange?.(sectionId, { [key]: value })
  }

  return (
    <section
      className="relative overflow-hidden bg-[var(--theme-text)]"
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

      <form
        className="absolute left-1/2 top-[58%] flex w-full max-w-sm -translate-x-1/2 px-6"
        onSubmit={(event) => {
          if (editable) event.preventDefault()
        }}
      >
        <input
          type="email"
          placeholder="Your email address"
          disabled={editable}
          className="h-11 flex-1 border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/30 disabled:cursor-default"
        />
        {editable ? (
          <div
            role="button"
            tabIndex={0}
            className="flex h-11 cursor-text items-center bg-white px-6 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--theme-text)] ring-offset-2 focus-within:ring-2 focus-within:ring-white/40"
            onClick={(event) => event.stopPropagation()}
          >
            <CanvasInlineText
              value={primaryLabel}
              onChange={(value) => patchSetting("primaryLabel", value)}
            />
          </div>
        ) : (
          <button
            type="submit"
            className="h-11 bg-white px-6 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--theme-text)] transition-colors hover:bg-stone-100"
          >
            {primaryLabel}
          </button>
        )}
      </form>
    </section>
  )
}
