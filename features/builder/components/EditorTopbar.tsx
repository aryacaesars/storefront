"use client"

import Link from "next/link"
import { ArrowLeft, Monitor, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
export type EditorMode = "edit" | "preview"
export type PreviewDevice = "desktop" | "mobile"

interface EditorTopbarProps {
  storeId?: string
  templateName: string
  mode: EditorMode
  device: PreviewDevice
  onModeChange: (mode: EditorMode) => void
  onDeviceChange: (device: PreviewDevice) => void
  onSaveDraft: () => void
  onPublish: () => void
  onResetLayout?: () => void
  isSaving?: boolean
}

export function EditorTopbar({
  storeId,
  templateName,
  mode,
  device,
  onModeChange,
  onDeviceChange,
  onSaveDraft,
  onPublish,
  onResetLayout,
  isSaving = false,
}: EditorTopbarProps) {
  return (
    <header className="h-14 flex items-center shrink-0 bg-white border-b border-gray-200 px-4 gap-4 z-10">
      <div className="flex items-center gap-3 shrink-0 min-w-0">
        <Link
          href={storeId ? `/stores/${storeId}/dashboard` : "/dashboard"}
          className={cn(
            // Samakan dengan <Button size="sm"> (variant default/Publish).
            "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition-colors",
            "h-8 px-3 text-xs bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <div className="w-px h-5 bg-gray-200" />
        <p className="text-sm font-semibold text-gray-900 truncate">{templateName}</p>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {(["edit", "preview"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onModeChange(tab)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                mode === tab
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900",
              )}
            >
              {tab === "edit" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
          <button
            type="button"
            onClick={() => onDeviceChange("desktop")}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
              device === "desktop"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-400 hover:text-gray-700",
            )}
            aria-label="Desktop preview"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange("mobile")}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
              device === "mobile"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-400 hover:text-gray-700",
            )}
            aria-label="Mobile preview"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {mode === "edit" && device === "mobile" && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
            Layer Mobile
          </span>
        )}

        <div className="w-px h-5 bg-gray-200 hidden sm:block" />

        {onResetLayout && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetLayout}
            disabled={isSaving}
          >
            Reset Layout
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={onPublish}
          disabled={isSaving}
        >
          Publish
        </Button>
      </div>
    </header>
  )
}
