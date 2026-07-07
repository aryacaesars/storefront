"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { CanvasGridOverlay } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasHeroCta } from "@/features/builder/components/canvas/CanvasHeroCta"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { CanvasPositionedBox } from "@/features/builder/components/canvas/CanvasPositionedBox"
import { CanvasTextBox } from "@/features/builder/components/canvas/CanvasTextBox"
import type { CanvasImageItem } from "@/themes/engine/canvas-image"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import type { BlockInstance } from "@/themes/engine/schema"
import {
  blockToCtaButton,
  blockToCtaImage,
  blockToCtaTitle,
  CTA_IMAGE_MAX_HEIGHT,
  CTA_SECTION_DESIGN_WIDTH,
  ctaSectionCanvasHeight,
  DEFAULT_CTA_PRIMARY_LAYOUT,
  DEFAULT_CTA_SECONDARY_LAYOUT,
} from "@/themes/engine/cta-section-layout"

function findBlock(blocks: BlockInstance[] | undefined, type: string) {
  return blocks?.find((block) => block.type === type)
}

export function CallToActionSection({ settings, blocks, canvas, config }: SectionProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState(CTA_SECTION_DESIGN_WIDTH)

  useEffect(() => {
    const element = frameRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      setMeasuredWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const fallbackTitle = getStringSetting(settings, "title", "Experience the Art of Less")
  const fallbackPrimary = getStringSetting(settings, "primaryLabel", "Explore Collections")
  const fallbackSecondary = getStringSetting(settings, "secondaryLabel", "Read the Journal")

  const imageBlock = findBlock(blocks, "cta-image")
  const titleBlock = findBlock(blocks, "cta-title")
  const primaryBlock = blocks?.find(
    (block) => block.type === "hero-cta" && block.id.includes("primary"),
  ) ?? blocks?.filter((block) => block.type === "hero-cta")[0]
  const secondaryBlock = blocks?.find(
    (block) => block.type === "hero-cta" && block.id.includes("secondary"),
  ) ?? blocks?.filter((block) => block.type === "hero-cta")[1]

  const ctaImage = imageBlock ? blockToCtaImage(imageBlock) : null
  const ctaTitle = titleBlock ? blockToCtaTitle(titleBlock, fallbackTitle) : null
  const themeFallback = { primaryColor: config?.primaryColor }
  const primaryCta = primaryBlock
    ? blockToCtaButton(primaryBlock, fallbackPrimary, DEFAULT_CTA_PRIMARY_LAYOUT, themeFallback)
    : null
  const secondaryCta = secondaryBlock
    ? blockToCtaButton(
        secondaryBlock,
        fallbackSecondary,
        DEFAULT_CTA_SECONDARY_LAYOUT,
        themeFallback,
      )
    : null

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected)

  const scale = measuredWidth > 0 ? measuredWidth / CTA_SECTION_DESIGN_WIDTH : 1
  // Canvas height ignores the image layout — the frame is fixed like the hero
  // section and the image clips at its edges instead of stretching the canvas.
  const layouts = [
    ctaTitle?.layout,
    primaryCta?.layout,
    secondaryCta?.layout,
  ].filter(Boolean)
  const designCanvasHeight = ctaSectionCanvasHeight(layouts as NonNullable<typeof layouts[number]>[])
  const frameHeight = designCanvasHeight * scale

  // Adapt the stored box layout (xPct/wPct + design-px yPx/hPx) to the
  // %-of-frame units CanvasMultiImageItem uses, so the CTA image gets the
  // exact same bounding-box UI as hero images.
  const imageItem: CanvasImageItem | null =
    ctaImage && imageBlock && ctaImage.image.url
      ? {
          id: imageBlock.id,
          src: ctaImage.image.url,
          x: ctaImage.layout.xPct,
          y: (ctaImage.layout.yPx / designCanvasHeight) * 100,
          width: ctaImage.layout.wPct,
          height: (ctaImage.layout.hPx / designCanvasHeight) * 100,
          rotation: ctaImage.image.rotation,
          scale: (ctaImage.image.scale / 100) * ctaImage.image.sliderScale,
        }
      : null

  const onCtaImageChange = (patch: Partial<CanvasImageItem>) => {
    if (!imageBlock) return
    const out: Record<string, unknown> = {}
    if (patch.x != null) out.xPct = patch.x
    if (patch.y != null) out.yPx = Math.max(0, Math.round((patch.y / 100) * designCanvasHeight))
    if (patch.width != null) out.wPct = patch.width
    if (patch.height != null) out.hPx = Math.round((patch.height / 100) * designCanvasHeight)
    if (patch.rotation != null) out.imgRotation = patch.rotation
    if (patch.scale != null) {
      out.imgScale = Math.round(patch.scale * 100)
      out.imgSliderScale = 1
    }
    editor?.onBlockChange?.(canvas!.sectionId, imageBlock.id, out)
  }

  const primaryVariant =
    (primaryBlock?.settings as Record<string, unknown> | undefined)?.ctaVariant === "ghost"
      ? "ghost"
      : "outline"
  const secondaryVariant =
    (secondaryBlock?.settings as Record<string, unknown> | undefined)?.ctaVariant === "outline"
      ? "outline"
      : "ghost"

  return (
    <section className="overflow-hidden" style={{ backgroundColor: "var(--theme-primary)" }}>
      <div
        ref={frameRef}
        className="relative mx-auto max-w-6xl px-6"
        style={{ height: frameHeight }}
        onClick={
          editable
            ? (event) => {
                if (event.target === frameRef.current) {
                  editor?.onSelectBlock?.(canvas!.sectionId, null)
                }
              }
            : undefined
        }
      >
        {editable && (
          <CanvasGridOverlay canvasHeight={designCanvasHeight} scale={scale} />
        )}

        {/* Image — same bounding-box UI as hero images (CanvasMultiImageItem) */}
        {imageItem && imageBlock && (
          <div
            className={cn("absolute inset-0 overflow-hidden", !editable && "pointer-events-none")}
            onClick={
              editable
                ? (event) => {
                    if (event.target === event.currentTarget) {
                      editor?.onSelectBlock?.(canvas!.sectionId, null)
                    }
                  }
                : undefined
            }
          >
            <CanvasMultiImageItem
              item={imageItem}
              selected={editable && editor?.selectedBlockId === imageBlock.id}
              editable={editable}
              onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, imageBlock.id)}
              onChange={onCtaImageChange}
            />
          </div>
        )}

        {/* Empty state — placeholder box until an image is picked in the sidebar */}
        {ctaImage && imageBlock && !ctaImage.image.url && (
          <CanvasPositionedBox
            layout={ctaImage.layout}
            scale={scale}
            designWidth={CTA_SECTION_DESIGN_WIDTH}
            canvasRef={frameRef}
            editable={editable}
            selected={editable && editor?.selectedBlockId === imageBlock.id}
            onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, imageBlock.id)}
            onChange={(patch) =>
              editor?.onBlockChange?.(canvas!.sectionId, imageBlock.id, patch)
            }
            minHeightPx={80}
            maxHeightPx={CTA_IMAGE_MAX_HEIGHT}
            zIndex={5}
            isEmpty
            hideWhenEmpty
            innerClassName="rounded-sm"
            emptyPlaceholder={
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p className="text-center text-[11px] leading-relaxed text-white/70">
                  Klik untuk pilih
                  <br />
                  gambar di panel kiri
                </p>
              </div>
            }
          >
            {null}
          </CanvasPositionedBox>
        )}

        {ctaTitle && titleBlock && (
          <CanvasTextBox
            value={ctaTitle.label}
            layout={ctaTitle.layout}
            scale={scale}
            designWidth={CTA_SECTION_DESIGN_WIDTH}
            canvasRef={frameRef}
            editable={editable}
            selected={editable && editor?.selectedBlockId === titleBlock.id}
            onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, titleBlock.id)}
            onChange={(patch) =>
              editor?.onBlockChange?.(canvas!.sectionId, titleBlock.id, patch)
            }
            onTextChange={(label) =>
              editor?.onBlockChange?.(canvas!.sectionId, titleBlock.id, { label })
            }
            minHeightPx={48}
            maxHeightPx={240}
            zIndex={15}
            className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          />
        )}

        {primaryCta && primaryBlock && (
          <CanvasHeroCta
            cta={primaryCta}
            href="/products"
            editable={editable}
            selected={editable && editor?.selectedBlockId === primaryBlock.id}
            scale={scale}
            designWidth={CTA_SECTION_DESIGN_WIDTH}
            frameRef={frameRef}
            variant={primaryVariant}
            shape="square"
            previewClassName="transition-colors hover:bg-white hover:text-(--theme-primary)"
            onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, primaryBlock.id)}
            onChange={(patch) =>
              editor?.onBlockChange?.(canvas!.sectionId, primaryBlock.id, patch)
            }
          />
        )}

        {secondaryCta && secondaryBlock && (
          <CanvasHeroCta
            cta={secondaryCta}
            href="/about"
            editable={editable}
            selected={editable && editor?.selectedBlockId === secondaryBlock.id}
            scale={scale}
            designWidth={CTA_SECTION_DESIGN_WIDTH}
            frameRef={frameRef}
            variant={secondaryVariant}
            shape="square"
            previewClassName="text-white/80 transition-colors hover:text-white"
            onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, secondaryBlock.id)}
            onChange={(patch) =>
              editor?.onBlockChange?.(canvas!.sectionId, secondaryBlock.id, patch)
            }
          />
        )}

        {editable && !editor?.selectedBlockId && (
          <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-30 text-center text-[10px] text-white/60">
            Klik judul, gambar, atau tombol untuk edit
          </p>
        )}
      </div>
    </section>
  )
}
