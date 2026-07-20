"use client"

import { useEffect, useRef } from "react"
import {
  useDashboardToast,
  type NoticeType,
} from "@/features/builder/components/DashboardToast"

export type DashboardNotice = {
  type: NoticeType
  message: string
  title?: string
  onClose?: () => void
}

type ActionNoticeState =
  | { error: string }
  | { success: true }
  | undefined
  | null

/** Tampilkan modal dari hasil server action (error / success). */
export function useDashboardActionNotice(
  state: ActionNoticeState,
  options?: {
    successMessage?: string
    errorMessage?: string
    initialNotice?: DashboardNotice
  },
) {
  const toast = useDashboardToast()
  const toastRef = useRef(toast)
  toastRef.current = toast
  const lastHandled = useRef<ActionNoticeState>(undefined)
  const initialShown = useRef(false)

  useEffect(() => {
    const initial = options?.initialNotice
    if (!initial || initialShown.current) return
    initialShown.current = true
    toastRef.current[initial.type](initial.message, initial.title, initial.onClose)
  }, [options?.initialNotice])

  useEffect(() => {
    if (!state || state === lastHandled.current) return
    lastHandled.current = state
    if ("error" in state) {
      toast.error(options?.errorMessage ?? state.error)
    }
    if ("success" in state) {
      toast.success(options?.successMessage ?? "Saved successfully.")
    }
  }, [state, options?.successMessage, options?.errorMessage, toast])
}

/** Modal sekali saat mount — untuk query param / redirect setelah aksi. */
export function DashboardInitialNotice({ notice }: { notice?: DashboardNotice | null }) {
  useDashboardActionNotice(null, { initialNotice: notice ?? undefined })
  return null
}
