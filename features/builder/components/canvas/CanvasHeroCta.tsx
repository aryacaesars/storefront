"use client"

import { CanvasBoundButton } from "@/features/builder/components/canvas/CanvasBoundButton"
import {
  MIN_CTA_HEIGHT,
  MAX_CTA_HEIGHT,
  type HeroCtaData,
} from "@/themes/bento/sections/hero-cta-layout"

interface CanvasHeroCtaProps {
  cta: HeroCtaData
  href: string
  editable: boolean
  selected: boolean
  scale: number
  designWidth: number
  frameRef: React.RefObject<HTMLDivElement | null>
  variant?: "filled" | "outline"
  /** Stamped as data-canvas-element so the floating toolbar can anchor here. */
  domKey?: string
  onSelect: () => void
  onChange: (patch: Record<string, unknown>) => void
}

/**
 * Wrapper tipis hero CTA (settings block `hero-cta`) di atas
 * `CanvasBoundButton` — sumber visual & interaksi tombol canvas yang sama
 * dengan `buttons[]` section lain.
 */
export function CanvasHeroCta({
  cta,
  href,
  editable,
  selected,
  scale,
  designWidth,
  frameRef,
  variant = "filled",
  domKey,
  onSelect,
  onChange,
}: CanvasHeroCtaProps) {
  return (
    <CanvasBoundButton
      label={cta.label}
      layout={cta.layout}
      href={href}
      editable={editable}
      selected={selected}
      scale={scale}
      designWidth={designWidth}
      frameRef={frameRef}
      bgColor={cta.bgColor}
      textColor={cta.textColor}
      variant={variant}
      shape={variant === "outline" ? "pill" : "rounded"}
      radius={cta.radius}
      minHeightPx={MIN_CTA_HEIGHT}
      maxHeightPx={MAX_CTA_HEIGHT}
      domKey={domKey}
      onSelect={onSelect}
      onChange={onChange}
    />
  )
}
