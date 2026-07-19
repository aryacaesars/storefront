import type { HeroConfig, SectionPageType } from "./schema"

export type SelectedElementKind = "image" | "text" | "button" | "frame"

/**
 * Canvas-level element selection (Canva-like). More granular than block
 * selection: a block can host several elements (multi-image items, title
 * lines, CTA label).
 */
export type SelectedElement = {
  kind: SelectedElementKind
  sectionId: string
  blockId: string
  /** Canvas image id, text line id ("title1" | "title2"), or undefined for single-element blocks. */
  itemId?: string
}

/** DOM attribute stamped on the bounding box of a selectable canvas element. */
export const CANVAS_ELEMENT_ATTR = "data-canvas-element"

export function canvasElementDomKey(el: SelectedElement): string {
  return [el.kind, el.sectionId, el.blockId, el.itemId ?? ""].join("|")
}

export function isSameSelectedElement(
  a: SelectedElement | null | undefined,
  b: SelectedElement | null | undefined,
): boolean {
  if (!a || !b) return a === b || (!a && !b)
  return (
    a.kind === b.kind &&
    a.sectionId === b.sectionId &&
    a.blockId === b.blockId &&
    (a.itemId ?? "") === (b.itemId ?? "")
  )
}

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
  /** Patch section.settings (CTA heading/button labels, etc.). */
  onSectionSettingsChange?: (
    sectionId: string,
    patch: Record<string, unknown>,
  ) => void
  /** Canva-like element selection — floating toolbar anchors to this. */
  selectedElement?: SelectedElement | null
  onSelectElement?: (element: SelectedElement | null) => void
  /** Dom key (canvasElementDomKey) of the image currently in crop mode. */
  croppingElementKey?: string | null
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
