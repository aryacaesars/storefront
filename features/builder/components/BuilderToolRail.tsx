"use client"

import {
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Paintbrush,
  Palette,
  Type,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SelectedElementKind } from "@/themes/engine/section-editor"

export type BuilderTool =
  | "sections"
  | "image"
  | "text"
  | "layers"
  | "color"
  | "theme"
  | "page"

export type BuilderToolDef = {
  id: BuilderTool
  label: string
  icon: typeof ImageIcon
  /** Only show when page supports section editing */
  needsSections?: boolean
  /** Only show for marketing placeholder pages */
  marketingOnly?: boolean
}

export const BUILDER_TOOLS: BuilderToolDef[] = [
  { id: "sections", label: "Sections", icon: LayoutTemplate, needsSections: true },
  { id: "image", label: "Image", icon: ImageIcon, needsSections: true },
  { id: "text", label: "Text", icon: Type, needsSections: true },
  { id: "layers", label: "Layer", icon: Layers, needsSections: true },
  { id: "color", label: "Warna", icon: Palette, needsSections: true },
  { id: "theme", label: "Theme", icon: Paintbrush },
  { id: "page", label: "Konten", icon: FileText, marketingOnly: true },
]

interface BuilderToolRailProps {
  activeTool: BuilderTool
  onToolChange: (tool: BuilderTool) => void
  showSectionsTools: boolean
  showMarketingTool: boolean
}

export function BuilderToolRail({
  activeTool,
  onToolChange,
  showSectionsTools,
  showMarketingTool,
}: BuilderToolRailProps) {
  const tools = BUILDER_TOOLS.filter((tool) => {
    if (tool.needsSections && !showSectionsTools) return false
    if (tool.marketingOnly && !showMarketingTool) return false
    return true
  })

  return (
    <nav
      className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-gray-200 bg-gray-50 py-3"
      aria-label="Builder tools"
    >
      {tools.map((tool) => {
        const Icon = tool.icon
        const isActive = activeTool === tool.id
        return (
          <button
            key={tool.id}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={isActive}
            onClick={() => onToolChange(tool.id)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              isActive
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                : "text-gray-500 hover:bg-white hover:text-gray-900",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        )
      })}
    </nav>
  )
}

/** Sidebar / mobile sheet tool that matches a selected canvas element. */
export function builderToolForSelectedElement(kind: SelectedElementKind): BuilderTool {
  switch (kind) {
    case "text":
      return "text"
    case "image":
      return "image"
    case "button":
      return "layers"
    case "frame":
      return "color"
  }
}
