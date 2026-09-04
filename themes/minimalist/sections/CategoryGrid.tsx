"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useOptionalMessages } from "@/features/i18n/LocaleProvider"
import { cn } from "@/lib/utils"
import {
  CanvasGridOverlay,
  CanvasMeasurementBadge,
} from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import { updateImageInArray } from "@/themes/engine/canvas-image"
import { CanvasLabelResizeHandles } from "@/features/builder/components/canvas/CanvasLabelResizeHandles"
import { CanvasResizeHandles } from "@/features/builder/components/canvas/CanvasResizeHandles"
import { createDragSession } from "@/features/builder/components/canvas/visual-frame"
import type { SectionProps } from "@/themes/engine/section-registry"
import type { BlockInstance } from "@/themes/engine/schema"
import {
  blockToCategoryCard,
  canvasHeight,
  defaultCategoryCards,
  DESIGN_WIDTH,
  labelLayoutToPatch,
  labelMoveFromDelta,
  labelStyleOverrides,
  MAX_CATEGORY_CARDS,
  MOBILE_DESIGN_WIDTH,
  mobileStackLayouts,
  type CategoryCardData,
  type CategoryLabelLayout,
  type LabelContainerMetrics,
} from "@/themes/bento/sections/category-grid-layout"
import {
  hasMobileOverride,
  MOBILE_OVERRIDE_FLAG,
} from "@/themes/engine/device-settings"
import {
  canvasElementDomKey,
  isSameSelectedElement,
} from "@/themes/engine/section-editor"

const STACK_BELOW = 640
const LABEL_DRAG_THRESHOLD = 4

const Z_BG = 1
const Z_LABEL_BEHIND = 5
const Z_IMAGE = 10
const Z_OVERLAY = 13
const Z_LABEL_FRONT = 15

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

interface MinimalistCardProps {
  card: CategoryCardData
  editable: boolean
  selected: boolean
  labelSelected: boolean
  imageSelected: boolean
  activeImageId: string | null
  croppingElementKey?: string | null
  imageItemDomKey?: (itemId: string) => string | undefined
  labelDomKey?: string
  useFreeForm: boolean
  scale: number
  designWidth: number
  gridRef: React.RefObject<HTMLDivElement | null>
  onSelect: () => void
  onSelectLabel: () => void
  onSelectImage: () => void
  onSelectImageItem: (itemId: string) => void
  onChange: (patch: Record<string, unknown>) => void
}

function MinimalistCard({
  card,
  editable,
  selected,
  labelSelected,
  imageSelected,
  activeImageId,
  croppingElementKey,
  imageItemDomKey,
  labelDomKey,
  useFreeForm,
  scale,
  designWidth,
  gridRef,
  onSelect,
  onSelectLabel,
  onSelectImage,
  onSelectImageItem,
  onChange,
}: MinimalistCardProps) {
  const cardBoundsRef = useRef<HTMLDivElement>(null)

  const style: React.CSSProperties = useFreeForm
    ? {
        position: "absolute",
        left: `${card.layout.xPct}%`,
        width: `${card.layout.wPct}%`,
        top: `${card.layout.yPx * scale}px`,
        height: `${card.layout.hPx * scale}px`,
      }
    : {
        position: "relative",
        width: "100%",
        height: card.layout.hPx,
      }

  const cardHeightPx = useFreeForm ? card.layout.hPx * scale : card.layout.hPx
  const labelBoxHeightPx = cardHeightPx * (card.labelLayout.hPct / 100)

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--theme-heading-font)",
    fontSize: `${Math.max(10, labelBoxHeightPx * 0.38 * card.labelStyle.sizeScale)}px`,
    lineHeight: 1.2,
    fontWeight: 500,
    ...labelStyleOverrides(card.labelStyle),
  }

  const labelLayer = card.labelLayer
  const labelResizable = editable && selected
  const labelEditable = labelResizable && (labelLayer === "front" || labelSelected)
  const labelMovable = labelResizable

  const startLabelMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!labelMovable || !cardBoundsRef.current || isLabelHandleTarget(event.target)) return

      event.stopPropagation()
      onSelectLabel()

      const startX = event.clientX
      const startY = event.clientY
      const origin: CategoryLabelLayout = { ...card.labelLayout }
      let dragging = false
      const session = createDragSession<Record<string, unknown>>(event, (patch) => onChange(patch))

      session.listen((moveEvent) => {
        if (!cardBoundsRef.current) return
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        if (!dragging && Math.abs(dx) + Math.abs(dy) < LABEL_DRAG_THRESHOLD) return
        dragging = true
        const metrics = getLabelMetrics(cardBoundsRef.current)
        session.push(labelLayoutToPatch(labelMoveFromDelta(dx, dy, metrics, origin)))
      })
    },
    [card.labelLayout, labelMovable, onChange, onSelectLabel],
  )

  const labelBoxStyle: React.CSSProperties = {
    position: "absolute",
    left: `${card.labelLayout.xPct}%`,
    top: `${card.labelLayout.yPct}%`,
    width: `${card.labelLayout.wPct}%`,
    height: `${card.labelLayout.hPct}%`,
  }

  // Box front auto-height (fit teks, ala box CTA) — hPct tetap sumber ukuran font.
  const labelBoxStyleFit: React.CSSProperties = {
    position: "absolute",
    left: `${card.labelLayout.xPct}%`,
    top: `${card.labelLayout.yPct}%`,
    width: `${card.labelLayout.wPct}%`,
  }

  const resizeHandles = labelSelected && labelResizable && (
    <CanvasLabelResizeHandles
      layout={card.labelLayout}
      containerRef={cardBoundsRef}
      onResize={(patch) => onChange(labelLayoutToPatch(patch))}
    />
  )

  const labelContent = labelEditable ? (
    <CanvasInlineText
      value={card.label}
      onChange={(label) => onChange({ label })}
      className="block w-full font-medium text-white"
      style={labelStyle}
    />
  ) : (
    <p className="block w-full font-medium text-white" style={labelStyle}>
      {card.label}
    </p>
  )

  const cardInner = (
    <div ref={cardBoundsRef} className="absolute inset-0 rounded-sm">
      <div className="absolute inset-0 overflow-hidden rounded-sm">
        <div
          className="absolute inset-0"
          style={{ zIndex: Z_BG, backgroundColor: card.bgColor }}
          aria-hidden
        />

        {labelLayer === "behind" && (
          <div
            data-canvas-element={labelDomKey}
            className={cn(
              "absolute flex items-start p-0",
              labelMovable && "cursor-move",
            )}
            style={{
              ...labelBoxStyle,
              zIndex: Z_LABEL_BEHIND,
              visibility: labelSelected ? "hidden" : undefined,
            }}
            onPointerDown={labelMovable ? startLabelMove : undefined}
          >
            {labelContent}
          </div>
        )}

        <div
          className={cn(
            "absolute inset-0",
            !selected && "pointer-events-none",
            imageSelected && card.canvasImages.length === 0 && "ring-2 ring-indigo-400",
          )}
          style={{ zIndex: Z_IMAGE }}
          onClick={
            selected && card.canvasImages.length === 0 && card.image.url
              ? (event) => {
                  event.stopPropagation()
                  onSelectImage()
                }
              : undefined
          }
        >
          {card.canvasImages.length > 0 ? (
            card.canvasImages.map((img) => (
              <CanvasMultiImageItem
                key={img.id}
                item={img}
                selected={selected && activeImageId === img.id}
                editable={selected}
                domKey={imageItemDomKey?.(img.id)}
                cropping={
                  croppingElementKey != null &&
                  croppingElementKey === imageItemDomKey?.(img.id)
                }
                onSelect={() => onSelectImageItem(img.id)}
                onChange={(patch) =>
                  onChange({
                    images: updateImageInArray(card.canvasImages, img.id, patch),
                  })
                }
              />
            ))
          ) : card.image.url ? (
            <CanvasImageFrame
              image={card.image}
              interactive={selected}
              onChange={onChange}
            />
          ) : null}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
          style={{ zIndex: Z_OVERLAY }}
        />

        {labelLayer === "front" && (
          <div
            data-canvas-element={labelDomKey}
            className={cn(
              "absolute flex items-end overflow-visible",
              labelMovable && "cursor-move",
            )}
            style={{ ...labelBoxStyleFit, zIndex: Z_LABEL_FRONT }}
            onPointerDown={labelMovable ? startLabelMove : undefined}
            onClick={
              editable
                ? (event) => {
                    event.stopPropagation()
                    onSelectLabel()
                  }
                : (event) => event.stopPropagation()
            }
          >
            {labelContent}
            {resizeHandles}
          </div>
        )}
      </div>

      {labelMovable && labelLayer === "behind" && (
        <div
          aria-hidden={labelSelected ? undefined : true}
          className="absolute z-[15] cursor-move rounded-sm"
          style={labelBoxStyleFit}
          onPointerDown={startLabelMove}
        >
          {/* Duplikat teks invisible = pengukur tinggi supaya proxy fit teks (ala CTA). */}
          <div className={cn(!labelSelected && "invisible")}>{labelContent}</div>
          {resizeHandles}
        </div>
      )}
    </div>
  )

  if (editable) {
    return (
      <div
        role="button"
        tabIndex={0}
        style={style}
        className={cn("block overflow-visible rounded-sm")}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onSelect()
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            event.stopPropagation()
            onSelect()
          }
        }}
      >
        {selected && (
          <CanvasMeasurementBadge
            layout={card.layout}
            imageScale={card.image.scale}
            hasImage={Boolean(card.image.url)}
          />
        )}
        {cardInner}
        {selected && useFreeForm && (
          <CanvasResizeHandles
            layout={card.layout}
            gridRef={gridRef}
            onResize={onChange}
            designWidth={designWidth}
          />
        )}
      </div>
    )
  }

  return (
    <Link href={`/categories/${card.slug}`} style={style} className="block overflow-hidden rounded-sm">
      {cardInner}
    </Link>
  )
}

export function CategoryGrid({ blocks, canvas, isMobile = false }: SectionProps) {
  const hints = useOptionalMessages()?.pages.builder.canvasHints
  const gridRef = useRef<HTMLDivElement>(null)
  const [isWideGrid, setIsWideGrid] = useState(true)
  const [measuredWidth, setMeasuredWidth] = useState(
    isMobile ? MOBILE_DESIGN_WIDTH : DESIGN_WIDTH,
  )

  useEffect(() => {
    const element = gridRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setIsWideGrid(width >= STACK_BELOW)
      setMeasuredWidth(width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const cards = blocks?.length
    ? blocks.slice(0, MAX_CATEGORY_CARDS).map((block: BlockInstance, index) =>
        blockToCategoryCard(block, index),
      )
    : defaultCategoryCards()

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected)

  const overriddenIds = new Set(
    blocks
      ?.filter(
        (b) =>
          Boolean(b.settings?.[MOBILE_OVERRIDE_FLAG]) ||
          hasMobileOverride(b.settings as Record<string, unknown> | undefined),
      )
      .map((b) => b.id) ?? [],
  )
  const freeFormMobile = isMobile && (overriddenIds.size > 0 || editable)
  const useFreeForm = isWideGrid || freeFormMobile
  const designWidth = isMobile ? MOBILE_DESIGN_WIDTH : DESIGN_WIDTH

  const stackLayouts = isMobile ? mobileStackLayouts(cards) : []
  const effectiveCards = cards.map((card, index) =>
    isMobile && !overriddenIds.has(card.id) && stackLayouts[index]
      ? { ...card, layout: stackLayouts[index] }
      : card,
  )

  const scale = useFreeForm && measuredWidth > 0 ? measuredWidth / designWidth : 1
  const sectionHeight = canvasHeight(effectiveCards) * scale

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-semibold text-[var(--theme-text)] @2xl:text-3xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Curated Selections
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[var(--theme-muted)]">
            Explore our most considered categories — each piece chosen for longevity and quiet impact.
          </p>
        </div>
        {!editable && (
          <Link
            href="/products"
            className="hidden shrink-0 text-xs font-semibold tracking-wide text-[var(--theme-primary)] hover:underline @2xl:block"
          >
            See All Categories
          </Link>
        )}
      </div>

      <div
        ref={gridRef}
        className={cn(!useFreeForm && "flex flex-col gap-4", editable && isWideGrid && "pt-8")}
        style={useFreeForm ? { position: "relative", height: sectionHeight } : undefined}
      >
        {editable && isWideGrid && (
          <CanvasGridOverlay canvasHeight={canvasHeight(effectiveCards)} scale={scale} />
        )}
        {effectiveCards.map((card) => {
          const useStackSeed = isMobile && !overriddenIds.has(card.id)
          return (
            <MinimalistCard
              key={card.id}
              card={card}
              editable={editable}
              selected={editor?.selectedBlockId === card.id}
              labelSelected={Boolean(
                canvas &&
                  isSameSelectedElement(editor?.selectedElement, {
                    kind: "text",
                    sectionId: canvas.sectionId,
                    blockId: card.id,
                    itemId: "label",
                  }),
              )}
              imageSelected={Boolean(
                canvas &&
                  isSameSelectedElement(editor?.selectedElement, {
                    kind: "image",
                    sectionId: canvas.sectionId,
                    blockId: card.id,
                  }),
              )}
              labelDomKey={
                canvas
                  ? canvasElementDomKey({
                      kind: "text",
                      sectionId: canvas.sectionId,
                      blockId: card.id,
                      itemId: "label",
                    })
                  : undefined
              }
              useFreeForm={useFreeForm}
              scale={scale}
              designWidth={designWidth}
              gridRef={gridRef}
              onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, card.id)}
              onSelectLabel={() => {
                if (!editor || !canvas) return
                editor.onSelectBlock?.(canvas.sectionId, card.id)
                editor.onSelectElement?.({
                  kind: "text",
                  sectionId: canvas.sectionId,
                  blockId: card.id,
                  itemId: "label",
                })
              }}
              activeImageId={
                editor?.selectedElement?.kind === "image" &&
                canvas &&
                editor.selectedElement.sectionId === canvas.sectionId &&
                editor.selectedElement.blockId === card.id
                  ? editor.selectedElement.itemId ?? null
                  : null
              }
              croppingElementKey={editor?.croppingElementKey}
              imageItemDomKey={(itemId) =>
                canvas
                  ? canvasElementDomKey({
                      kind: "image",
                      sectionId: canvas.sectionId,
                      blockId: card.id,
                      itemId,
                    })
                  : undefined
              }
              onSelectImage={() => {
                if (!editor || !canvas) return
                editor.onSelectBlock?.(canvas.sectionId, card.id)
                editor.onSelectElement?.({
                  kind: "image",
                  sectionId: canvas.sectionId,
                  blockId: card.id,
                })
              }}
              onSelectImageItem={(itemId) => {
                if (!editor || !canvas) return
                editor.onSelectBlock?.(canvas.sectionId, card.id)
                editor.onSelectElement?.({
                  kind: "image",
                  sectionId: canvas.sectionId,
                  blockId: card.id,
                  itemId,
                })
              }}
              onChange={(patch) => {
                const full = useStackSeed
                  ? {
                      xPct: card.layout.xPct,
                      wPct: card.layout.wPct,
                      yPx: card.layout.yPx,
                      hPx: card.layout.hPx,
                      labelXPct: card.labelLayout.xPct,
                      labelYPct: card.labelLayout.yPct,
                      labelWPct: card.labelLayout.wPct,
                      labelHPct: card.labelLayout.hPct,
                      labelLayer: card.labelLayer,
                      ...patch,
                    }
                  : patch
                editor?.onBlockChange?.(canvas!.sectionId, card.id, full)
              }}
            />
          )
        })}
      </div>

      {editable && !editor?.selectedBlockId && (
        <p className="mt-3 text-center text-[11px] text-gray-400">
          {hints?.categoryGridLabel.replace("{max}", String(MAX_CATEGORY_CARDS)) ??
            `Maks. ${MAX_CATEGORY_CARDS} kartu · klik kartu untuk edit · tarik tepi/sudut kartu · drag box label untuk pindah · tarik ⊙ ungu gambar untuk zoom · drag gambar untuk geser.`}
        </p>
      )}
    </section>
  )
}
