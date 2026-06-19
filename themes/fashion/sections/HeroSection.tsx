"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import type { SectionProps } from "@/themes/engine/section-registry"
import { parseImageTransform } from "@/themes/bento/sections/category-grid-layout"

export function HeroSection({ config, blocks, canvas }: SectionProps) {
  const hero = config?.hero
  const title = hero?.title ?? "Curated For Everyday Beauty"
  const ctaHref = hero?.ctaHref ?? "/products"

  const mediaBlock = blocks?.find((b) => b.type === "hero-media")
  const ctaBlock = blocks?.find((b) => b.type === "hero-cta")

  const mediaSettings = mediaBlock?.settings as Record<string, unknown> | undefined
  const ctaSettings = ctaBlock?.settings as Record<string, unknown> | undefined

  const parsedImage = parseImageTransform(mediaSettings)
  const image = { ...parsedImage, url: parsedImage.url ?? config?.heroImageUrl }

  const ctaLabel =
    typeof ctaSettings?.label === "string" && ctaSettings.label
      ? ctaSettings.label
      : hero?.ctaLabel ?? "EXPLORE COLLECTION"
  const ctaBgColor =
    typeof ctaSettings?.ctaBgColor === "string" && ctaSettings.ctaBgColor
      ? ctaSettings.ctaBgColor
      : undefined
  const ctaTextColor =
    typeof ctaSettings?.ctaTextColor === "string" && ctaSettings.ctaTextColor
      ? ctaSettings.ctaTextColor
      : "#ffffff"

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected)
  const mediaInteractive = editable && editor?.selectedBlockId === mediaBlock?.id
  const ctaInteractive = editable && editor?.selectedBlockId === ctaBlock?.id

  return (
    <>
      {config?.bannerText && (
        <div
          className="py-2.5 px-4 text-center text-[11px] tracking-wide text-white"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          {config.bannerText}
        </div>
      )}

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-300 via-amber-100 to-stone-400">
        {/* Background image layer */}
        {mediaBlock && (
          <div
            className={cn("absolute inset-0 z-[10]", !editable && "pointer-events-none")}
            onClick={
              editable
                ? (event) => {
                    event.stopPropagation()
                    editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
                  }
                : undefined
            }
          >
            {(image.url || editable) && (
              <CanvasImageFrame
                image={image}
                interactive={mediaInteractive}
                onChange={(patch) =>
                  editor?.onBlockChange?.(canvas!.sectionId, mediaBlock.id, patch)
                }
              />
            )}
          </div>
        )}

        {/* Dark gradient overlays — always visible */}
        <div className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-t from-black/30 to-transparent" />

        {/* Text + CTA — pointer-events-none so clicks fall through to image layer */}
        <div className="pointer-events-none absolute inset-0 z-[20] flex items-end">
          <div className="max-w-lg px-10 pb-16">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/70">
              NEW SEASON ARRIVAL
            </p>
            <h1
              className="text-5xl font-normal leading-[1.1] text-white md:text-6xl"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              {title}
            </h1>
            <Link
              href={editable ? "#" : ctaHref}
              className={cn(
                "pointer-events-auto mt-6 inline-flex h-10 items-center border border-white px-7 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[var(--theme-text)]",
                ctaInteractive && "ring-2 ring-indigo-400 ring-offset-2",
              )}
              style={
                ctaBgColor
                  ? { backgroundColor: ctaBgColor, color: ctaTextColor, borderColor: "transparent" }
                  : undefined
              }
              onClick={
                editable && ctaBlock
                  ? (event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      editor?.onSelectBlock?.(canvas!.sectionId, ctaBlock.id)
                    }
                  : undefined
              }
            >
              {ctaLabel}
            </Link>
          </div>
        </div>

        {/* Canvas hints */}
        {editable && !editor?.selectedBlockId && (
          <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-[30] text-center text-[10px] text-white/70">
            Klik area hero untuk edit gambar · klik tombol CTA untuk edit warna & teks
          </p>
        )}
        {editable && mediaInteractive && (
          <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-[30] text-center text-[10px] text-white/70">
            Drag gambar untuk geser · tarik handle ⊙ untuk zoom · atur lewat panel kiri
          </p>
        )}
      </section>
    </>
  )
}
