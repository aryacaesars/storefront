"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { CanvasMeasurementBadge } from "@/features/builder/components/canvas/CanvasGridOverlay"
import { CanvasInlineText } from "@/features/builder/components/canvas/CanvasInlineText"
import { CanvasResizeHandles } from "@/features/builder/components/canvas/CanvasResizeHandles"
import {
  MIN_CTA_HEIGHT,
  MAX_CTA_HEIGHT,
  type HeroCtaData,
} from "@/themes/bento/sections/hero-cta-layout"
import type { CategoryCardLayout } from "@/themes/bento/sections/category-grid-layout"

interface CanvasHeroCtaProps {
  cta: HeroCtaData
  href: string
  editable: boolean
  selected: boolean
  scale: number
  designWidth: number
  frameRef: React.RefObject<HTMLDivElement | null>
  onSelect: () => void
  onChange: (patch: Record<string, unknown>) => void
}

export function CanvasHeroCta({
  cta,
  href,
  editable,
  selected,
  scale,
  designWidth,
  frameRef,
  onSelect,
  onChange,
}: CanvasHeroCtaProps) {
  const { layout } = cta
  const textColor = cta.textColor.trim() || "var(--theme-primary)"

  const boxStyle: React.CSSProperties = {
    position: "absolute",
    left: `${layout.xPct}%`,
    width: `${layout.wPct}%`,
    top: `${layout.yPx * scale}px`,
    height: `${layout.hPx * scale}px`,
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: cta.bgColor,
    color: textColor,
    fontFamily: "var(--theme-heading-font)",
    fontSize: `${Math.max(12, layout.hPx * scale * 0.38)}px`,
  }

  const className = cn(
    "z-20 flex items-center justify-center overflow-visible rounded-[47px] px-4 font-bold capitalize shadow-lg",
    editable && "cursor-pointer",
    !editable && "hover:opacity-80",
  )

  const labelNode = editable ? (
    <CanvasInlineText
      value={cta.label}
      onChange={(label) => onChange({ label })}
      className="max-w-full truncate text-center outline-none focus:ring-2 focus:ring-indigo-300/50 rounded-sm"
    />
  ) : (
    <span className="max-w-full truncate text-center">{cta.label}</span>
  )

  const handleResize = (patch: Partial<CategoryCardLayout>) => onChange(patch)

  if (editable) {
    return (
      <div
        role="button"
        tabIndex={0}
        style={boxStyle}
        className={cn(editable && !selected && "ring-2 ring-transparent")}
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
            layout={layout}
            imageScale={100}
            hasImage={false}
          />
        )}
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-[47px]",
            className,
            selected && "ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent",
          )}
          style={buttonStyle}
        >
          {labelNode}
        </div>
        {selected && (
          <CanvasResizeHandles
            layout={layout}
            gridRef={frameRef}
            onResize={handleResize}
            designWidth={designWidth}
            minHeightPx={MIN_CTA_HEIGHT}
            maxHeightPx={MAX_CTA_HEIGHT}
          />
        )}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={className}
      style={{ ...boxStyle, ...buttonStyle }}
    >
      {cta.label}
    </Link>
  )
}
