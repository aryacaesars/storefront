"use client"

import { cn } from "@/lib/utils"
import {
  BUILDER_TOOLS,
  type BuilderTool,
} from "@/features/builder/components/BuilderToolRail"

interface BuilderMobileNavProps {
  activeTool: BuilderTool
  onToolChange: (tool: BuilderTool) => void
  showSectionsTools: boolean
  showMarketingTool: boolean
}

/** Canva-style bottom tool navbar for mobile builder. */
export function BuilderMobileNav({
  activeTool,
  onToolChange,
  showSectionsTools,
  showMarketingTool,
}: BuilderMobileNavProps) {
  const tools = BUILDER_TOOLS.filter((tool) => {
    if (tool.needsSections && !showSectionsTools) return false
    if (tool.marketingOnly && !showMarketingTool) return false
    return true
  })

  return (
    <nav
      data-builder-chrome
      className="relative z-40 flex shrink-0 items-stretch justify-around border-t border-gray-200 bg-white px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))]"
      aria-label="Builder tools"
    >
      {tools.map((tool) => {
        const Icon = tool.icon
        const isActive = activeTool === tool.id
        return (
          <button
            key={tool.id}
            type="button"
            aria-label={tool.label}
            aria-pressed={isActive}
            onClick={() => onToolChange(tool.id)}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 transition-colors",
              isActive
                ? "text-indigo-600"
                : "text-gray-500 active:bg-gray-50",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                isActive && "bg-indigo-50",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="max-w-full truncate text-[10px] font-medium leading-tight">
              {tool.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
