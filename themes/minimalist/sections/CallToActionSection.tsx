"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import { parseImageTransform } from "@/themes/bento/sections/category-grid-layout"

export function CallToActionSection({ settings, blocks, canvas }: SectionProps) {
  const title = getStringSetting(settings, "title", "Experience the Art of Less")
  const primaryLabel = getStringSetting(settings, "primaryLabel", "Explore Collections")
  const secondaryLabel = getStringSetting(settings, "secondaryLabel", "Read the Journal")

  const imageBlock = blocks?.[0]
  const image = parseImageTransform(imageBlock?.settings as Record<string, unknown> | undefined)

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected && imageBlock)
  const interactive = editable && editor?.selectedBlockId === imageBlock?.id

  return (
    <section
      className="relative overflow-hidden px-6 py-24 text-center"
      style={{ backgroundColor: "var(--theme-primary)" }}
    >
      {/* Optional background image */}
      {(image.url || editable) && imageBlock && (
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
            className="inline-flex h-11 items-center border border-white px-8 text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-white hover:text-[var(--theme-primary)]"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/about"
            className="inline-flex h-11 items-center px-8 text-xs font-bold tracking-[0.14em] text-white/80 uppercase transition-colors hover:text-white"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
