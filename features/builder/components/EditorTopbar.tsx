"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MoreHorizontal, Monitor, Redo2, Smartphone, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMessages } from "@/features/i18n/LocaleProvider"

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
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
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
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isSaving = false,
}: EditorTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const t = useMessages().pages.builder.topbar

  const historyButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40"

  const historyButtons = onUndo && onRedo && (
    <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 p-0.5">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className={historyButtonClass}
        aria-label={t.undo}
        title={`${t.undo} (Ctrl+Z)`}
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        className={historyButtonClass}
        aria-label={t.redo}
        title={`${t.redo} (Ctrl+Shift+Z)`}
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  )

  return (
    <header
      data-builder-chrome
      className="relative z-40 flex h-14 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 md:gap-4 md:px-4"
    >
      <div className="flex min-w-0 shrink-0 items-center gap-2 md:gap-3">
        <Link
          href={storeId ? `/stores/${storeId}/dashboard` : "/dashboard"}
          className={cn(
            "inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-indigo-600 px-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 md:px-3",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
          )}
          aria-label={t.backToDashboard}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t.dashboard}</span>
        </Link>
        <div className="hidden h-5 w-px bg-gray-200 sm:block" />
        <p className="hidden max-w-[9rem] truncate text-sm font-semibold text-gray-900 sm:block md:max-w-xs">
          {templateName}
        </p>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 md:gap-1 md:p-1">
          {(["edit", "preview"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onModeChange(tab)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition-colors md:px-4 md:text-sm",
                mode === tab
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900",
              )}
            >
              {tab === "edit" ? t.edit : t.preview}
            </button>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {/* Undo/redo — available on all viewports */}
        {historyButtons}

        {/* Device toggle — available on all viewports */}
        <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 p-0.5">
          <button
            type="button"
            onClick={() => onDeviceChange("desktop")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              device === "desktop"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-400 hover:text-gray-700",
            )}
            aria-label={t.desktopPreview}
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange("mobile")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              device === "mobile"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-400 hover:text-gray-700",
            )}
            aria-label={t.mobilePreview}
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {mode === "edit" && device === "mobile" && (
          <span className="hidden items-center rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 sm:inline-flex">
            {t.mobileLayers}
          </span>
        )}

        <div className="hidden h-5 w-px bg-gray-200 md:block" />

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {onResetLayout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetLayout}
              disabled={isSaving}
            >
              {t.resetLayout}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            disabled={isSaving}
          >
            {t.saveDraft}
          </Button>
          <Button size="sm" onClick={onPublish} disabled={isSaving}>
            {t.publish}
          </Button>
        </div>

        {/* Mobile: Publish + overflow for Save/Reset */}
        <div className="relative flex items-center gap-1 md:hidden">
          <Button size="sm" onClick={onPublish} disabled={isSaving} className="h-8 px-3 text-xs">
            {t.publish}
          </Button>
          <button
            type="button"
            aria-label={t.moreMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <button
                type="button"
                aria-label={t.closeMenu}
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    setMenuOpen(false)
                    onSaveDraft()
                  }}
                  className="flex w-full px-3.5 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                >
                  {t.saveDraft}
                </button>
                {onResetLayout && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setMenuOpen(false)
                      onResetLayout()
                    }}
                    className="flex w-full px-3.5 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t.resetLayout}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
