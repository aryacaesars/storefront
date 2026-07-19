"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { ThemeFontScope } from "@/themes/engine/ThemeFontScope"
import { resolvePageTemplate } from "@/themes/engine/page-template"
import { getSectionDefinition } from "@/themes/engine/section-registry"
import { resolveDeviceSettings } from "@/themes/engine/device-settings"
import type { ThemeConfig } from "@/themes/engine/schema"

/** Lebar desain hero theme engine — dipakai sebagai basis scale thumbnail. */
const THUMB_DESIGN_WIDTH = 1200

/** Tinggi frame hero per theme (tanpa padding section). */
const HERO_FRAME_HEIGHT: Record<string, number> = {
  bold: 580,
  bento: 580,
  minimalist: 580,
  fashion: 580,
}

interface ThemeHeroThumbnailProps {
  config: ThemeConfig
  className?: string
}

/**
 * Thumbnail live: render section hero homepage, di-scale cover ke card
 * (object-fit: cover). Padding/banner section di-strip supaya non-bold
 * tidak letterbox / cacat di aspect 16/10.
 */
export function ThemeHeroThumbnail({ config, className }: ThemeHeroThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      setBox({ w: el.clientWidth, h: el.clientHeight })
    }
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const template = resolvePageTemplate(config, "home")
  let heroInstance = null as (typeof template.sections)[string] | null
  for (const id of template.order) {
    const instance = template.sections[id]
    if (instance && !instance.disabled && instance.type === "hero") {
      heroInstance = instance
      break
    }
  }

  if (!heroInstance) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 text-sm text-gray-400",
          className,
        )}
      >
        Hero belum tersedia
      </div>
    )
  }

  const definition = getSectionDefinition(config.templateId, heroInstance.type)
  if (!definition) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 text-sm text-gray-400",
          className,
        )}
      >
        Hero belum tersedia
      </div>
    )
  }

  const resolvedSettings = resolveDeviceSettings(heroInstance.settings, false)
  const resolvedBlocks = heroInstance.blocks?.map((block) => {
    const settings = resolveDeviceSettings(block.settings, false)
    return settings === block.settings ? block : { ...block, settings }
  })
  const Component = definition.component

  // Banner toko tidak relevan di thumbnail — bikin crop fashion/bento jelek.
  const thumbConfig: ThemeConfig = { ...config, bannerText: "" }

  const designH = HERO_FRAME_HEIGHT[config.templateId] ?? 580
  const ready = box.w > 0 && box.h > 0
  const scale = ready
    ? Math.max(box.w / THUMB_DESIGN_WIDTH, box.h / designH)
    : 0
  // Cover: center horizontal, bias sedikit ke atas biar judul hero tetap kebaca.
  const offsetX = ready ? (box.w - THUMB_DESIGN_WIDTH * scale) / 2 : 0
  const offsetY = ready ? Math.min(0, (box.h - designH * scale) / 4) : 0

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden bg-gray-100", className)}
      aria-hidden
    >
      <div
        className={cn(
          "pointer-events-none origin-top-left select-none",
          // Strip chrome section (padding / max-width / radius) — penyebab
          // thumbnail bento/minimalist letterbox & terasa "cacat".
          "[&_section]:!m-0 [&_section]:!max-w-none [&_section]:!px-0 [&_section]:!py-0",
          "[&_section>div]:!rounded-none",
        )}
        style={{
          width: THUMB_DESIGN_WIDTH,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          visibility: ready ? "visible" : "hidden",
        }}
      >
        <ThemeFontScope templateId={config.templateId} fill={false}>
          <ThemeProvider config={thumbConfig} forcedDevice="desktop" surface={false}>
            <Component
              config={thumbConfig}
              settings={resolvedSettings}
              blocks={resolvedBlocks}
              isMobile={false}
            />
          </ThemeProvider>
        </ThemeFontScope>
      </div>
    </div>
  )
}
