"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { CanvasGridOverlay } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasHeroCta } from "@/features/builder/components/canvas/CanvasHeroCta"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasLabelResizeHandles } from "@/features/builder/components/canvas/CanvasLabelResizeHandles"
import { createDragSession } from "@/features/builder/components/canvas/visual-frame"
import { CanvasFreeTextLayer } from "@/features/builder/components/canvas/CanvasFreeTextLayer"
import type { SectionProps } from "@/themes/engine/section-registry"
import {
  parseCanvasImages,
  mobileFitCanvasImages,
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
  DEFAULT_CTA_LAYOUT_MOBILE,
  HERO_DESIGN_HEIGHT,
  HERO_DESIGN_WIDTH,
  HERO_MOBILE_DESIGN_WIDTH,
  parseHeroCta,
} from "@/themes/bento/sections/hero-cta-layout"
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

const Z_TITLE_BEHIND = 5
const Z_IMAGE = 10
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

interface FashionTitleLineProps {
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
  lineSelected: boolean
  domKey?: string
  onActivate: () => void
  onHeroKey: "title" | "subtitle"
  onHeroChange?: (key: "title" | "subtitle", value: string) => void
  onLayoutChange: (patch: Record<string, unknown>) => void
  onSelectMedia: () => void
}

function FashionTitleLine({
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
  lineSelected,
  domKey,
  onActivate,
  onHeroKey,
  onHeroChange,
  onLayoutChange,
  onSelectMedia,
}: FashionTitleLineProps) {
  const labelResizable = editable && mediaInteractive
  const labelEditable = labelResizable && layer === "front"
  const labelMovable = labelResizable

  const labelBoxHeightPx = frameHeightPx * (labelLayout.hPct / 100)

  const labelStyle: React.CSSProperties = isSubtitle
    ? {
        fontFamily: styleOverride.fontFamily ?? "var(--theme-body-font)",
        fontSize: `${Math.max(10, labelBoxHeightPx * 0.45 * styleOverride.sizeScale)}px`,
        lineHeight: 1.5,
        fontWeight: styleOverride.fontWeight ?? 300,
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        fontStyle: styleOverride.fontStyle ?? "normal",
        ...(styleOverride.color && { color: styleOverride.color }),
        ...heroTitleOverrideCss(styleOverride),
      }
    : {
        fontFamily: styleOverride.fontFamily ?? "var(--theme-heading-font)",
        fontSize: `${Math.max(20, labelBoxHeightPx * 0.72 * styleOverride.sizeScale)}px`,
        lineHeight: 1.05,
        fontWeight: styleOverride.fontWeight ?? 300,
        fontStyle: styleOverride.fontStyle ?? "italic",
        ...(styleOverride.color && { color: styleOverride.color }),
        ...heroTitleOverrideCss(styleOverride),
      }

  const colorClass = isSubtitle ? "text-white/70" : "text-white"

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
      className={cn("block w-full", colorClass)}
      style={labelStyle}
    />
  ) : (
    <p className={cn("block w-full", colorClass)} style={labelStyle}>
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
          data-canvas-element={domKey}
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
  const titleLine1 = hero?.title ?? "Curated For Everyday Beauty"
  const titleLine2 = hero?.subtitle ?? "New Season Arrival"
  const ctaHref = hero?.ctaHref ?? "/products"

  const mediaBlock = blocks?.find((b) => b.type === "hero-media") ?? blocks?.[0]
  const ctaBlock = blocks?.find((b) => b.type === "hero-cta") ?? blocks?.[1]

  const mediaSettings = mediaBlock?.settings as Record<string, unknown> | undefined
  const parsed = parseImageTransform(mediaSettings)
  // Explicit empty imageUrl = intentionally cleared — do not resurrect config.heroImageUrl.
  const inBuilder = Boolean(canvas?.editor)
  const image = {
    ...parsed,
    url:
      mediaSettings && "imageUrl" in mediaSettings
        ? parsed.url
        : inBuilder
          ? parsed.url
          : (parsed.url ?? config?.heroImageUrl),
  }
  const canvasTexts = parseCanvasTexts(mediaSettings)

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
    (ctaBlock?.settings as Record<string, unknown> | undefined)?.[MOBILE_OVERRIDE_FLAG] ||
      hasMobileOverride(ctaBlock?.settings as Record<string, unknown> | undefined),
  )
  const useMobileCtaSeed = isMobile && !ctaHasMobileOverride

  const parsedCta = parseHeroCta(
    ctaBlock?.settings as Record<string, unknown> | undefined,
    hero?.ctaLabel ?? "EXPLORE COLLECTION",
    isMobile,
  )
  const cta = useMobileCtaSeed ? { ...parsedCta, layout: DEFAULT_CTA_LAYOUT_MOBILE } : parsedCta

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

  const onCtaChange = (patch: Record<string, unknown>) => {
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

  // Judul bisa "dihapus" dari builder — flag title{n}Hidden di settings media.
  const visibleTitleLines = titleLines.filter(
    (item) => mediaSettings?.[`${item.line}Hidden`] !== true,
  )
  const behindTitles = visibleTitleLines.filter((item) => item.layer === "behind")
  const frontTitles = visibleTitleLines.filter((item) => item.layer === "front")

  const frameBgStyle = parseFrameBackground(mediaSettings)

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

      <div
        ref={frameRef}
        data-canvas-element={elementDomKey("frame", mediaBlock?.id)}
        className="relative w-full overflow-visible bg-gradient-to-br from-stone-300 via-amber-100 to-stone-400"
        style={{ height: frameHeight, ...frameBgStyle }}
      >
        {editable && (
          <CanvasGridOverlay canvasHeight={HERO_DESIGN_HEIGHT} scale={scale} />
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
            <FashionTitleLine
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

          {/* Multi-image layer */}
          {canvasImages.length > 0 && mediaBlock && (
            <div
              className={cn("absolute inset-0", !editable && "pointer-events-none")}
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
                  cropping={editor?.croppingElementKey === elementDomKey("image", mediaBlock.id, img.id)}
                  onSelect={() => selectElement("image", mediaBlock.id, img.id)}
                  onChange={(patch) => onMultiImageChange(img.id, patch)}
                />
              ))}
              {/* Gradient overlays rendered above all images */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"
                style={{ zIndex: 25 }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                style={{ zIndex: 25 }}
              />
            </div>
          )}

          {/* Fallback: single legacy image when images array is empty */}
          {canvasImages.length === 0 && Boolean(image.url) && mediaBlock && (
            <div
              className={cn("absolute inset-0", !editable && "pointer-events-none")}
              style={{ zIndex: Z_IMAGE }}
              onClick={
                editable
                  ? (event) => {
                      event.stopPropagation()
                      selectElement("image", mediaBlock.id)
                    }
                  : undefined
              }
            >
              <CanvasImageFrame
                image={image}
                interactive={mediaInteractive}
                domKey={elementDomKey("image", mediaBlock.id)}
                onChange={onMediaChange}
              />
              {/* Overlays live inside the image div so they darken only the image,
                  not behind-positioned title labels at z=5. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
              />
            </div>
          )}

          {frontTitles.map((item) => (
            <FashionTitleLine
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

        {ctaBlock && (
          <CanvasHeroCta
            cta={cta}
            href={ctaHref}
            editable={editable}
            selected={ctaInteractive}
            scale={scale}
            designWidth={designWidth}
            frameRef={frameRef}
            domKey={elementDomKey("button", ctaBlock.id)}
            onSelect={() => selectElement("button", ctaBlock.id)}
            onChange={onCtaChange}
          />
        )}

        {editable && !editor?.selectedBlockId && (
          <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-[30] text-center text-[10px] text-white/70">
            Klik judul, gambar, atau tombol CTA untuk edit
          </p>
        )}
        {editable && mediaInteractive && (
          <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-[30] text-center text-[10px] text-white/70">
            Drag box judul untuk pindah · tarik handle ungu untuk ukuran · atur layer di panel kiri
          </p>
        )}
      </div>
    </>
  )
}
