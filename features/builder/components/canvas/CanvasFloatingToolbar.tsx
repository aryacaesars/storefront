"use client"

import { useState } from "react"
import { Layers, Palette, PaintRoller, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  canvasElementDomKey,
  type SelectedElement,
} from "@/themes/engine/section-editor"

type ToolbarPanel = "edit" | "color" | null

const KIND_LABELS: Record<SelectedElement["kind"], string> = {
  image: "Gambar",
  text: "Teks",
  button: "Tombol",
}

interface CanvasFloatingToolbarProps {
  element: SelectedElement
  onPosition: () => void
  onDeselect: () => void
  /** Panel content for the Edit popover (kind-specific tools). */
  editPanel?: React.ReactNode
  /** Panel content for the Color popover. */
  colorPanel?: React.ReactNode
  /** Copy style — paste happens via Ctrl+Shift+V, never through this button. */
  onCopyStyle?: () => void
}

/**
 * Contextual toolbar — sticky pill pinned to the top-center of the canvas
 * area (not anchored to the selected element). Popovers open downward.
 */
export function CanvasFloatingToolbar({
  element,
  onPosition,
  onDeselect,
  editPanel,
  colorPanel,
  onCopyStyle,
}: CanvasFloatingToolbarProps) {
  const [openPanel, setOpenPanel] = useState<ToolbarPanel>(null)

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
      className="absolute left-1/2 top-3 z-200 -translate-x-1/2"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-0.5 rounded-full border border-gray-100 bg-white px-1.5 py-1 shadow-lg">
        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
          {KIND_LABELS[element.kind]}
        </span>
        <span className={dividerClass} />
        <ToolbarButton
          icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          label="Edit"
          active={openPanel === "edit"}
          disabled={!editPanel}
          onClick={() => setOpenPanel((p) => (p === "edit" ? null : "edit"))}
        />
        <span className={dividerClass} />
        <ToolbarButton
          icon={<Palette className="h-3.5 w-3.5" />}
          label="Color"
          active={openPanel === "color"}
          disabled={!colorPanel}
          onClick={() => setOpenPanel((p) => (p === "color" ? null : "color"))}
        />
        <span className={dividerClass} />
        <ToolbarButton
          icon={<Layers className="h-3.5 w-3.5" />}
          label="Position"
          onClick={() => {
            setOpenPanel(null)
            onPosition()
          }}
        />
        <span className={dividerClass} />
        <ToolbarButton
          icon={<PaintRoller className="h-3.5 w-3.5" />}
          label="Copy style"
          title="Ctrl+Shift+C · paste: Ctrl+Shift+V"
          disabled={!onCopyStyle}
          onClick={() => {
            setOpenPanel(null)
            onCopyStyle?.()
          }}
        />
        <span className={dividerClass} />
        <button
          type="button"
          aria-label="Tutup seleksi"
          onClick={onDeselect}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {openPanel && (
        <div className="absolute left-1/2 top-full z-200 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
          {openPanel === "edit" ? editPanel : colorPanel}
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
  onClick: () => void
}

function ToolbarButton({ icon, label, title, active, disabled, onClick }: ToolbarButtonProps) {
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
      )}
    >
      {icon}
      {label}
    </button>
  )
}
