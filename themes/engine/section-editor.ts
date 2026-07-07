import type { HeroConfig, SectionPageType } from "./schema"

export type SectionEditorState = {
  selectedSectionId: string | null
  onSelectSection: (sectionId: string | null) => void
  /** Prefix for DOM ids used to scroll preview into view. */
  previewSectionIdPrefix?: string
  pageType?: SectionPageType
  selectedBlockId?: string | null
  onSelectBlock?: (sectionId: string, blockId: string | null) => void
  onBlockChange?: (
    sectionId: string,
    blockId: string,
    settings: Record<string, unknown>,
  ) => void
  onHeroChange?: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void
}

export function previewSectionDomId(
  editor: SectionEditorState,
  sectionId: string,
): string {
  const prefix = editor.previewSectionIdPrefix ?? "preview-section"
  return `${prefix}-${sectionId}`
}

export type SectionRendererEditorProps = {
  pageType: SectionPageType
  editor: SectionEditorState
}
