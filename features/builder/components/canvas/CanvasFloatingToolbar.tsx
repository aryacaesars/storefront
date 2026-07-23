"use client"

import { useState } from "react"
import { Layers, Palette, PaintRoller, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMessages } from "@/features/i18n/LocaleProvider"
import {
  canvasElementDomKey,
  type SelectedElement,
} from "@/themes/engine/section-editor"

type ToolbarPanel = "edit" | null

interface CanvasFloatingToolbarProps {
  element: SelectedElement
  onPosition: () => void
  onColor: () => void
  onDeselect: () => void
  /** Panel content for the Edit popover (kind-specific tools). */
  editPanel?: React.ReactNode
  /** False when the selected element has no color controls. */
  hasColor?: boolean
  /** Copy style — paste happens via Ctrl+Shift+V, never through this button. */
  onCopyStyle?: () => void
  /**
   * Mobile Canva-style: strip sits above the bottom nav instead of top-center.
   * Pass true when viewport is mobile builder chrome.
   */
  mobile?: boolean
}

/**
 * Contextual toolbar — desktop: sticky pill top-center;
 * mobile: bottom strip above the tool navbar.
 */
export function CanvasFloatingToolbar({
  element,
  onPosition,
  onColor,
  onDeselect,
  editPanel,
  hasColor = false,
  onCopyStyle,
  mobile = false,
}: CanvasFloatingToolbarProps) {
  const [openPanel, setOpenPanel] = useState<ToolbarPanel>(null)
  const t = useMessages().pages.builder.toolbar

  const kindLabels: Record<SelectedElement["kind"], string> = {
    image: t.kindImage,
    text: t.kindText,
    button: t.kindButton,
    frame: t.kindFrame,
  }

  const domKey = canvasElementDomKey(element)

  // Close any open popover when the selection target changes
  // (adjust-state-during-render — no effect needed).
  const [lastDomKey, setLastDomKey] = useState(domKey)
  if (lastDomKey !== domKey) {
    setLastDomKey(domKey)
    setOpenPanel(null)
  }

  const dividerClass = "h-5 w-px shrink-0 bg-gray-200"

  return (
    <div
      // z di atas navbar theme (sticky z-50) supaya klik tidak tembus ke preview.
      data-builder-chrome
      className={cn(
        "z-200",
        mobile
          ? // Fixed to viewport above bottom tool navbar — never scales with canvas zoom
            "fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] border-t border-gray-100 bg-white/95 px-2 py-1.5 backdrop-blur-sm"
          : "absolute left-1/2 top-3 -translate-x-1/2",
      )}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={cn(
          "flex items-center gap-0.5",
          mobile
            ? "mx-auto max-w-lg overflow-x-auto rounded-2xl border border-gray-100 bg-white px-1.5 py-1 shadow-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "rounded-full border border-gray-100 bg-white px-1.5 py-1 shadow-lg",
        )}
      >
        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
          {kindLabels[element.kind]}
        </span>
        <span className={dividerClass} />
        <ToolbarButton
          icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          label={t.edit}
          active={openPanel === "edit"}
          disabled={!editPanel}
          compact={mobile}
          onClick={() => setOpenPanel((p) => (p === "edit" ? null : "edit"))}
        />
        <span className={dividerClass} />
        <ToolbarButton
          icon={<Palette className="h-3.5 w-3.5" />}
          label={t.color}
          disabled={!hasColor}
          compact={mobile}
          onClick={() => {
            setOpenPanel(null)
            onColor()
          }}
        />
        <span className={dividerClass} />
        <ToolbarButton
          icon={<Layers className="h-3.5 w-3.5" />}
          label={t.position}
          compact={mobile}
          onClick={() => {
            setOpenPanel(null)
            onPosition()
          }}
        />
        <span className={dividerClass} />
        <ToolbarButton
          icon={<PaintRoller className="h-3.5 w-3.5" />}
          label={mobile ? t.copy : t.copyStyle}
          title={t.copyShortcutTitle}
          disabled={!onCopyStyle}
          compact={mobile}
          onClick={() => {
            setOpenPanel(null)
            onCopyStyle?.()
          }}
        />
        <span className={dividerClass} />
        <button
          type="button"
          aria-label={t.closeSelection}
          onClick={onDeselect}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {openPanel === "edit" && editPanel && (
        <div
          className={cn(
            "absolute z-200 w-[min(100%-1rem,20rem)] rounded-2xl border border-gray-100 bg-white p-3 shadow-xl",
            mobile
              ? "bottom-full left-1/2 mb-2 -translate-x-1/2"
              : "left-1/2 top-full mt-2 -translate-x-1/2",
          )}
        >
          {editPanel}
        </div>
      )}
    </div>
  )
}

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  title?: string
  active?: boolean
  disabled?: boolean
  compact?: boolean
  onClick: () => void
}

function ToolbarButton({
  icon,
  label,
  title,
  active,
  disabled,
  compact,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-medium transition-colors",
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-700 hover:bg-gray-100",
        disabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
        compact && "px-2",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
