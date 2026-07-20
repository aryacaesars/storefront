"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { dashboardBtnPrimary } from "@/features/builder/components/dashboard-ui"
import { useMessages } from "@/features/i18n/LocaleProvider"

interface DashboardAlertDialogProps {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DashboardAlertDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: DashboardAlertDialogProps) {
  const common = useMessages().pages.common
  const resolvedConfirm = confirmLabel ?? common.yesContinue
  const resolvedCancel = cancelLabel ?? common.cancel
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={common.close}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-desc"
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl ring-1 ring-black/5"
      >
        <div className="flex gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              variant === "danger" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600",
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="alert-dialog-title" className="text-base font-semibold text-ink">
              {title}
            </h2>
            <div id="alert-dialog-desc" className="mt-2 text-sm text-gray-600">
              {description}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {resolvedCancel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(
              dashboardBtnPrimary,
              "disabled:opacity-50",
              variant === "danger" && "bg-red-600 hover:bg-red-700",
            )}
          >
            {loading ? common.processing : resolvedConfirm}
          </button>
        </div>
      </div>
    </div>
  )
}
