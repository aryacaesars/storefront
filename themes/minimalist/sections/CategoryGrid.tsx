"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasImageFrame } from "@/features/builder/components/canvas/CanvasImageFrame"
import type { SectionProps } from "@/themes/engine/section-registry"
import type { BlockInstance } from "@/themes/engine/schema"
import {
  parseCardBgColor,
  parseImageTransform,
  type CategoryImage,
} from "@/themes/bento/sections/category-grid-layout"
import { CATEGORIES } from "@/themes/minimalist/data/mock"

type MinimalistCard = {
  id: string
  slug: string
  label: string
  cardBgColor: string
  image: CategoryImage
}

function blockToCard(block: BlockInstance, index: number): MinimalistCard {
  const s = block.settings as Record<string, unknown> | undefined
  return {
    id: block.id,
    slug: typeof s?.slug === "string" ? s.slug : `category-${index}`,
    label: typeof s?.label === "string" ? s.label : "Category",
    cardBgColor: parseCardBgColor(s, index),
    image: parseImageTransform(s),
  }
}

function defaultCards(): MinimalistCard[] {
  return CATEGORIES.map((cat, index) => ({
    id: `default-${index}`,
    slug: cat.slug,
    label: cat.label,
    cardBgColor: "#d6d3d1",
    image: parseImageTransform(undefined),
  }))
}

interface CardItemProps {
  card: MinimalistCard
  aspectClass: string
  rowSpanClass?: string
  editable: boolean
  selected: boolean
  onSelect: () => void
  onChange: (patch: Record<string, unknown>) => void
}

function CardItem({
  card,
  aspectClass,
  rowSpanClass,
  editable,
  selected,
  onSelect,
  onChange,
}: CardItemProps) {
  const inner = (
    <>
      <div
        className={cn("relative overflow-hidden", aspectClass)}
        style={{ backgroundColor: card.cardBgColor }}
      >
        {(card.image.url || editable) && (
          <div
            className={cn(
              "absolute inset-0 overflow-hidden",
              !selected && "pointer-events-none",
            )}
          >
            <CanvasImageFrame
              image={card.image}
              interactive={selected}
              onChange={onChange}
            />
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <span className="pointer-events-none absolute bottom-6 left-6 text-lg font-medium text-white">
        {card.label}
      </span>
    </>
  )

  const wrapperClass = cn(
    "group relative overflow-hidden rounded-sm",
    rowSpanClass,
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

export function CategoryGrid({ blocks, canvas }: SectionProps) {
  const items: MinimalistCard[] = blocks?.length
    ? blocks.map((block: BlockInstance, index) => blockToCard(block, index))
    : defaultCards()

  const [featured, ...rest] = items

  const editor = canvas?.editor
  const isSectionSelected = editor?.selectedSectionId === canvas?.sectionId
  const editable = Boolean(editor && isSectionSelected)

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
            Explore our most considered categories — each piece chosen for longevity
            and quiet impact.
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

      {featured && (
        <div className="grid gap-4 @3xl:grid-cols-2 @3xl:grid-rows-2">
          <CardItem
            card={featured}
            aspectClass="aspect-[3/4] @3xl:aspect-auto @3xl:h-full min-h-[320px]"
            rowSpanClass="@3xl:row-span-2"
            editable={editable}
            selected={editor?.selectedBlockId === featured.id}
            onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, featured.id)}
            onChange={(patch) =>
              editor?.onBlockChange?.(canvas!.sectionId, featured.id, patch)
            }
          />

          {rest.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              aspectClass="aspect-[16/9]"
              editable={editable}
              selected={editor?.selectedBlockId === card.id}
              onSelect={() => editor?.onSelectBlock?.(canvas!.sectionId, card.id)}
              onChange={(patch) =>
                editor?.onBlockChange?.(canvas!.sectionId, card.id, patch)
              }
            />
          ))}
        </div>
      )}

      {editable && !editor?.selectedBlockId && (
        <p className="mt-4 text-center text-[11px] text-gray-400">
          Klik kartu untuk edit · drag gambar untuk geser · tarik ⊙ untuk zoom
        </p>
      )}
    </section>
  )
}
