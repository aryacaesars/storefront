"use client"

import { ThemeSettingsPanel } from "./ThemeSettingsPanel"
import { ThemeSectionsPanel } from "./ThemeSectionsPanel"
import { BuilderImageToolPanel } from "./BuilderImageToolPanel"
import { BuilderTextToolPanel } from "./BuilderTextToolPanel"
import { BuilderLayersPanel } from "./BuilderLayersPanel"
import { BuilderElementColorPanel } from "./BuilderElementColorPanel"
import type { BuilderTool } from "./BuilderToolRail"
import type { PreviewDevice } from "./EditorTopbar"
import type { SelectedElement } from "@/themes/engine/section-editor"
import type {
  HeroConfig,
  SectionPageType,
  ThemeConfig,
} from "@/themes/engine/schema"

export interface BuilderToolPanelsProps {
  activeTool: BuilderTool
  config: ThemeConfig
  selectedPage: SectionPageType
  device: PreviewDevice
  showSectionsTab: boolean
  isCatalogPage: boolean
  selectedSectionId: string | null
  selectedBlockId: string | null
  selectedElement: SelectedElement | null
  onConfigChange: (next: ThemeConfig) => void
  onSelectSection: (sectionId: string | null) => void
  onSelectBlock: (sectionId: string, blockId: string | null) => void
  onSelectElement: (element: SelectedElement | null) => void
  onPatchBlock: (
    sectionId: string,
    blockId: string,
    patch: Record<string, unknown>,
  ) => void
  onUpdateBlockSetting: (
    sectionId: string,
    blockId: string,
    key: string,
    value: string | number | undefined,
  ) => void
  onUpdateSectionSetting: (
    sectionId: string,
    key: string,
    value: string | undefined,
  ) => void
  onReorderBlocks: (
    sectionId: string,
    fromIndex: number,
    toIndex: number,
  ) => void
  onAddBlock?: (sectionId: string, blockType: string) => void
  onRemoveBlock?: (sectionId: string, blockId: string) => void
  onConfigKeyChange: <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K],
  ) => void
  onHeroChange: <K extends keyof HeroConfig>(
    key: K,
    value: HeroConfig[K],
  ) => void
  onCloseColor?: () => void
}

/** Shared tool panel content for desktop aside + mobile bottom sheet. */
export function BuilderToolPanels({
  activeTool,
  config,
  selectedPage,
  device,
  showSectionsTab,
  isCatalogPage,
  selectedSectionId,
  selectedBlockId,
  selectedElement,
  onConfigChange,
  onSelectSection,
  onSelectBlock,
  onSelectElement,
  onPatchBlock,
  onUpdateBlockSetting,
  onUpdateSectionSetting,
  onReorderBlocks,
  onAddBlock,
  onRemoveBlock,
  onConfigKeyChange,
  onHeroChange,
  onCloseColor,
}: BuilderToolPanelsProps) {
  if (activeTool === "sections" && showSectionsTab) {
    return (
      <ThemeSectionsPanel
        config={config}
        selectedPage={selectedPage}
        onConfigChange={onConfigChange}
        selectedSectionId={selectedSectionId}
        onSelectSection={onSelectSection}
      />
    )
  }

  if (activeTool === "image" && showSectionsTab) {
    return (
      <BuilderImageToolPanel
        config={config}
        selectedPage={selectedPage}
        selectedSectionId={selectedSectionId}
        selectedElement={selectedElement}
        device={device}
        onSelectBlock={onSelectBlock}
        onSelectElement={onSelectElement}
        onPatchBlock={onPatchBlock}
        onUpdateBlockSetting={onUpdateBlockSetting}
        onUpdateSectionSetting={onUpdateSectionSetting}
      />
    )
  }

  if (activeTool === "text" && showSectionsTab) {
    return (
      <BuilderTextToolPanel
        config={config}
        selectedPage={selectedPage}
        selectedSectionId={selectedSectionId}
        selectedElement={selectedElement}
        device={device}
        onSelectBlock={onSelectBlock}
        onSelectElement={onSelectElement}
        onPatchBlock={onPatchBlock}
        onUpdateSectionSetting={onUpdateSectionSetting}
      />
    )
  }

  if (activeTool === "layers" && showSectionsTab) {
    return (
      <BuilderLayersPanel
        config={config}
        selectedPage={selectedPage}
        selectedSectionId={selectedSectionId}
        selectedBlockId={selectedBlockId}
        selectedElement={selectedElement}
        device={device}
        onSelectBlock={onSelectBlock}
        onSelectElement={onSelectElement}
        onPatchBlock={onPatchBlock}
        onReorderBlocks={onReorderBlocks}
        onAddBlock={onAddBlock}
        onRemoveBlock={onRemoveBlock}
      />
    )
  }

  if (activeTool === "color" && showSectionsTab) {
    return (
      <BuilderElementColorPanel
        config={config}
        selectedPage={selectedPage}
        device={device}
        element={selectedElement}
        onPatchBlock={onPatchBlock}
        onClose={onCloseColor}
      />
    )
  }

  if (activeTool === "page") {
    return (
      <div className="flex flex-col gap-4 p-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Page Content</h2>
          <p className="mt-1 text-xs text-gray-400">
            Edit text, images, and cards for this page.
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
          <p className="text-xs font-medium text-gray-500">
            Page content editor coming soon.
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Text, images, and cards will be editable from here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isCatalogPage && (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-xs font-medium text-amber-800">
            Catalog-controlled page
          </p>
          <p className="mt-0.5 text-[11px] text-amber-700">
            Product data, prices, and inventory are pulled from the store catalog — not
            edited in the builder.
          </p>
        </div>
      )}
      <ThemeSettingsPanel
        config={config}
        onConfigChange={onConfigKeyChange}
        onHeroChange={onHeroChange}
      />
    </>
  )
}
