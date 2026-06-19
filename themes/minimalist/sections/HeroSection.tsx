"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import type { SectionProps } from "@/themes/engine/section-registry"
import { parseImageTransform } from "@/themes/bento/sections/category-grid-layout"

const TITLE_SIZE_CLASSES = {
  sm: "text-2xl @2xl:text-4xl @5xl:text-[2.75rem]",
  md: "text-3xl @2xl:text-5xl @5xl:text-[3.5rem]",
  lg: "text-4xl @2xl:text-6xl @5xl:text-[4.25rem]",
} as const

export function HeroSection({ config, blocks, canvas }: SectionProps) {
  const hero = config?.hero

  const title = hero?.title || "Quiet Luxury for the Modern Individual"
  const subtitle =
    hero?.subtitle ||
    "Curated essentials designed with intention — timeless silhouettes, conscious materials, and enduring craft."
  const ctaHref = hero?.ctaHref || "/products"
  const align = hero?.align ?? "center"
  const tone = hero?.textTone ?? "dark"
  const titleSize = hero?.titleSize ?? "md"

  const mediaBlock = blocks?.find((b) => b.type === "hero-media") ?? blocks?.[0]
  const ctaBlock = blocks?.find((b) => b.type === "hero-cta") ?? blocks?.[1]

  const mediaSettings = mediaBlock?.settings as Record<string, unknown> | undefined
  const ctaSettings = ctaBlock?.settings as Record<string, unknown> | undefined

  const parsedImage = parseImageTransform(mediaSettings)
  const image = { ...parsedImage, url: parsedImage.url ?? config?.heroImageUrl }

  const ctaLabel =
    typeof ctaSettings?.label === "string" && ctaSettings.label
      ? ctaSettings.label
      : hero?.ctaLabel || "Shop Collection"
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

  const isCenter = align === "center"
  const isLight = tone === "light"

  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[16/7] min-h-[320px] w-full bg-gradient-to-br from-stone-200 via-amber-50 to-stone-300 @2xl:min-h-[440px]">
        {/* Background image — clickable in edit mode to select media block */}
        {mediaBlock ? (
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
            {image.url || editable ? (
              <CanvasImageFrame
                image={image}
                interactive={mediaInteractive}
                onChange={(patch) =>
                  editor?.onBlockChange?.(canvas!.sectionId, mediaBlock.id, patch)
                }
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.65),transparent_55%)]" />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 z-[10] bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.65),transparent_55%)]" />
        )}

        {/* Tone overlay */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-[11]",
            isLight
              ? isCenter
                ? "bg-black/35"
                : "bg-gradient-to-r from-black/50 via-black/25 to-transparent"
              : "bg-gradient-to-t from-black/10 via-transparent to-transparent",
          )}
        />

        {/* Text — pointer-events-none so clicks fall through to image layer below */}
        <div className="pointer-events-none absolute inset-0 z-[20] flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-lg text-left"}>
              <h1
                className={cn(
                  "font-semibold leading-[1.15] tracking-tight",
                  TITLE_SIZE_CLASSES[titleSize],
                  isLight ? "text-white" : "text-[var(--theme-text)]",
                )}
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                {title}
              </h1>
              <p
                className={cn(
                  "mt-4 max-w-md text-sm leading-relaxed @2xl:text-base",
                  isCenter && "mx-auto",
                  isLight ? "text-white/85" : "text-[var(--theme-muted)]",
                )}
              >
                {subtitle}
              </p>
              <Link
                href={ctaHref}
                className={cn(
                  "pointer-events-auto mt-8 inline-flex h-11 items-center rounded-full px-8 text-xs font-bold tracking-[0.14em] uppercase transition-opacity hover:opacity-90",
                  ctaInteractive && "ring-2 ring-indigo-400 ring-offset-2",
                )}
                style={{
                  backgroundColor: ctaBgColor ?? "var(--theme-primary)",
                  color: ctaTextColor,
                }}
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
        </div>

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
      </div>
    </section>
  )
}
