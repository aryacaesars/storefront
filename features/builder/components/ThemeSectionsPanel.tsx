"use client"

import { useState } from "react"
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react"
import { SectionInspector } from "@/features/builder/components/SectionInspector"
import {
  materializePageTemplate,
  resolvePageTemplate,
} from "@/themes/engine/page-template"
import {
  addSectionToTemplate,
  removeSectionFromTemplate,
  reorderSections,
  updateSectionBlocks,
  updateSectionSettings,
} from "@/themes/engine/section-page-utils"
import {
  getSectionDefinition,
  getSectionRegistry,
} from "@/themes/engine/section-registry"
import type {
  BlockInstance,
  HeroConfig,
  PageTemplate,
  SectionPageType,
  ThemeConfig,
} from "@/themes/engine/schema"
import type { PreviewDevice } from "@/features/builder/components/EditorTopbar"

interface ThemeSectionsPanelProps {
  config: ThemeConfig
  selectedPage: SectionPageType
  onConfigChange: (config: ThemeConfig) => void
  onHeroChange: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void
  selectedSectionId: string | null
  selectedBlockId?: string | null
  onSelectSection: (sectionId: string | null) => void
  device?: PreviewDevice
}

function withPageTemplate(
  config: ThemeConfig,
  pageType: SectionPageType,
  template: PageTemplate,
): ThemeConfig {
  return {
    ...config,
    templates: {
      ...config.templates,
      [pageType]: template,
    },
  }
}

export function ThemeSectionsPanel({
  config,
  selectedPage,
  onConfigChange,
  onHeroChange,
  selectedSectionId,
  selectedBlockId,
  onSelectSection,
  device = "desktop",
}: ThemeSectionsPanelProps) {
  const resolved = resolvePageTemplate(config, selectedPage)
  const registry = getSectionRegistry(config.templateId)
  const [sectionTypeToAdd, setSectionTypeToAdd] = useState(
    () => Object.keys(registry)[0] ?? "",
  )
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  function ensureStoredTemplate(): PageTemplate {
    const stored = config.templates?.[selectedPage]
    if (stored) {
      return {
        order: [...stored.order],
        sections: { ...stored.sections },
      }
    }
    return materializePageTemplate(config, selectedPage)
  }

  function applyTemplate(template: PageTemplate) {
    onConfigChange(withPageTemplate(config, selectedPage, template))
  }

  function toggleDisabled(sectionId: string) {
    const template = ensureStoredTemplate()
    const section = template.sections[sectionId]
    if (!section) return

    template.sections = {
      ...template.sections,
      [sectionId]: {
        ...section,
        disabled: !section.disabled,
      },
    }
    applyTemplate(template)
  }

  function removeSection(sectionId: string) {
    const template = removeSectionFromTemplate(ensureStoredTemplate(), sectionId)
    if (selectedSectionId === sectionId) {
      onSelectSection(null)
    }
    applyTemplate(template)
  }

  function addSection() {
    if (!sectionTypeToAdd) return
    const template = addSectionToTemplate(ensureStoredTemplate(), sectionTypeToAdd)
    const newId = template.order[template.order.length - 1]
    onSelectSection(newId)
    applyTemplate(template)
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      return
    }

    const template = ensureStoredTemplate()
    applyTemplate({
      ...template,
      order: reorderSections(template.order, dragIndex, dropIndex),
    })
    setDragIndex(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="p-4">
        <p className="mb-3 text-xs text-gray-500">
          Klik section di preview atau daftar di bawah. Drag grip untuk urutkan.
        </p>

        <ul className="space-y-2">
          {resolved.order.map((sectionId, index) => {
            const instance = resolved.sections[sectionId]
            if (!instance) return null

            const definition = getSectionDefinition(config.templateId, instance.type)
            const label = definition?.label ?? instance.type
            const disabled = Boolean(instance.disabled)
            const isSelected = selectedSectionId === sectionId

            return (
              <li
                key={sectionId}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
                className={`rounded-lg border px-3 py-2 transition-colors ${
                  isSelected
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 bg-gray-50"
                } ${dragIndex === index ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragEnd={() => setDragIndex(null)}
                    className="cursor-grab rounded p-1 text-gray-400 hover:bg-gray-200 active:cursor-grabbing"
                    aria-label={`Drag ${label}`}
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectSection(isSelected ? null : sectionId)}
                    className={`flex-1 text-left text-sm font-medium ${
                      disabled ? "text-gray-400 line-through" : "text-gray-800"
                    }`}
                  >
                    {label}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleDisabled(sectionId)}
                    className="rounded p-1 text-gray-500 hover:bg-gray-200"
                    aria-label={disabled ? `Show ${label}` : `Hide ${label}`}
                  >
                    {disabled ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(sectionId)}
                    className="rounded p-1 text-gray-500 hover:bg-red-100 hover:text-red-600"
                    aria-label={`Remove ${label}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 flex gap-2">
          <select
            value={sectionTypeToAdd}
            onChange={(event) => setSectionTypeToAdd(event.target.value)}
            className="h-9 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-indigo-400"
          >
            {Object.values(registry).map((definition) => (
              <option key={definition.type} value={definition.type}>
                {definition.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>

      <div className="mt-auto overflow-y-auto border-t border-gray-200">
        <SectionInspector
          config={config}
          selectedPage={selectedPage}
          selectedSectionId={selectedSectionId}
          selectedBlockId={selectedBlockId}
          device={device}
          onConfigChange={onConfigChange}
          onHeroChange={onHeroChange}
          onSectionSettingsChange={(sectionId, settings) =>
            applyTemplate(
              updateSectionSettings(ensureStoredTemplate(), sectionId, settings),
            )
          }
          onSectionBlocksChange={(sectionId, blocks: BlockInstance[]) =>
            applyTemplate(
              updateSectionBlocks(ensureStoredTemplate(), sectionId, blocks),
            )
          }
        />
      </div>
    </div>
  )
}
