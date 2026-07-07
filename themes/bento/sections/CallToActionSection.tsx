"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import { parseImageTransform } from "@/themes/bento/sections/category-grid-layout"
import {
  parseCanvasImages,
  updateImageInArray,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"

export function CallToActionSection({ settings, blocks, canvas }: SectionProps) {
  const title = getStringSetting(settings, "title", "Grab It Fast And Claim 10% Discount")
  const primaryLabel = getStringSetting(settings, "primaryLabel", "Buy Now")

  const [activeImageId, setActiveImageId] = useState<string | null>(null)

  const imageBlock = blocks?.[0]
  const imageSettings = imageBlock?.settings as Record<string, unknown> | undefined
  const image = parseImageTransform(imageSettings)
  const canvasImages = parseCanvasImages(imageSettings)

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected && imageBlock)
  const interactive = editable && editor?.selectedBlockId === imageBlock?.id

  function onMultiImageChange(imageId: string, patch: Partial<CanvasImageItem>) {
    if (!imageBlock || !editor) return
    const updated = updateImageInArray(parseCanvasImages(imageSettings), imageId, patch)
    editor.onBlockChange?.(canvas!.sectionId, imageBlock.id, { images: updated })
  }

  return (
    // Section clips to its own bounds (no page scroll); the card frame does not.
    <section className="overflow-hidden px-4 pb-16 pt-6 @2xl:px-6">
      <div
        className="relative mx-auto flex max-w-7xl items-center justify-end overflow-hidden rounded-[40px] px-10 py-14 @2xl:overflow-visible @2xl:rounded-[63px]"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        {/* Uploaded images — drag, resize, rotate (same wrapper as Hero), bleeds beyond the card frame */}
        {canvasImages.length > 0 && imageBlock && (
          <div
            className={cn("absolute inset-0", !editable && "pointer-events-none")}
            onClick={
              editable
                ? (event) => {
                    event.stopPropagation()
                    editor?.onSelectBlock?.(canvas!.sectionId, imageBlock.id)
                    setActiveImageId(null)
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
                onSelect={() => {
                  setActiveImageId(img.id)
                  editor?.onSelectBlock?.(canvas!.sectionId, imageBlock.id)
                }}
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
                    editor?.onSelectBlock?.(canvas!.sectionId, imageBlock.id)
                  }
                : undefined
            }
          >
            <CanvasImageFrame
              image={image}
              interactive={interactive}
              onChange={(patch) =>
                editor?.onBlockChange?.(canvas!.sectionId, imageBlock.id, patch)
              }
            />
          </div>
        )}

        {/* Text + CTA sit above the image */}
        <div className="relative z-10 flex flex-col items-end gap-6">
          <h2
            className="max-w-lg text-right text-3xl font-bold capitalize leading-tight text-white @2xl:text-[2.75rem]"
            style={{
              fontFamily: "var(--theme-heading-font)",
              textShadow: "31px 33px 58px rgba(0,0,0,0.54)",
            }}
          >
            {title}
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center rounded-[33px] bg-white px-10 py-3 text-base font-bold capitalize transition-opacity hover:opacity-90"
            style={{
              color: "#b40000",
              boxShadow: "13px 18px 11px rgba(0,0,0,0.25)",
            }}
          >
            {primaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
