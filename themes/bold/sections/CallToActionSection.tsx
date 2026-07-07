"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import { parseImageTransform } from "@/themes/bento/sections/category-grid-layout"

export function CallToActionSection({ settings, blocks, canvas }: SectionProps) {
  const title = getStringSetting(settings, "title", "BECOME PART OF THE MOMENTUM.")
  const subtitle = getStringSetting(
    settings,
    "subtitle",
    "Join the elite circle of athletes and innovators redefining the boundaries of the possible.",
  )
  const primaryLabel = getStringSetting(settings, "primaryLabel", "SHOP THE SERIES")
  const secondaryLabel = getStringSetting(settings, "secondaryLabel", "OUR STORY")

  const imageBlock = blocks?.[0]
  const image = parseImageTransform(imageBlock?.settings as Record<string, unknown> | undefined)

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected && imageBlock)
  const interactive = editable && editor?.selectedBlockId === imageBlock?.id

  return (
    <section className="relative overflow-hidden bg-white px-6 py-28 text-center">
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

      <div className="relative z-10">
        <h2
          className="text-4xl font-black uppercase leading-tight text-zinc-900 md:text-6xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-500">{subtitle}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-12 items-center px-10 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--theme-accent)" }}
          >
            {primaryLabel}
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center border border-zinc-300 px-10 text-xs font-bold uppercase tracking-[0.15em] text-zinc-900 transition-colors hover:border-zinc-900"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
