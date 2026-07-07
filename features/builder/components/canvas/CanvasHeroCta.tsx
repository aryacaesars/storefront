"use client"

import Link from "next/link"
import { useCallback } from "react"
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
  variant?: "filled" | "outline" | "ghost"
  shape?: "pill" | "square"
  previewClassName?: string
  zIndex?: number
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
  variant = "filled",
  shape = "pill",
  previewClassName,
  zIndex = 20,
  onSelect,
  onChange,
}: CanvasHeroCtaProps) {
  const { layout } = cta
  const isOutline = variant === "outline"
  const isGhost = variant === "ghost"
  const isSquare = shape === "square"
  const textColor = cta.textColor
  const bgColor = isOutline || isGhost ? "transparent" : cta.bgColor
  const radiusOverride = cta.radius ?? null

  const startMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (
        event.target instanceof HTMLElement &&
        Boolean(event.target.closest('button[aria-label^="Tarik"]'))
      ) {
        return
      }
      event.stopPropagation()
      const startX = event.clientX
      const startY = event.clientY
      const originXPct = layout.xPct
      const originYPx = layout.yPx
      let dragging = false

      function onMove(moveEvent: PointerEvent) {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        if (!dragging && Math.abs(dx) + Math.abs(dy) < 4) return
        dragging = true
        moveEvent.preventDefault()
        const active = document.activeElement
        if (active instanceof HTMLElement && active.isContentEditable) {
          active.blur()
        }
        const frameWidth = frameRef.current?.clientWidth ?? 1
        const dxPct = (dx / frameWidth) * 100
        const dyDesign = dy / scale
        onChange({
          xPct: Math.max(
            0,
            Math.min(100 - layout.wPct, Math.round((originXPct + dxPct) * 10) / 10),
          ),
          yPx: Math.max(0, Math.round(originYPx + dyDesign)),
        })
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [frameRef, layout.wPct, layout.xPct, layout.yPx, onChange, scale],
  )

  const boxStyle: React.CSSProperties = {
    position: "absolute",
    left: `${layout.xPct}%`,
    width: `${layout.wPct}%`,
    top: `${layout.yPx * scale}px`,
    height: `${layout.hPx * scale}px`,
    zIndex,
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    fontFamily: "var(--theme-heading-font)",
    fontSize: `${Math.max(12, layout.hPx * scale * 0.38)}px`,
    ...(isOutline && {
      border: isSquare ? "1px solid #ffffff" : "1.5px solid #ffffff",
      boxShadow: "none",
    }),
    ...(isGhost && { border: "none", boxShadow: "none" }),
    ...(radiusOverride != null && { borderRadius: `${radiusOverride * scale}px` }),
  }

  const radiusClass =
    radiusOverride != null
      ? ""
      : isSquare
        ? "rounded-none"
        : isOutline
          ? "rounded-full"
          : "rounded-[47px]"
  const casingClass = isSquare ? "font-bold uppercase tracking-[0.14em]" : "font-black uppercase tracking-[0.14em] capitalize"

  const className = cn(
    "pointer-events-auto z-20 flex items-center justify-center overflow-visible px-6",
    radiusClass,
    casingClass,
    !isOutline && !isGhost && "shadow-lg",
    editable && "cursor-pointer",
    !editable && !previewClassName && "hover:opacity-80",
    previewClassName,
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
        className={cn(
          "pointer-events-auto",
          !selected && "ring-2 ring-transparent",
          selected && "cursor-move",
        )}
        onPointerDown={selected ? startMove : undefined}
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
            "flex h-full w-full items-center justify-center",
            radiusClass,
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
