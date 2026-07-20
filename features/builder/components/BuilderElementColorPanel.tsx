"use client"

import {
  CanvaColorChrome,
  type ColorMode,
  type ColorTarget,
} from "@/features/builder/components/color-panel/CanvaColorChrome"
import { toPickerHex } from "@/features/builder/components/color-panel/color-utils"
import { resolvePageTemplate } from "@/themes/engine/page-template"
import { resolveDeviceSettings } from "@/themes/engine/device-settings"
import { type SelectedElement } from "@/themes/engine/section-editor"
import { updateTextInArray } from "@/themes/engine/canvas-text"
import {
  updateButtonInArray,
  type CanvasButtonItem,
} from "@/themes/engine/canvas-button"
import {
  resolveSectionCanvasButtons,
  resolveSectionCanvasTexts,
} from "@/themes/engine/cta-canvas"
import type { SectionPageType, ThemeConfig } from "@/themes/engine/schema"
import type { PreviewDevice } from "@/features/builder/components/EditorTopbar"

const TITLE_LINES = new Set(["title1", "title2"])

interface BuilderElementColorPanelProps {
  config: ThemeConfig
  selectedPage: SectionPageType
  device: PreviewDevice
  element: SelectedElement | null
  onPatchBlock: (
    sectionId: string,
    blockId: string,
    patch: Record<string, unknown>,
  ) => void
  onClose?: () => void
}

function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Panel warna elemen — UI ala Canva (browse presets + solid/gradient picker).
 */
export function BuilderElementColorPanel({
  config,
  selectedPage,
  device,
  element,
  onPatchBlock,
  onClose,
}: BuilderElementColorPanelProps) {
  if (!element) {
    return (
      <CanvaColorChrome
        targets={[]}
        onChangeTarget={() => {}}
        onClose={onClose}
        emptyMessage="Select an element on the canvas to adjust its color."
      />
    )
  }

  const page = resolvePageTemplate(config, selectedPage)
  const instance = page.sections[element.sectionId]
  const block = instance?.blocks?.find((b) => b.id === element.blockId)
  if (!block) {
    return (
      <CanvaColorChrome
        targets={[]}
        onChangeTarget={() => {}}
        onClose={onClose}
        emptyMessage="Element not found."
      />
    )
  }

  const sectionSettings = instance?.settings as Record<string, unknown> | undefined
  const settings = resolveDeviceSettings(
    block.settings as Record<string, unknown> | undefined,
    device === "mobile",
  ) as Record<string, unknown> | undefined

  const patch = (partial: Record<string, unknown>) => {
    onPatchBlock(element.sectionId, element.blockId, partial)
  }

  const { targets, designColors, applyChange } = resolveColorBinding({
    element,
    config,
    instanceType: instance?.type,
    sectionSettings,
    settings,
    blockType: block.type,
    patch,
  })

  return (
    <CanvaColorChrome
      targets={targets}
      designColors={designColors}
      onClose={onClose}
      emptyMessage="This element has no color settings yet."
      onChangeTarget={(targetId: string, next) => applyChange(targetId, next)}
    />
  )
}

type Binding = {
  targets: ColorTarget[]
  designColors: string[]
  applyChange: (
    targetId: string,
    next: {
      color?: string
      color2?: string
      mode?: ColorMode
      angle?: number
    },
  ) => void
}

function resolveColorBinding({
  element,
  config,
  instanceType,
  sectionSettings,
  settings,
  blockType,
  patch,
}: {
  element: SelectedElement
  config: ThemeConfig
  instanceType: string | undefined
  sectionSettings: Record<string, unknown> | undefined
  settings: Record<string, unknown> | undefined
  blockType: string
  patch: (partial: Record<string, unknown>) => void
}): Binding {
  const designColors: string[] = []

  if (element.kind === "frame") {
    const hasCardWrapper =
      config.templateId === "bento" || config.templateId === "minimalist"
    const frameBg =
      typeof settings?.frameBgColor === "string" && settings.frameBgColor
        ? settings.frameBgColor
        : "#cccccc"
    const frameBg2 =
      typeof settings?.frameBgColor2 === "string" && settings.frameBgColor2
        ? settings.frameBgColor2
        : "#999999"
    const frameMode: ColorMode =
      settings?.frameBgMode === "gradient" ? "gradient" : "solid"
    const frameAngle = num(settings?.frameBgAngle, 135)
    const sectionBg =
      typeof settings?.sectionBgColor === "string" && settings.sectionBgColor
        ? settings.sectionBgColor
        : "#ffffff"

    designColors.push(frameBg, frameBg2, sectionBg)

    const targets: ColorTarget[] = [
      {
        id: "frame",
        label: hasCardWrapper ? "Background colors" : "Background colors",
        color: frameBg,
        color2: frameBg2,
        mode: frameMode,
        angle: frameAngle,
        allowGradient: true,
      },
    ]
    if (hasCardWrapper) {
      targets.push({
        id: "section",
        label: "Section background",
        color: sectionBg,
        mode: "solid",
        allowGradient: false,
      })
    }

    return {
      targets,
      designColors,
      applyChange: (targetId, next) => {
        if (targetId === "section") {
          if (next.color) patch({ sectionBgColor: next.color })
          return
        }
        const p: Record<string, unknown> = {}
        if (next.color !== undefined) p.frameBgColor = next.color
        if (next.color2 !== undefined) p.frameBgColor2 = next.color2
        if (next.mode !== undefined) p.frameBgMode = next.mode
        if (next.angle !== undefined) p.frameBgAngle = next.angle
        if (next.mode === "gradient" && !settings?.frameBgColor2 && next.color2 === undefined) {
          p.frameBgColor2 = frameBg2
        }
        patch(p)
      },
    }
  }

  if (element.kind === "text" && element.itemId && TITLE_LINES.has(element.itemId)) {
    const line = element.itemId as "title1" | "title2"
    const suffix = line === "title1" ? "1" : "2"
    const key = (k: string) => `title${suffix}${k}`
    const color =
      typeof settings?.[key("Color")] === "string"
        ? (settings[key("Color")] as string)
        : "#ffffff"
    designColors.push(color)
    return {
      targets: [
        {
          id: "text",
          label: "Text color",
          color,
          mode: "solid",
          allowGradient: false,
        },
      ],
      designColors,
      applyChange: (_id, next) => {
        if (next.color) patch({ [key("Color")]: next.color })
      },
    }
  }

  if (element.kind === "text" && element.itemId && blockType !== "category-card") {
    const texts = resolveSectionCanvasTexts(
      config.templateId,
      instanceType,
      sectionSettings,
      settings,
    )
    const item = texts.find((t) => t.id === element.itemId)
    if (item) {
      const color = item.color ?? "#111111"
      designColors.push(color)
      return {
        targets: [
          {
            id: "text",
            label: "Text color",
            color,
            mode: "solid",
            allowGradient: false,
          },
        ],
        designColors,
        applyChange: (_id, next) => {
          if (next.color) {
            patch({ texts: updateTextInArray(texts, item.id, { color: next.color }) })
          }
        },
      }
    }
  }

  if (element.kind === "button" && element.itemId) {
    const buttons = resolveSectionCanvasButtons(
      config.templateId,
      instanceType,
      sectionSettings,
      settings,
    )
    const item = buttons.find((b) => b.id === element.itemId)
    if (item) {
      const bg = item.bgColor ?? "#ffffff"
      const text = item.textColor ?? "#ffffff"
      designColors.push(bg, text)
      const patchButton = (p: Partial<CanvasButtonItem>) =>
        patch({ buttons: updateButtonInArray(buttons, item.id, p) })
      return {
        targets: [
          {
            id: "button-bg",
            label: "Background colors",
            color: bg,
            mode: "solid",
            allowGradient: false,
          },
          {
            id: "button-text",
            label: "Text color",
            color: text,
            mode: "solid",
            allowGradient: false,
          },
        ],
        designColors,
        applyChange: (targetId, next) => {
          if (!next.color) return
          if (targetId === "button-text") {
            patchButton({ textColor: next.color })
          } else {
            patchButton({
              bgColor: next.color,
              variant: item.variant === "filled" ? item.variant : "filled",
            })
          }
        },
      }
    }
  }

  if (element.kind === "button") {
    const bgColor =
      typeof settings?.ctaBgColor === "string" && settings.ctaBgColor
        ? settings.ctaBgColor
        : "#ffffff"
    const textColor =
      typeof settings?.ctaTextColor === "string" && settings.ctaTextColor
        ? settings.ctaTextColor
        : "#4f46e5"
    designColors.push(bgColor, textColor)
    return {
      targets: [
        {
          id: "button-bg",
          label: "Background colors",
          color: bgColor,
          mode: "solid",
          allowGradient: false,
        },
        {
          id: "button-text",
          label: "Text color",
          color: textColor,
          mode: "solid",
          allowGradient: false,
        },
      ],
      designColors,
      applyChange: (targetId, next) => {
        if (!next.color) return
        if (targetId === "button-text") patch({ ctaTextColor: next.color })
        else patch({ ctaBgColor: next.color })
      },
    }
  }

  return {
    targets: [],
    designColors: designColors.map(toPickerHex),
    applyChange: () => {},
  }
}
