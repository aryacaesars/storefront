"use client"

import Link from "next/link"
import { useOptionalMessages } from "@/features/i18n/LocaleProvider"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasMultiImageItem } from "@/features/builder/components/canvas/CanvasMultiImageItem"
import {
  parseCanvasImages,
  updateImageInArray,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"
import type { SectionProps } from "@/themes/engine/section-registry"
import type { BlockInstance } from "@/themes/engine/schema"
import {
  FASHION_LABEL_BASE_PX,
  labelStyleOverrides,
  parseImageTransform,
  parseLabelStyle,
  type CategoryImage,
  type CategoryLabelStyle,
} from "@/themes/bento/sections/category-grid-layout"
import {
  canvasElementDomKey,
  isSameSelectedElement,
} from "@/themes/engine/section-editor"
import { CATEGORIES } from "@/themes/fashion/data/mock"

type FashionCard = {
  id: string
  slug: string
  label: string
  cta: string
  cardBgColor: string
  image: CategoryImage
  labelStyle: CategoryLabelStyle
  canvasImages: CanvasImageItem[]
}

const FALLBACK_COLORS = ["#d6d1c9", "#c4b49e", "#3f3f3f"]

function blockToCard(block: BlockInstance, index: number): FashionCard {
  const s = block.settings as Record<string, unknown> | undefined
  return {
    id: block.id,
    slug: typeof s?.slug === "string" ? s.slug : `category-${index}`,
    label: typeof s?.label === "string" ? s.label : "Category",
    cta: typeof s?.cta === "string" && s.cta ? s.cta : "SHOP NOW",
    cardBgColor:
      typeof s?.cardBgColor === "string" && s.cardBgColor
        ? s.cardBgColor
        : (FALLBACK_COLORS[index] ?? "#d6d1c9"),
    image: parseImageTransform(s),
    labelStyle: parseLabelStyle(s),
    canvasImages: parseCanvasImages(s),
  }
}

function defaultCards(): FashionCard[] {
  return CATEGORIES.map((cat, index) => ({
    id: `default-${index}`,
    slug: cat.slug,
    label: cat.label,
    cta: cat.cta,
    cardBgColor: FALLBACK_COLORS[index] ?? "#d6d1c9",
    image: parseImageTransform(undefined),
    labelStyle: parseLabelStyle(undefined),
    canvasImages: [],
  }))
}

interface CardItemProps {
  card: FashionCard
  editable: boolean
  selected: boolean
  labelSelected: boolean
  imageSelected: boolean
  activeImageId: string | null
  croppingElementKey?: string | null
  imageItemDomKey?: (itemId: string) => string | undefined
  labelDomKey?: string
  onSelect: () => void
  onSelectLabel: () => void
  onSelectImage: () => void
  onSelectImageItem: (itemId: string) => void
  onChange: (patch: Record<string, unknown>) => void
}

function CardItem({
  card,
  editable,
  selected,
  labelSelected,
  imageSelected,
  activeImageId,
  croppingElementKey,
  imageItemDomKey,
  labelDomKey,
  onSelect,
  onSelectLabel,
  onSelectImage,
  onSelectImageItem,
  onChange,
}: CardItemProps) {
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--theme-heading-font)",
    fontSize: `${Math.max(10, FASHION_LABEL_BASE_PX * card.labelStyle.sizeScale)}px`,
    ...labelStyleOverrides(card.labelStyle),
  }

  const labelEditable = editable && selected

  const labelContent = labelEditable ? (
    <CanvasInlineText
      value={card.label}
      onChange={(label) => onChange({ label })}
      className="mt-1 block w-full font-medium text-white"
      style={labelStyle}
    />
  ) : (
    <h3 className="mt-1 text-xl font-medium text-white" style={labelStyle}>
      {card.label}
    </h3>
  )

  const inner = (
    <>
      <div
        className="relative aspect-[4/5] md:aspect-[3/4]"
        style={{ backgroundColor: card.cardBgColor }}
      >
        {(card.canvasImages.length > 0 || card.image.url || editable) && (
          <div
            className={cn(
              "absolute inset-0 overflow-hidden",
              !selected && "pointer-events-none",
              imageSelected && card.canvasImages.length === 0 && "ring-2 ring-indigo-400",
            )}
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
            ) : (
              <CanvasImageFrame image={card.image} interactive={selected} onChange={onChange} />
            )}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-colors group-hover:from-black/70" />
      <div className="absolute bottom-0 left-0 px-5 pb-5">
        <p className="text-xs uppercase tracking-[0.15em] text-white/70">{card.cta}</p>
        <div
          data-canvas-element={labelDomKey}
          className={cn(labelSelected && "ring-2 ring-indigo-400")}
          onClick={
            editable
              ? (event) => {
                  event.stopPropagation()
                  onSelectLabel()
                }
              : undefined
          }
        >
          {labelContent}
        </div>
      </div>
    </>
  )

  const wrapperClass = cn(
    "group relative cursor-pointer overflow-hidden rounded-sm",
    editable && selected && "ring-2 ring-indigo-500 ring-offset-1",
  )

  if (editable) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={wrapperClass}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onSelect()
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            onSelect()
          }
        }}
      >
        {inner}
      </div>
    )
  }

  return (
    <Link href={`/categories/${card.slug}`} className={wrapperClass}>
      {inner}
    </Link>
  )
}

export function CategoryCards({ blocks, canvas }: SectionProps) {
  const hints = useOptionalMessages()?.pages.builder.canvasHints
  const items: FashionCard[] = blocks?.length
    ? blocks.map((block: BlockInstance, index) => blockToCard(block, index))
    : defaultCards()

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected)

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {items.map((card) => (
          <CardItem
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
            imageSelected={Boolean(
              canvas &&
                isSameSelectedElement(editor?.selectedElement, {
                  kind: "image",
                  sectionId: canvas.sectionId,
                  blockId: card.id,
                }),
            )}
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
            onChange={(patch) => editor?.onBlockChange?.(canvas!.sectionId, card.id, patch)}
          />
        ))}
      </div>
      {editable && !editor?.selectedBlockId && (
        <p className="mt-4 text-center text-[11px] text-gray-400">
          {hints?.fashionCards ??
            "Klik kartu untuk edit · klik label untuk edit teks · drag gambar untuk geser · tarik ⊙ untuk zoom"}
        </p>
      )}
    </div>
  )
}
