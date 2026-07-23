"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useOptionalMessages } from "@/features/i18n/LocaleProvider"
import { cn } from "@/lib/utils"
import { CanvasGridOverlay } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasHeroCta } from "@/features/builder/components/canvas/CanvasHeroCta"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { CanvasLabelResizeHandles } from "@/features/builder/components/canvas/CanvasLabelResizeHandles"
import { createDragSession } from "@/features/builder/components/canvas/visual-frame"
import { CanvasFreeTextLayer } from "@/features/builder/components/canvas/CanvasFreeTextLayer"
import {
  mobileFitCanvasImages,
  parseCanvasImages,
  updateImageInArray,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"
import { parseCanvasTexts } from "@/themes/engine/canvas-text"
import {
  hasMobileOverride,
  MOBILE_OVERRIDE_FLAG,
} from "@/themes/engine/device-settings"
import {
  canvasElementDomKey,
  type SelectedElementKind,
} from "@/themes/engine/section-editor"
import { parseFrameBackground } from "@/themes/engine/frame-background"
import {
  labelMoveFromDelta,
  parseImageTransform,
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
  defaultHeroTitle1Layout,
  defaultHeroTitle2Layout,
  heroTitleLayoutToPatch,
  heroTitleLayoutsToPatch,
  parseHeroTitleLayout,
  type HeroTitleLine,
} from "@/themes/bento/sections/hero-title-layout"
import {
  heroTitleOverrideCss,
  parseHeroTitleStyle,
  type HeroTitleStyleOverride,
} from "@/themes/bento/sections/hero-title-style"

type HeroTitleLayer = "front" | "behind"

const BOLD_HERO_DESIGN_HEIGHT = 580
const BOLD_DEFAULT_CTA_DESKTOP = { xPct: 5, wPct: 22, yPx: 360, hPx: 48 }
const BOLD_DEFAULT_CTA_MOBILE = { xPct: 5, wPct: 50, yPx: 360, hPx: 48 }
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

function resolveLegacyHeroUrl(
  configUrl: string | undefined,
  mediaSettings: Record<string, unknown> | undefined,
): string | undefined {
  if (mediaSettings && "imageUrl" in mediaSettings) {
    const v = mediaSettings.imageUrl
    return typeof v === "string" && v.trim() ? v.trim() : undefined
  }
  return typeof configUrl === "string" && configUrl.trim() ? configUrl.trim() : undefined
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

/** Storefront-only full-bleed when no editable canvas images exist. */
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
  domKey?: string
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
  domKey,
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
        fontSize: `${Math.max(28, labelBoxHeightPx * 0.72 * styleOverride.sizeScale)}px`,
        lineHeight: 0.92,
        fontWeight: styleOverride.fontWeight ?? 900,
        textTransform: "uppercase" as const,
        letterSpacing: "-0.02em",
        color: styleOverride.color ?? "var(--theme-accent)",
        fontStyle: styleOverride.fontStyle ?? "normal",
        ...heroTitleOverrideCss(styleOverride),
      }
    : {
        fontFamily: styleOverride.fontFamily ?? "var(--theme-heading-font)",
        fontSize: `${Math.max(28, labelBoxHeightPx * 0.72 * styleOverride.sizeScale)}px`,
        lineHeight: 0.92,
        fontWeight: styleOverride.fontWeight ?? 900,
        textTransform: "uppercase" as const,
        letterSpacing: "-0.02em",
        color: styleOverride.color ?? "#ffffff",
        fontStyle: styleOverride.fontStyle ?? "normal",
        ...heroTitleOverrideCss(styleOverride),
      }

  const labelBoxStyle: React.CSSProperties = {
    position: "absolute",
    left: `${labelLayout.xPct}%`,
    top: `${labelLayout.yPct}%`,
    width: `${labelLayout.wPct}%`,
    height: `${labelLayout.hPct}%`,
  }

  // Box front auto-height (fit teks, ala box CTA) — hPct tetap sumber ukuran font.
  const labelBoxStyleFit: React.CSSProperties = {
    position: "absolute",
    left: `${labelLayout.xPct}%`,
    top: `${labelLayout.yPct}%`,
    width: `${labelLayout.wPct}%`,
  }

  const resizeHandles = lineSelected && labelResizable && (
    <CanvasLabelResizeHandles
      layout={labelLayout}
      containerRef={frameRef}
      onResize={(patch) => onLayoutChange(heroTitleLayoutToPatch(line, patch))}
    />
  )

  const startLabelMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!labelMovable || !frameRef.current || isLabelHandleTarget(event.target)) return

      event.stopPropagation()
      const startX = event.clientX
      const startY = event.clientY
      const origin: CategoryLabelLayout = { ...labelLayout }
      let dragging = false
      const session = createDragSession<ReturnType<typeof labelMoveFromDelta>>(event, (layout) => {
        onLayoutChange(heroTitleLayoutToPatch(line, layout))
      })

      session.listen((moveEvent) => {
        if (!frameRef.current) return
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        if (!dragging && Math.abs(dx) + Math.abs(dy) < LABEL_DRAG_THRESHOLD) return
        dragging = true
        const active = document.activeElement
        if (active instanceof HTMLElement && active.isContentEditable) {
          active.blur()
        }
        const metrics = getLabelMetrics(frameRef.current)
        session.push(labelMoveFromDelta(dx, dy, metrics, origin))
      })
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
          data-canvas-element={domKey}
          className="absolute z-[15] cursor-move rounded-sm"
          style={labelBoxStyleFit}
          onPointerDown={handleLabelPointerDown}
          onClick={handleLabelClick}
        >
          {/* Duplikat teks invisible = pengukur tinggi supaya proxy fit teks (ala CTA). */}
          <div className="invisible">{labelContent}</div>
          {resizeHandles}
        </div>
      )}

      {layer === "front" && (
        <div
          data-canvas-element={domKey}
          className={cn(
            "absolute flex items-start overflow-visible",
            labelMovable && "cursor-move",
          )}
          style={{ ...labelBoxStyleFit, zIndex }}
          onPointerDown={handleLabelPointerDown}
          onClick={handleLabelClick}
        >
          {labelContent}
          {resizeHandles}
        </div>
      )}
    </>
  )
}

export function HeroSection({ config, blocks, canvas, isMobile = false }: SectionProps) {
  const hints = useOptionalMessages()?.pages.builder.canvasHints
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
  const titleLine1 = hero?.title ?? "NO LIMITS."
  const titleLine2 = hero?.subtitle ?? "MORE MOTION"
  const ctaHref = hero?.ctaHref ?? "/products"

  const mediaBlock = blocks?.find((b) => b.type === "hero-media") ?? blocks?.[0]
  const ctaBlock = blocks?.find((b) => b.type === "hero-cta") ?? blocks?.[1]

  const mediaSettings = mediaBlock?.settings as Record<string, unknown> | undefined
  const ctaSettings = ctaBlock?.settings as Record<string, unknown> | undefined
  const parsed = parseImageTransform(mediaSettings)
  const legacyUrl = resolveLegacyHeroUrl(config?.heroImageUrl, mediaSettings)
  const image = { ...parsed, url: legacyUrl }
  const heroImageZoom = parseHeroImageZoom(mediaSettings)
  const canvasTexts = parseCanvasTexts(mediaSettings)

  const title1Layer = parseTitleLayer(mediaSettings?.title1Layer)
  const title2Layer = parseTitleLayer(mediaSettings?.title2Layer)

  const designWidth = isMobile ? HERO_MOBILE_DESIGN_WIDTH : HERO_DESIGN_WIDTH
  // Full-bleed proporsional: aspect ratio frame konstan (designWidth : 580),
  // semua elemen berbasis % + scale → proporsi builder == live di semua lebar.
  const layoutScale = measuredWidth > 0 ? measuredWidth / designWidth : 1
  const heightScale = layoutScale
  const frameHeight = BOLD_HERO_DESIGN_HEIGHT * heightScale
  const scale = heightScale

  const mediaHasMobileOverride = Boolean(
    mediaSettings?.[MOBILE_OVERRIDE_FLAG] ||
      hasMobileOverride(mediaBlock?.settings as Record<string, unknown> | undefined),
  )
  const useMobileTitleSeed = isMobile && !mediaHasMobileOverride

  const title1Layout = useMobileTitleSeed
    ? defaultHeroTitle1Layout(true)
    : parseHeroTitleLayout(mediaSettings, "title1", isMobile)
  const title2Layout = useMobileTitleSeed
    ? defaultHeroTitle2Layout(true, title1Layout)
    : parseHeroTitleLayout(mediaSettings, "title2", isMobile)

  const rawCanvasImages = parseCanvasImages(mediaSettings)
  const canvasImages = useMobileTitleSeed
    ? mobileFitCanvasImages(rawCanvasImages)
    : rawCanvasImages

  const ctaHasMobileOverride = Boolean(
    ctaSettings?.[MOBILE_OVERRIDE_FLAG] || hasMobileOverride(ctaSettings),
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

  // Element-level selection lives in the workspace (Canva-like floating toolbar).
  const sectionId = canvas?.sectionId
  const selectedElement = editor?.selectedElement ?? null
  const elementInMedia =
    selectedElement &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === mediaBlock?.id
      ? selectedElement
      : null
  const activeImageId =
    elementInMedia?.kind === "image" ? elementInMedia.itemId ?? null : null
  const activeTitleLine: HeroTitleLine | null =
    elementInMedia?.kind === "text" &&
    (elementInMedia.itemId === "title1" || elementInMedia.itemId === "title2")
      ? elementInMedia.itemId
      : null

  const selectElement = (
    kind: SelectedElementKind,
    blockId: string | undefined,
    itemId?: string,
  ) => {
    if (!blockId || !sectionId || !editor) return
    editor.onSelectBlock?.(sectionId, blockId)
    editor.onSelectElement?.({ kind, sectionId, blockId, itemId })
  }

  const elementDomKey = (
    kind: SelectedElementKind,
    blockId: string | undefined,
    itemId?: string,
  ) =>
    blockId && sectionId
      ? canvasElementDomKey({ kind, sectionId, blockId, itemId })
      : undefined

  const hasImage = canvasImages.length > 0 || Boolean(image.url)

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
          images: canvasImages,
          ...patch,
        }
      : patch
    editor.onBlockChange?.(canvas!.sectionId, mediaBlock.id, full)
  }

  const onMultiImageChange = (imageId: string, patch: Partial<CanvasImageItem>) => {
    if (!mediaBlock || !editor) return
    const updatedImages = updateImageInArray(canvasImages, imageId, patch)
    const full = useMobileTitleSeed
      ? {
          ...heroTitleLayoutsToPatch(title1Layout, title2Layout),
          title1Layer,
          title2Layer,
          imgScale: image.scale,
          imgX: image.x,
          imgY: image.y,
          images: updatedImages,
        }
      : { images: updatedImages }
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

  const frameBgStyle = parseFrameBackground(mediaSettings)

  return (
    <div
      ref={frameRef}
      id="section-hero"
      data-canvas-element={elementDomKey("frame", mediaBlock?.id)}
      className="relative w-full overflow-visible bg-sky-400"
      style={{
        aspectRatio: `${designWidth} / ${BOLD_HERO_DESIGN_HEIGHT}`,
        ...frameBgStyle,
      }}
    >
      {/* Legacy single image di storefront: full-bleed cover */}
      {canvasImages.length === 0 && Boolean(image.url) && !editable && (
        <HeroBackground url={image.url} alt={titleLine1} zoom={heroImageZoom} />
      )}

      {editable && (
        <CanvasGridOverlay canvasHeight={BOLD_HERO_DESIGN_HEIGHT} scale={scale} />
      )}

      <div
        className="absolute inset-0 overflow-hidden"
        onClick={
          editable
            ? (event) => {
                // Klik area kosong frame = pilih latar hero.
                if (event.target !== event.currentTarget) return
                event.stopPropagation()
                selectElement("frame", mediaBlock?.id)
              }
            : undefined
        }
      >
        {behindTitles.map((item) => (
          <BoldTitleLine
            key={`${item.line}-behind`}
            {...item}
            frameHeightPx={frameHeight}
            frameRef={frameRef}
            mediaInteractive={mediaInteractive}
            editable={editable}
            lineSelected={mediaInteractive && activeTitleLine === item.line}
            domKey={elementDomKey("text", mediaBlock?.id, item.line)}
            onActivate={() => selectElement("text", mediaBlock?.id, item.line)}
            onHeroChange={(key, val) => editor?.onHeroChange?.(key, val)}
            onLayoutChange={onMediaChange}
            onSelectMedia={() =>
              mediaBlock && editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
            }
          />
        ))}

        <CanvasFreeTextLayer
          items={canvasTexts}
          editable={editable}
          interactive={mediaInteractive}
          sectionId={sectionId}
          blockId={mediaBlock?.id}
          editor={editor}
          designWidth={designWidth}
          renderLayer="behind"
          onItemsChange={(texts) => onMediaChange({ texts })}
        />

        {/* Multi-image canvas layer (same as bento — move / crop / background toggle) */}
        {canvasImages.length > 0 && mediaBlock && (
          <div
            className={cn("absolute inset-0", !editable && "pointer-events-none")}
            style={{ zIndex: Z_IMAGE }}
            onClick={
              editable
                ? (event) => {
                    event.stopPropagation()
                    // Klik area kosong (bukan gambar) = pilih latar hero.
                    if (event.target === event.currentTarget) {
                      selectElement("frame", mediaBlock.id)
                      return
                    }
                    editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
                    editor?.onSelectElement?.(null)
                  }
                : undefined
            }
          >
            {canvasImages.map((img) => (
              <CanvasMultiImageItem
                key={img.id}
                item={img}
                selected={mediaInteractive && activeImageId === img.id}
                editable={mediaInteractive}
                domKey={elementDomKey("image", mediaBlock.id, img.id)}
                cropping={
                  editor?.croppingElementKey ===
                  elementDomKey("image", mediaBlock.id, img.id)
                }
                onSelect={() => selectElement("image", mediaBlock.id, img.id)}
                onChange={(patch) => onMultiImageChange(img.id, patch)}
              />
            ))}
          </div>
        )}

        {/* Legacy single image: editable frame di builder (storefront: full-bleed di outer) */}
        {canvasImages.length === 0 && Boolean(image.url) && mediaBlock && editable && (
          <div
            className="absolute inset-0"
            style={{ zIndex: Z_IMAGE }}
            onClick={(event) => {
              event.stopPropagation()
              selectElement("image", mediaBlock.id)
            }}
          >
            <CanvasImageFrame
              image={image}
              interactive={mediaInteractive}
              domKey={elementDomKey("image", mediaBlock.id)}
              onChange={onMediaChange}
            />
          </div>
        )}

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
            domKey={elementDomKey("text", mediaBlock?.id, item.line)}
            onActivate={() => selectElement("text", mediaBlock?.id, item.line)}
            onHeroChange={(key, val) => editor?.onHeroChange?.(key, val)}
            onLayoutChange={onMediaChange}
            onSelectMedia={() =>
              mediaBlock && editor?.onSelectBlock?.(canvas!.sectionId, mediaBlock.id)
            }
          />
        ))}

        <CanvasFreeTextLayer
          items={canvasTexts}
          editable={editable}
          interactive={mediaInteractive}
          sectionId={sectionId}
          blockId={mediaBlock?.id}
          editor={editor}
          designWidth={designWidth}
          onItemsChange={(texts) => onMediaChange({ texts })}
        />
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
          domKey={elementDomKey("button", ctaBlock?.id)}
          onSelect={() => selectElement("button", ctaBlock?.id)}
          onChange={onCtaChange}
        />
      </div>

      {editable && !editor?.selectedBlockId && (
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-[30] text-center text-[10px] text-white/70">
          {hints?.boldHeroSelect ??
            "Klik judul atau tombol CTA untuk edit · ganti foto lewat panel kiri"}
        </p>
      )}
      {editable && mediaInteractive && (
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-[30] text-center text-[10px] text-white/70">
          {hints?.boldHeroDrag ??
            "Drag box judul untuk pindah · tarik handle ungu untuk ukuran · atur layer di panel kiri"}
        </p>
      )}
    </div>
  )
}
