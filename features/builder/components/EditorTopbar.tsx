"use client"

import Link from "next/link"
import { ArrowLeft, Monitor, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type EditorMode = "edit" | "preview"
export type PreviewDevice = "desktop" | "mobile"

interface EditorTopbarProps {
  templateName: string
  mode: EditorMode
  device: PreviewDevice
  onModeChange: (mode: EditorMode) => void
  onDeviceChange: (device: PreviewDevice) => void
  onSaveDraft: () => void
  onPublish: () => void
  isSaving?: boolean
}

export function EditorTopbar({
  templateName,
  mode,
  device,
  onModeChange,
  onDeviceChange,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: EditorTopbarProps) {
  return (
    <header className="h-14 flex items-center shrink-0 bg-white border-b border-gray-200 px-4 gap-4 z-10">
      <div className="flex items-center gap-3 shrink-0 min-w-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
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

        <div className="w-px h-5 bg-gray-200 hidden sm:block" />

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
