"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { CanvasGridOverlay } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasHeroCta } from "@/features/builder/components/canvas/CanvasHeroCta"
import { CanvasLabelResizeHandles } from "@/features/builder/components/canvas/CanvasLabelResizeHandles"
import { parseCanvasImages } from "@/themes/engine/canvas-image"
import {
  hasMobileOverride,
  MOBILE_OVERRIDE_FLAG,
} from "@/themes/engine/device-settings"
import {
  labelMoveFromDelta,
  type CategoryLabelLayout,
  type LabelContainerMetrics,
} from "@/themes/bento/sections/category-grid-layout"
import {
  HERO_DESIGN_WIDTH,
  HERO_MOBILE_DESIGN_WIDTH,
  parseHeroCta,
  type HeroCtaData,
} from "@/themes/bento/sections/hero-cta-layout"
import type { CategoryCardLayout } from "@/themes/bento/sections/category-grid-layout"
import type { SectionProps } from "@/themes/engine/section-registry"
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

const BOLD_HERO_DESIGN_HEIGHT = 700
const BOLD_DEFAULT_CTA_DESKTOP = { xPct: 5, wPct: 22, yPx: 430, hPx: 48 }
const BOLD_DEFAULT_CTA_MOBILE = { xPct: 5, wPct: 50, yPx: 430, hPx: 48 }
const MIN_HERO_ZOOM = 100
const MAX_HERO_ZOOM = 200
const Z_TITLE_BEHIND = 5
const Z_IMAGE = 10
const Z_OVERLAY = 11
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

function resolveHeroImageUrl(
  configUrl: string | undefined,
  mediaSettings: Record<string, unknown> | undefined,
): string | undefined {
  // Same priority as bento/fashion Hero: a freshly uploaded image (images[])
  // must win over the block's baked-in default imageUrl, otherwise uploads
  // never appear because the default is always non-empty.
  const canvasUrl = parseCanvasImages(mediaSettings).find((img) => img.src)?.src
  const blockUrl =
    typeof mediaSettings?.imageUrl === "string" && mediaSettings.imageUrl.trim()
      ? mediaSettings.imageUrl
      : undefined
  return canvasUrl ?? blockUrl ?? configUrl
}

function parseHeroImageZoom(settings: Record<string, unknown> | undefined): number {
  const n = Number(settings?.imgScale ?? 100)
  if (!Number.isFinite(n)) return 100
  return Math.min(MAX_HERO_ZOOM, Math.max(MIN_HERO_ZOOM, Math.round(n)))
}

function hasCtaBoxLayout(settings: Record<string, unknown> | undefined): boolean {
  return (
    settings != null &&
    ("xPct" in settings || "wPct" in settings || "yPx" in settings || "hPx" in settings)
  )
}

function resolveBoldCtaLayout(
  settings: Record<string, unknown> | undefined,
  isMobile: boolean,
  parsedLayout: CategoryCardLayout,
): CategoryCardLayout {
  if (!hasCtaBoxLayout(settings)) {
    return isMobile ? BOLD_DEFAULT_CTA_MOBILE : BOLD_DEFAULT_CTA_DESKTOP
  }
  return parsedLayout
}

function HeroBackground({
  url,
  alt,
  zoom,
}: {
  url?: string
  alt: string
  zoom: number
}) {
  if (!url) return null

  const scale = zoom / 100

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: Z_IMAGE }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-cover object-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        draggable={false}
      />
    </div>
  )
}

interface BoldTitleLineProps {
  line: HeroTitleLine
  value: string
  layer: HeroTitleLayer
  isAccentLine: boolean
  styleOverride: HeroTitleStyleOverride
  labelLayout: CategoryLabelLayout
  frameHeightPx: number
  frameRef: React.RefObject<HTMLDivElement | null>
  mediaInteractive: boolean
  editable: boolean
  lineSelected: boolean
  onActivate: () => void
  onHeroKey: "title" | "subtitle"
  onHeroChange?: (key: "title" | "subtitle", value: string) => void
  onLayoutChange: (patch: Record<string, unknown>) => void
  onSelectMedia: () => void
}

function BoldTitleLine({
  line,
  value,
  layer,
  isAccentLine,
  styleOverride,
  labelLayout,
  frameHeightPx,
  frameRef,
  mediaInteractive,
  editable,
  lineSelected,
  onActivate,
  onHeroKey,
  onHeroChange,
  onLayoutChange,
  onSelectMedia,
}: BoldTitleLineProps) {
  const labelResizable = editable && mediaInteractive
  const labelEditable = labelResizable && layer === "front"
  const labelMovable = labelResizable

  const labelBoxHeightPx = frameHeightPx * (labelLayout.hPct / 100)

  const labelStyle: React.CSSProperties = isAccentLine
    ? {
        fontFamily: styleOverride.fontFamily ?? "var(--theme-heading-font)",
        fontSize: `${Math.max(28, labelBoxHeightPx * 0.72)}px`,
        lineHeight: 0.92,
        fontWeight: styleOverride.fontWeight ?? 900,
        textTransform: "uppercase" as const,
        letterSpacing: "-0.02em",
        color: styleOverride.color ?? "var(--theme-accent)",
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
        const active = document.activeElement
        if (active instanceof HTMLElement && active.isContentEditable) {
          active.blur()
        }
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

  function handleLabelClick(event: React.MouseEvent<HTMLElement>) {
    if (!editable) return
    event.stopPropagation()
    onActivate()
    onSelectMedia()
  }

  function handleLabelPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (!editable || isLabelHandleTarget(event.target)) return
    onActivate()
    onSelectMedia()
    if (!labelMovable) return
    startLabelMove(event)
  }

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
          onPointerDown={handleLabelPointerDown}
          onClick={handleLabelClick}
        >
          {labelContent}
        </div>
      )}

      {labelMovable && layer === "behind" && (
        <div
          aria-hidden
          className={cn(
            "absolute z-[15] cursor-move rounded-sm",
            lineSelected &&
              "ring-2 ring-violet-500/40 ring-offset-1 ring-offset-transparent",
          )}
          style={labelBoxStyle}
          onPointerDown={handleLabelPointerDown}
          onClick={handleLabelClick}
        />
      )}

      {layer === "front" && (
        <div
          className={cn(
            "absolute flex items-start overflow-visible",
            labelMovable && "cursor-move",
            lineSelected &&
              "rounded-sm ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent",
          )}
          style={{ ...labelBoxStyle, zIndex }}
          onPointerDown={handleLabelPointerDown}
          onClick={handleLabelClick}
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
  const [activeTitleLine, setActiveTitleLine] = useState<HeroTitleLine | null>(null)

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
  const titleLine1 = hero?.title ?? "NO LIMITS."
  const titleLine2 = hero?.subtitle ?? "MORE MOTION"
  const ctaHref = hero?.ctaHref ?? "/products"

  const mediaBlock = blocks?.find((b) => b.type === "hero-media") ?? blocks?.[0]
  const ctaBlock = blocks?.find((b) => b.type === "hero-cta") ?? blocks?.[1]

  const mediaSettings = mediaBlock?.settings as Record<string, unknown> | undefined
  const ctaSettings = ctaBlock?.settings as Record<string, unknown> | undefined
  const heroImageUrl = resolveHeroImageUrl(config?.heroImageUrl, mediaSettings)
  const heroImageZoom = parseHeroImageZoom(mediaSettings)

  const title1Layout = parseHeroTitleLayout(mediaSettings, "title1", isMobile)
  const title2Layout = parseHeroTitleLayout(mediaSettings, "title2", isMobile)
  const title1Layer = parseTitleLayer(mediaSettings?.title1Layer)
  const title2Layer = parseTitleLayer(mediaSettings?.title2Layer)

  const designWidth = isMobile ? HERO_MOBILE_DESIGN_WIDTH : HERO_DESIGN_WIDTH
  const scale = measuredWidth > 0 ? measuredWidth / designWidth : 1
  const frameHeight = BOLD_HERO_DESIGN_HEIGHT * scale

  const mediaHasMobileOverride = Boolean(
    mediaSettings?.[MOBILE_OVERRIDE_FLAG] ||
      hasMobileOverride(mediaBlock?.settings as Record<string, unknown> | undefined),
  )
  const useMobileTitleSeed = isMobile && !mediaHasMobileOverride

  const ctaHasMobileOverride = Boolean(
    (ctaBlock?.settings as Record<string, unknown> | undefined)?.[MOBILE_OVERRIDE_FLAG],
  )
  const useMobileCtaSeed = isMobile && !ctaHasMobileOverride

  const parsedCta = parseHeroCta(ctaSettings, hero?.ctaLabel ?? "SHOP NOW", isMobile)
  const ctaLayout = ctaBlock
    ? useMobileCtaSeed
      ? BOLD_DEFAULT_CTA_MOBILE
      : resolveBoldCtaLayout(ctaSettings, isMobile, parsedCta.layout)
    : isMobile
      ? BOLD_DEFAULT_CTA_MOBILE
      : BOLD_DEFAULT_CTA_DESKTOP
  const cta: HeroCtaData = {
    ...parsedCta,
    label: hero?.ctaLabel?.trim() || parsedCta.label || "SHOP NOW",
    layout: ctaLayout,
  }
  const ctaVariant =
    ctaSettings?.ctaVariant === "filled" ? "filled" : "outline"

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected)
  const mediaInteractive = editable && editor?.selectedBlockId === mediaBlock?.id
  const ctaInteractive = editable && editor?.selectedBlockId === ctaBlock?.id

  useEffect(() => {
    if (!mediaInteractive) setActiveTitleLine(null)
  }, [mediaInteractive])

  const hasImage = Boolean(heroImageUrl)

  const onMediaChange = (patch: Record<string, unknown>) => {
    if (!mediaBlock || !editor) return
    const full = useMobileTitleSeed
      ? {
          ...heroTitleLayoutsToPatch(title1Layout, title2Layout),
          title1Layer,
          title2Layer,
          imgScale: heroImageZoom,
          ...patch,
        }
      : patch
    editor.onBlockChange?.(canvas!.sectionId, mediaBlock.id, full)
  }

  const onCtaChange = (patch: Record<string, unknown>) => {
    if (typeof patch.label === "string") {
      editor?.onHeroChange?.("ctaLabel", patch.label)
    }
    if (!ctaBlock || !editor) return
    const full = useMobileCtaSeed
      ? {
          xPct: cta.layout.xPct,
          wPct: cta.layout.wPct,
          yPx: cta.layout.yPx,
          hPx: cta.layout.hPx,
          ...patch,
        }
      : patch
    editor.onBlockChange?.(canvas!.sectionId, ctaBlock.id, full)
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
      isAccentLine: false,
    },
    {
      line: "title2" as const,
      value: titleLine2,
      layer: title2Layer,
      styleOverride: title2StyleOverride,
      labelLayout: title2Layout,
      onHeroKey: "subtitle" as const,
      isAccentLine: true,
    },
  ]

  const behindTitles = titleLines.filter((item) => item.layer === "behind")
  const frontTitles = titleLines.filter((item) => item.layer === "front")

  return (
    <div
      ref={frameRef}
      id="section-hero"
      className="relative w-full overflow-visible bg-sky-400"
      style={{ height: frameHeight }}
    >
      {editable && (
        <CanvasGridOverlay canvasHeight={BOLD_HERO_DESIGN_HEIGHT} scale={scale} />
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
            lineSelected={mediaInteractive && activeTitleLine === item.line}
            onActivate={() => {
              setActiveTitleLine(item.line)
            }}
            onHeroChange={(key, val) => editor?.onHeroChange?.(key, val)}
            onLayoutChange={onMediaChange}
            onSelectMedia={() =>
              mediaBlock && editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
            }
          />
        ))}

        <HeroBackground url={heroImageUrl} alt={titleLine1} zoom={heroImageZoom} />

        {/* Subtle left scrim for text legibility on bright skies */}
        {hasImage || editable ? (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent"
            style={{ zIndex: Z_OVERLAY }}
          />
        ) : null}

        {/* Front title labels */}
        {frontTitles.map((item) => (
          <BoldTitleLine
            key={`${item.line}-front`}
            {...item}
            frameHeightPx={frameHeight}
            frameRef={frameRef}
            mediaInteractive={mediaInteractive}
            editable={editable}
            lineSelected={mediaInteractive && activeTitleLine === item.line}
            onActivate={() => {
              setActiveTitleLine(item.line)
            }}
            onHeroChange={(key, val) => editor?.onHeroChange?.(key, val)}
            onLayoutChange={onMediaChange}
            onSelectMedia={() =>
              mediaBlock && editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
            }
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-[25]">
        <CanvasHeroCta
          cta={cta}
          href={ctaHref}
          editable={editable}
          selected={ctaInteractive}
          scale={scale}
          designWidth={designWidth}
          frameRef={frameRef}
          variant={ctaVariant}
          onSelect={() =>
            ctaBlock && editor?.onSelectBlock?.(canvas!.sectionId, ctaBlock.id)
          }
          onChange={onCtaChange}
        />
      </div>

      {/* Title resize handles — outside overflow-hidden so they can overflow */}
      {mediaInteractive &&
        activeTitleLine &&
        titleLines
          .filter((item) => item.line === activeTitleLine)
          .map((item) => (
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
          Klik judul atau tombol CTA untuk edit · ganti foto lewat panel kiri
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
