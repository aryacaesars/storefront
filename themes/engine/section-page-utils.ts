import type { BlockInstance, PageTemplate, SectionInstance } from "@/themes/engine/schema"

export function createSectionId(
  type: string,
  existingIds: string[],
): string {
  if (!existingIds.includes(type)) {
    return type
  }

  let index = 2
  while (existingIds.includes(`${type}-${index}`)) {
    index += 1
  }
  return `${type}-${index}`
}

export function reorderSections(
  order: string[],
  fromIndex: number,
  toIndex: number,
): string[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= order.length ||
    toIndex >= order.length
  ) {
    return order
  }

  const next = [...order]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function addSectionToTemplate(
  template: PageTemplate,
  type: string,
): PageTemplate {
  const sectionId = createSectionId(type, template.order)
  const instance: SectionInstance = { type }

  return {
    order: [...template.order, sectionId],
    sections: {
      ...template.sections,
      [sectionId]: instance,
    },
  }
}

export function removeSectionFromTemplate(
  template: PageTemplate,
  sectionId: string,
): PageTemplate {
  const { [sectionId]: _removed, ...sections } = template.sections
  return {
    order: template.order.filter((id) => id !== sectionId),
    sections,
  }
}

export function updateSectionSettings(
  template: PageTemplate,
  sectionId: string,
  settings: Record<string, unknown>,
): PageTemplate {
  const section = template.sections[sectionId]
  if (!section) {
    return template
  }

  return {
    ...template,
    sections: {
      ...template.sections,
      [sectionId]: {
        ...section,
        settings,
      },
    },
  }
}

export function updateSectionBlocks(
  template: PageTemplate,
  sectionId: string,
  blocks: BlockInstance[] | undefined,
): PageTemplate {
  const section = template.sections[sectionId]
  if (!section) {
    return template
  }

  return {
    ...template,
    sections: {
      ...template.sections,
      [sectionId]: {
        ...section,
        blocks,
      },
    },
  }
}
