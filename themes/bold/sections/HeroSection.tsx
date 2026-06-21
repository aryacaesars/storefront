"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasGridOverlay } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasLabelResizeHandles } from "@/features/builder/components/canvas/CanvasLabelResizeHandles"
import type { SectionProps } from "@/themes/engine/section-registry"
import {
  hasMobileOverride,
  MOBILE_OVERRIDE_FLAG,
} from "@/themes/engine/device-settings"
import {
  labelMoveFromDelta,
  parseImageTransform,
  type CategoryLabelLayout,
  type LabelContainerMetrics,
} from "@/themes/bento/sections/category-grid-layout"
import {
  HERO_DESIGN_HEIGHT,
  HERO_DESIGN_WIDTH,
  HERO_MOBILE_DESIGN_WIDTH,
} from "@/themes/bento/sections/hero-cta-layout"
import {
  heroTitleLayoutToPatch,
  heroTitleLayoutsToPatch,
  parseHeroTitleLayout,
  type HeroTitleLine,
} from "@/themes/bento/sections/hero-title-layout"
import {
  parseHeroTitleStyle,
  type HeroTitleStyleOverride,
} from "@/themes/bento/sections/hero-title-style"

type HeroTitleLayer = "front" | "behind"

const Z_TITLE_BEHIND = 5
const Z_IMAGE = 10
const Z_OVERLAY = 11
const Z_DECOR = 13
const Z_TITLE_FRONT = 15
const LABEL_DRAG_THRESHOLD = 4

function parseTitleLayer(value: unknown): HeroTitleLayer {
  return value === "behind" ? "behind" : "front"
}

function getLabelMetrics(element: HTMLElement): LabelContainerMetrics {
  const rect = element.getBoundingClientRect()
  return { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
}

function isLabelHandleTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest('button[aria-label^="Tarik"]'))
  )
}

interface BoldTitleLineProps {
  line: HeroTitleLine
  value: string
  layer: HeroTitleLayer
  isSubtitle: boolean
  styleOverride: HeroTitleStyleOverride
  labelLayout: CategoryLabelLayout
  frameHeightPx: number
  frameRef: React.RefObject<HTMLDivElement | null>
  mediaInteractive: boolean
  editable: boolean
  onHeroKey: "title" | "subtitle"
  onHeroChange?: (key: "title" | "subtitle", value: string) => void
  onLayoutChange: (patch: Record<string, unknown>) => void
  onSelectMedia: () => void
}

function BoldTitleLine({
  line,
  value,
  layer,
  isSubtitle,
  styleOverride,
  labelLayout,
  frameHeightPx,
  frameRef,
  mediaInteractive,
  editable,
  onHeroKey,
  onHeroChange,
  onLayoutChange,
  onSelectMedia,
}: BoldTitleLineProps) {
  const labelResizable = editable && mediaInteractive
  const labelEditable = labelResizable && layer === "front"
  const labelMovable = labelResizable

  const labelBoxHeightPx = frameHeightPx * (labelLayout.hPct / 100)

  const labelStyle: React.CSSProperties = isSubtitle
    ? {
        fontFamily: styleOverride.fontFamily ?? "var(--theme-body-font)",
        fontSize: `${Math.max(12, labelBoxHeightPx * 0.45)}px`,
        lineHeight: 1.5,
        fontWeight: styleOverride.fontWeight ?? 400,
        color: styleOverride.color ?? "rgba(255,255,255,0.65)",
        fontStyle: styleOverride.fontStyle ?? "normal",
      }
    : {
        fontFamily: styleOverride.fontFamily ?? "var(--theme-heading-font)",
        fontSize: `${Math.max(28, labelBoxHeightPx * 0.72)}px`,
        lineHeight: 0.92,
        fontWeight: styleOverride.fontWeight ?? 900,
        textTransform: "uppercase" as const,
        letterSpacing: "-0.02em",
        color: styleOverride.color ?? "#ffffff",
        fontStyle: styleOverride.fontStyle ?? "normal",
      }

  const labelBoxStyle: React.CSSProperties = {
    position: "absolute",
    left: `${labelLayout.xPct}%`,
    top: `${labelLayout.yPct}%`,
    width: `${labelLayout.wPct}%`,
    height: `${labelLayout.hPct}%`,
  }

  const startLabelMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!labelMovable || !frameRef.current || isLabelHandleTarget(event.target)) return

      event.stopPropagation()
      const startX = event.clientX
      const startY = event.clientY
      const origin: CategoryLabelLayout = { ...labelLayout }
      let dragging = false

      function onMove(moveEvent: PointerEvent) {
        if (!frameRef.current) return
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        if (!dragging && Math.abs(dx) + Math.abs(dy) < LABEL_DRAG_THRESHOLD) return
        dragging = true
        moveEvent.preventDefault()
        const metrics = getLabelMetrics(frameRef.current)
        onLayoutChange(heroTitleLayoutToPatch(line, labelMoveFromDelta(dx, dy, metrics, origin)))
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [frameRef, labelLayout, labelMovable, line, onLayoutChange],
  )

  const labelContent = labelEditable ? (
    <CanvasInlineText
      value={value}
      onChange={(next) => onHeroChange?.(onHeroKey, next)}
      className="block w-full"
      style={labelStyle}
    />
  ) : (
    <p className="block w-full" style={labelStyle}>
      {value}
    </p>
  )

  const zIndex = layer === "behind" ? Z_TITLE_BEHIND : Z_TITLE_FRONT

  return (
    <>
      {layer === "behind" && (
        <div
          className={cn(
            "absolute flex items-start overflow-hidden",
            labelMovable && "cursor-move",
          )}
          style={{ ...labelBoxStyle, zIndex }}
          onPointerDown={labelMovable ? startLabelMove : undefined}
        >
          {labelContent}
        </div>
      )}

      {labelMovable && layer === "behind" && (
        <div
          aria-hidden
          className="absolute z-[15] cursor-move rounded-sm ring-2 ring-violet-500/40 ring-offset-1 ring-offset-transparent"
          style={labelBoxStyle}
          onPointerDown={startLabelMove}
        />
      )}

      {layer === "front" && (
        <div
          className={cn(
            "absolute flex items-start overflow-visible",
            labelMovable && "cursor-move",
            mediaInteractive &&
              "rounded-sm ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent",
          )}
          style={{ ...labelBoxStyle, zIndex }}
          onPointerDown={labelMovable ? startLabelMove : undefined}
          onClick={
            editable
              ? (event) => {
                  event.stopPropagation()
                  onSelectMedia()
                }
              : undefined
          }
        >
          {labelContent}
        </div>
      )}
    </>
  )
}

export function HeroSection({ config, blocks, canvas, isMobile = false }: SectionProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState(
    isMobile ? HERO_MOBILE_DESIGN_WIDTH : HERO_DESIGN_WIDTH,
  )

  useEffect(() => {
    const element = frameRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      setMeasuredWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const hero = config?.hero
  const titleLine1 = hero?.title ?? "DEFINING THE LIMIT OF HUMAN POTENTIAL."
  const titleLine2 =
    hero?.subtitle ??
    "Momentum Bold isn't just gear. It's a commitment to the engineering of motion."
  const ctaLabel = hero?.ctaLabel ?? "SHOP ELITE GEAR"
  const ctaHref = hero?.ctaHref ?? "/products"

  const mediaBlock = blocks?.find((b) => b.type === "hero-media") ?? blocks?.[0]

  const mediaSettings = mediaBlock?.settings as Record<string, unknown> | undefined
  const parsedImage = parseImageTransform(mediaSettings)
  const image = { ...parsedImage, url: parsedImage.url ?? config?.heroImageUrl }

  const title1Layout = parseHeroTitleLayout(mediaSettings, "title1", isMobile)
  const title2Layout = parseHeroTitleLayout(mediaSettings, "title2", isMobile)
  const title1Layer = parseTitleLayer(mediaSettings?.title1Layer)
  const title2Layer = parseTitleLayer(mediaSettings?.title2Layer)

  const designWidth = isMobile ? HERO_MOBILE_DESIGN_WIDTH : HERO_DESIGN_WIDTH
  const scale = measuredWidth > 0 ? measuredWidth / designWidth : 1
  const frameHeight = HERO_DESIGN_HEIGHT * scale

  const mediaHasMobileOverride = Boolean(
    mediaSettings?.[MOBILE_OVERRIDE_FLAG] ||
      hasMobileOverride(mediaBlock?.settings as Record<string, unknown> | undefined),
  )
  const useMobileTitleSeed = isMobile && !mediaHasMobileOverride

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected)
  const mediaInteractive = editable && editor?.selectedBlockId === mediaBlock?.id

  const hasImage = Boolean(image.url)

  const onMediaChange = (patch: Record<string, unknown>) => {
    if (!mediaBlock || !editor) return
    const full = useMobileTitleSeed
      ? {
          ...heroTitleLayoutsToPatch(title1Layout, title2Layout),
          title1Layer,
          title2Layer,
          imgScale: image.scale,
          imgX: image.x,
          imgY: image.y,
          ...patch,
        }
      : patch
    editor.onBlockChange?.(canvas!.sectionId, mediaBlock.id, full)
  }

  const title1StyleOverride = parseHeroTitleStyle(mediaSettings, "title1")
  const title2StyleOverride = parseHeroTitleStyle(mediaSettings, "title2")

  const titleLines = [
    {
      line: "title1" as const,
      value: titleLine1,
      layer: title1Layer,
      styleOverride: title1StyleOverride,
      labelLayout: title1Layout,
      onHeroKey: "title" as const,
      isSubtitle: false,
    },
    {
      line: "title2" as const,
      value: titleLine2,
      layer: title2Layer,
      styleOverride: title2StyleOverride,
      labelLayout: title2Layout,
      onHeroKey: "subtitle" as const,
      isSubtitle: true,
    },
  ]

  const behindTitles = titleLines.filter((item) => item.layer === "behind")
  const frontTitles = titleLines.filter((item) => item.layer === "front")

  return (
    <div
      ref={frameRef}
      id="section-hero"
      className="relative w-full overflow-visible bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#0D4A3E]"
      style={{ height: frameHeight }}
    >
      {editable && (
        <CanvasGridOverlay canvasHeight={HERO_DESIGN_HEIGHT} scale={scale} />
      )}

      <div className="absolute inset-0 overflow-hidden">
        {behindTitles.map((item) => (
          <BoldTitleLine
            key={`${item.line}-behind`}
            {...item}
            frameHeightPx={frameHeight}
            frameRef={frameRef}
            mediaInteractive={mediaInteractive}
            editable={editable}
            onHeroChange={(key, val) => editor?.onHeroChange?.(key, val)}
            onLayoutChange={onMediaChange}
            onSelectMedia={() =>
              mediaBlock && editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
            }
          />
        ))}

        {/* Background image */}
        {mediaBlock && (
          <div
            className={cn("absolute inset-0", !editable && "pointer-events-none")}
            style={{ zIndex: Z_IMAGE }}
            onClick={
              editable
                ? (event) => {
                    event.stopPropagation()
                    editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
                  }
                : undefined
            }
          >
            {(hasImage || editable) && (
              <CanvasImageFrame
                image={image}
                interactive={mediaInteractive}
                onChange={onMediaChange}
              />
            )}
          </div>
        )}

        {/* Gradient overlays */}
        {hasImage || editable ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/25"
              style={{ zIndex: Z_OVERLAY }}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"
              style={{ zIndex: Z_OVERLAY }}
            />
          </>
        ) : (
          <>
            <div
              className="pointer-events-none absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-[#0D4A3E]/30 via-transparent to-transparent"
              style={{ zIndex: Z_OVERLAY }}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent"
              style={{ zIndex: Z_OVERLAY }}
            />
          </>
        )}

        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: Z_DECOR,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* BOLD watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
          style={{ zIndex: Z_DECOR }}
          aria-hidden="true"
        >
          <span
            className="font-black uppercase text-white/[0.03]"
            style={{
              fontSize: `${Math.max(80, frameHeight * 0.55)}px`,
              fontFamily: "var(--theme-heading-font)",
              lineHeight: 0.85,
              letterSpacing: "-0.02em",
            }}
          >
            BOLD
          </span>
        </div>

        {/* Left accent bar */}
        <div
          className="pointer-events-none absolute left-0 top-0 hidden h-full w-1 md:block"
          style={{ zIndex: Z_DECOR, backgroundColor: "var(--theme-accent)" }}
        />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/65 to-transparent"
          style={{ zIndex: Z_DECOR }}
        />

        {/* Front title labels */}
        {frontTitles.map((item) => (
          <BoldTitleLine
            key={`${item.line}-front`}
            {...item}
            frameHeightPx={frameHeight}
            frameRef={frameRef}
            mediaInteractive={mediaInteractive}
            editable={editable}
            onHeroChange={(key, val) => editor?.onHeroChange?.(key, val)}
            onLayoutChange={onMediaChange}
            onSelectMedia={() =>
              mediaBlock && editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
            }
          />
        ))}

        {/* Static CTAs */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 flex flex-col gap-4 px-6 pb-10",
            editable && "pointer-events-none",
          )}
          style={{ zIndex: 20 }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8" style={{ backgroundColor: "var(--theme-accent)" }} />
            <span
              className="text-[10px] font-black uppercase tracking-[0.28em]"
              style={{ color: "var(--theme-accent)" }}
            >
              {config?.storeName ?? "MOMENTUM BOLD"}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={editable ? "#" : ctaHref}
              className="inline-flex h-10 items-center px-6 text-xs font-black uppercase tracking-[0.12em] text-zinc-900 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-accent)" }}
              onClick={editable ? (e) => e.preventDefault() : undefined}
            >
              {ctaLabel}
            </Link>
            <Link
              href={editable ? "#" : "/about"}
              className="inline-flex h-10 items-center border border-white/40 px-6 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white"
              onClick={editable ? (e) => e.preventDefault() : undefined}
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </div>

      {/* Title resize handles — outside overflow-hidden so they can overflow */}
      {mediaInteractive &&
        titleLines.map((item) => (
          <div
            key={`${item.line}-handles`}
            className="pointer-events-none absolute z-[30] overflow-visible"
            style={{
              position: "absolute",
              left: `${item.labelLayout.xPct}%`,
              top: `${item.labelLayout.yPct}%`,
              width: `${item.labelLayout.wPct}%`,
              height: `${item.labelLayout.hPct}%`,
            }}
          >
            <CanvasLabelResizeHandles
              layout={item.labelLayout}
              containerRef={frameRef}
              onResize={(patch) => onMediaChange(heroTitleLayoutToPatch(item.line, patch))}
            />
          </div>
        ))}

      {editable && !editor?.selectedBlockId && (
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-[30] text-center text-[10px] text-white/70">
          Klik judul atau gambar untuk edit
        </p>
      )}
      {editable && mediaInteractive && (
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-[30] text-center text-[10px] text-white/70">
          Drag box judul untuk pindah · tarik handle ungu untuk ukuran · atur layer di panel kiri
        </p>
      )}
    </div>
  )
}
