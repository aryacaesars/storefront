"use client"

import { cn } from "@/lib/utils"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { resolvePageTemplate } from "@/themes/engine/page-template"
import {
  previewSectionDomId,
  type SectionEditorState,
} from "@/themes/engine/section-editor"
import { getSectionDefinition } from "@/themes/engine/section-registry"
import type { SectionPageType, ThemeConfig } from "@/themes/engine/schema"
import { useDeviceIsMobile } from "@/themes/engine/device-context"
import {
  hasMobileOverride,
  MOBILE_OVERRIDE_FLAG,
  resolveDeviceSettings,
} from "@/themes/engine/device-settings"

interface SectionRendererProps {
  config: ThemeConfig
  pageType: SectionPageType
  editor?: SectionEditorState
  /** Live catalog — omit in builder/preview so sections keep mock data. */
  products?: CatalogProduct[]
}

export function SectionRenderer({ config, pageType, editor, products }: SectionRendererProps) {
  const isMobile = useDeviceIsMobile()
  const template = resolvePageTemplate(config, pageType)

  return (
    <>
      {template.order.map((sectionId) => {
        const instance = template.sections[sectionId]
        if (!instance || instance.disabled) {
          return null
        }

        const definition = getSectionDefinition(config.templateId, instance.type)
        if (!definition) {
          return null
        }

        // Flatten desktop/mobile layers once, centrally, so sections stay simple.
        const resolvedSettings = resolveDeviceSettings(instance.settings, isMobile)
        const resolvedBlocks = instance.blocks?.map((block) => {
          const settings = resolveDeviceSettings(block.settings, isMobile)
          if (isMobile && hasMobileOverride(block.settings)) {
            return { ...block, settings: { ...(settings ?? {}), [MOBILE_OVERRIDE_FLAG]: true } }
          }
          return settings === block.settings ? block : { ...block, settings }
        })

        const Component = definition.component
        const content = (
          <Component
            config={config}
            settings={resolvedSettings}
            blocks={resolvedBlocks}
            isMobile={isMobile}
            products={products}
            canvas={
              editor
                ? {
                    sectionId,
                    pageType,
                    editor,
                  }
                : undefined
            }
          />
        )

        if (!editor) {
          return <div key={sectionId}>{content}</div>
        }

        const isSelected = editor.selectedSectionId === sectionId

        return (
          <div
            key={sectionId}
            id={previewSectionDomId(editor, sectionId)}
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              editor.onSelectSection(sectionId)
            }}
            onKeyDown={(event) => {
              const target = event.target as HTMLElement | null
              if (
                target?.isContentEditable ||
                target?.closest('[contenteditable="true"], [role="textbox"], input, textarea')
              ) {
                return
              }
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                editor.onSelectSection(sectionId)
              }
            }}
            className={cn(
              "relative cursor-pointer outline-none transition-shadow",
              "ring-2 ring-transparent ring-offset-2 ring-offset-white",
              isSelected && "ring-indigo-500",
              !isSelected && "hover:ring-indigo-200",
            )}
          >
            {isSelected && (
              <div className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                {definition.label}
              </div>
            )}
            {content}
          </div>
        )
      })}
    </>
  )
}
