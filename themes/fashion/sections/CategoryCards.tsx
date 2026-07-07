"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import type { SectionProps } from "@/themes/engine/section-registry"
import type { BlockInstance } from "@/themes/engine/schema"
import {
  parseImageTransform,
  type CategoryImage,
} from "@/themes/bento/sections/category-grid-layout"
import { CATEGORIES } from "@/themes/fashion/data/mock"

type FashionCard = {
  id: string
  slug: string
  label: string
  cta: string
  cardBgColor: string
  image: CategoryImage
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
  }))
}

interface CardItemProps {
  card: FashionCard
  editable: boolean
  selected: boolean
  onSelect: () => void
  onChange: (patch: Record<string, unknown>) => void
}

function CardItem({ card, editable, selected, onSelect, onChange }: CardItemProps) {
  const inner = (
    <>
      <div
        className="relative aspect-[4/5] md:aspect-[3/4]"
        style={{ backgroundColor: card.cardBgColor }}
      >
        {(card.image.url || editable) && (
          <div
            className={cn(
              "absolute inset-0 overflow-hidden",
              !selected && "pointer-events-none",
            )}
          >
            <CanvasImageFrame image={card.image} interactive={selected} onChange={onChange} />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-colors group-hover:from-black/70" />
      <div className="absolute bottom-0 left-0 px-5 pb-5">
        <p className="text-xs uppercase tracking-[0.15em] text-white/70">{card.cta}</p>
        <h3
          className="mt-1 text-xl font-medium text-white"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {card.label}
        </h3>
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
            onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, card.id)}
            onChange={(patch) => editor?.onBlockChange?.(canvas!.sectionId, card.id, patch)}
          />
        ))}
      </div>
      {editable && !editor?.selectedBlockId && (
        <p className="mt-4 text-center text-[11px] text-gray-400">
          Klik kartu untuk edit · drag gambar untuk geser · tarik ⊙ untuk zoom
        </p>
      )}
    </div>
  )
}
