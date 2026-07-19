"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { dashboardBtnOutline } from "@/features/builder/components/dashboard-ui"
import { DashboardAlertDialog } from "@/features/builder/components/DashboardAlertDialog"
import type { ActivateForLiveResult } from "@/app/(builder)/(dashboard)/stores/[storeId]/templates/actions"

interface LiveStoreButtonProps {
  isActive: boolean
  storefrontUrl: string
  templateName: string
  activateAction: () => Promise<ActivateForLiveResult>
  className?: string
}

export function LiveStoreButton({
  isActive,
  storefrontUrl,
  templateName,
  activateAction,
  className,
}: LiveStoreButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function goLive(url: string) {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  function handleClick() {
    setError(null)
    if (isActive) {
      goLive(storefrontUrl)
      return
    }
    setOpen(true)
  }

  function handleActivate() {
    setError(null)
    startTransition(async () => {
      const result = await activateAction()
      if (!result.ok) {
        setError(result.error)
        return
      }
      setOpen(false)
      router.refresh()
      goLive(result.url)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(dashboardBtnOutline, "py-2.5", className)}
      >
        live store
      </button>

      <DashboardAlertDialog
        open={open}
        title="Template belum aktif"
        description={
          <>
            <p>
              Template <strong>{templateName}</strong> belum diaktifkan di store kamu.
              Aktifkan dulu supaya live store menampilkan template ini.
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </>
        }
        confirmLabel="Aktifkan"
        cancelLabel="Kembali"
        loading={pending}
        onConfirm={handleActivate}
        onCancel={() => {
          if (pending) return
          setOpen(false)
          setError(null)
        }}
      />
    </>
  )
}
