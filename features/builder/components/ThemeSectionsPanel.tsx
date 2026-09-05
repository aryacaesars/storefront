"use client"

import { useState } from "react"
import {
  BookOpen,
  Eye,
  EyeOff,
  GripVertical,
  Images,
  LayoutGrid,
  LayoutTemplate,
  Layers,
  Mail,
  Megaphone,
  PanelBottom,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useMessages } from "@/features/i18n/LocaleProvider"
import {
  materializePageTemplate,
  resolvePageTemplate,
} from "@/themes/engine/page-template"
import {
  addSectionToTemplate,
  removeSectionFromTemplate,
  reorderSections,
} from "@/themes/engine/section-page-utils"
import {
  getSectionDefinition,
  getSectionRegistry,
} from "@/themes/engine/section-registry"
import type {
  PageTemplate,
  SectionPageType,
  ThemeConfig,
} from "@/themes/engine/schema"

interface ThemeSectionsPanelProps {
  config: ThemeConfig
  selectedPage: SectionPageType
  onConfigChange: (config: ThemeConfig) => void
  selectedSectionId: string | null
  onSelectSection: (sectionId: string | null) => void
}

const SECTION_ICONS: Record<string, LucideIcon> = {
  hero: LayoutTemplate,
  "image-layers": Images,
  "category-grid": LayoutGrid,
  "category-cards": LayoutGrid,
  "product-grid": ShoppingBag,
  "call-to-action": Megaphone,
  footer: PanelBottom,
  "brand-story": BookOpen,
  "community-gallery": Users,
  "signature-series": Sparkles,
  "newsletter-cta": Mail,
}

function getSectionIcon(type: string): LucideIcon {
  return SECTION_ICONS[type] ?? Layers
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
  selectedSectionId,
  onSelectSection,
}: ThemeSectionsPanelProps) {
  const t = useMessages().pages.builder.sectionsPanel
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
        <p className="mb-3 text-xs text-gray-500">{t.hint}</p>

        <ul className="space-y-2">
          {resolved.order.map((sectionId, index) => {
            const instance = resolved.sections[sectionId]
            if (!instance) return null

            const definition = getSectionDefinition(config.templateId, instance.type)
            const label = definition?.label ?? instance.type
            const disabled = Boolean(instance.disabled)
            const isSelected = selectedSectionId === sectionId
            const Icon = getSectionIcon(instance.type)

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
                    aria-label={t.dragAria.replace("{label}", label)}
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectSection(isSelected ? null : sectionId)}
                    className={`flex flex-1 items-center gap-2 text-left text-sm font-medium ${
                      disabled ? "text-gray-400 line-through" : "text-gray-800"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    {label}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleDisabled(sectionId)}
                    className="rounded p-1 text-gray-500 hover:bg-gray-200"
                    aria-label={
                      disabled
                        ? t.showAria.replace("{label}", label)
                        : t.hideAria.replace("{label}", label)
                    }
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
                    aria-label={t.removeAria.replace("{label}", label)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            {(() => {
              const AddIcon = getSectionIcon(sectionTypeToAdd)
              return (
                <AddIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              )
            })()}
            <select
              value={sectionTypeToAdd}
              onChange={(event) => setSectionTypeToAdd(event.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-2 text-sm text-gray-800 outline-none focus:border-indigo-400"
            >
              {Object.values(registry).map((definition) => (
                <option key={definition.type} value={definition.type}>
                  {definition.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            {t.add}
          </button>
        </div>
      </div>

    </div>
  )
}
