import { DEFAULT_BOLD_HOME } from "@/themes/bold/defaults/home"
import { DEFAULT_FASHION_HOME } from "@/themes/fashion/defaults/home"
import { DEFAULT_MINIMALIST_HOME } from "@/themes/minimalist/defaults/home"
import { DEFAULT_MINIMALIST_ABOUT } from "@/themes/minimalist/defaults/about"
import { DEFAULT_BENTO_HOME } from "@/themes/bento/defaults/home"
import { DEFAULT_BENTO_ABOUT } from "@/themes/bento/defaults/about"
import type {
  BlockInstance,
  PageTemplate,
  SectionPageType,
  TemplateId,
  ThemeConfig,
} from "@/themes/engine/schema"

const DEFAULT_PAGE_TEMPLATES: Record<
  TemplateId,
  Partial<Record<SectionPageType, PageTemplate>>
> = {
  minimalist: { home: DEFAULT_MINIMALIST_HOME, about: DEFAULT_MINIMALIST_ABOUT },
  bold: { home: DEFAULT_BOLD_HOME },
  fashion: { home: DEFAULT_FASHION_HOME },
  bento: { home: DEFAULT_BENTO_HOME, about: DEFAULT_BENTO_ABOUT },
}

export function hasDefaultPageTemplate(
  templateId: TemplateId,
  pageType: SectionPageType,
): boolean {
  return Boolean(DEFAULT_PAGE_TEMPLATES[templateId]?.[pageType])
}

export function getDefaultPageTemplate(
  templateId: TemplateId,
  pageType: SectionPageType,
): PageTemplate {
  const template = DEFAULT_PAGE_TEMPLATES[templateId][pageType]
  if (!template) {
    throw new Error(`No default section template for ${templateId}/${pageType}`)
  }
  return template
}

/** Merge stored blocks with theme defaults (settings + missing blocks like CTA image). */
function mergeSectionBlocks(
  stored: BlockInstance[] | undefined,
  defaults: BlockInstance[] | undefined,
): BlockInstance[] | undefined {
  if (!defaults?.length) return stored?.length ? stored : undefined
  if (!stored?.length) return defaults

  const defaultById = new Map(defaults.map((block) => [block.id, block]))
  const defaultByType = new Map(defaults.map((block) => [block.type, block]))

  const merged = stored.map((block, index) => {
    const fallback = defaultById.get(block.id) ?? defaultByType.get(block.type) ?? defaults[index]
    if (!fallback) return block

    return {
      ...fallback,
      ...block,
      settings: {
        ...(fallback.settings ?? {}),
        ...(block.settings ?? {}),
      },
    }
  })

  for (const fallback of defaults) {
    const exists = merged.some(
      (block) => block.id === fallback.id || block.type === fallback.type,
    )
    if (!exists) merged.push(fallback)
  }

  return merged
}

/** Merge stored overrides with theme defaults; configs without `templates` use defaults only. */
export function resolvePageTemplate(
  config: ThemeConfig,
  pageType: SectionPageType,
): PageTemplate {
  const defaults = getDefaultPageTemplate(config.templateId, pageType)
  const stored = config.templates?.[pageType]
  if (!stored) {
    return defaults
  }

  const order = stored.order.length > 0 ? stored.order : defaults.order
  const sections: PageTemplate["sections"] = {}

  for (const id of order) {
    const defaultSection = defaults.sections[id]
    const storedSection = stored.sections[id]
    if (storedSection) {
      sections[id] = {
        type: storedSection.type,
        disabled: storedSection.disabled,
        settings: {
          ...(defaultSection?.settings ?? {}),
          ...(storedSection.settings ?? {}),
        },
        blocks: mergeSectionBlocks(storedSection.blocks, defaultSection?.blocks),
      }
      if (!sections[id].type && defaultSection) {
        sections[id].type = defaultSection.type
      }
    } else if (defaultSection) {
      sections[id] = { ...defaultSection }
    }
  }

  return { order, sections }
}

/** Materialize resolved template into config for persistence (first section edit). */
export function materializePageTemplate(
  config: ThemeConfig,
  pageType: SectionPageType,
): PageTemplate {
  return resolvePageTemplate(config, pageType)
}

export function applyPageTemplate(
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
