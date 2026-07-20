"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMessages } from "@/features/i18n/LocaleProvider"

export type NoticeType = "success" | "error" | "info" | "warning"

export type NoticeItem = {
  type: NoticeType
  message: string
  title?: string
  onClose?: () => void
}

type NoticeApi = {
  success: (message: string, title?: string, onClose?: () => void) => void
  error: (message: string, title?: string, onClose?: () => void) => void
  info: (message: string, title?: string, onClose?: () => void) => void
  warning: (message: string, title?: string, onClose?: () => void) => void
}

const NoticeContext = createContext<NoticeApi | null>(null)

const AUTO_DISMISS_MS = 3000

const NOTICE_STYLES: Record<
  NoticeType,
  { icon: typeof CheckCircle2; iconWrap: string; iconClass: string; bar: string }
> = {
  success: {
    icon: CheckCircle2,
    iconWrap: "bg-emerald-100",
    iconClass: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  error: {
    icon: AlertCircle,
    iconWrap: "bg-red-100",
    iconClass: "text-red-600",
    bar: "bg-red-500",
  },
  info: {
    icon: Info,
    iconWrap: "bg-blue-100",
    iconClass: "text-blue-600",
    bar: "bg-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    iconWrap: "bg-amber-100",
    iconClass: "text-amber-600",
    bar: "bg-amber-500",
  },
}

function NoticeModal({
  notice,
  onDismiss,
}: {
  notice: NoticeItem
  onDismiss: () => void
}) {
  const common = useMessages().pages.common
  const defaultTitles: Record<NoticeType, string> = {
    success: common.success,
    error: common.failed,
    info: common.info,
    warning: common.warning,
  }
  const style = NOTICE_STYLES[notice.type]
  const Icon = style.icon
  const onCloseRef = useRef(notice.onClose)
  onCloseRef.current = notice.onClose

  const handleClose = useCallback(() => {
    onCloseRef.current?.()
    onDismiss()
  }, [onDismiss])

  useEffect(() => {
    const timer = setTimeout(handleClose, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [handleClose])

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center p-4"
      aria-live="polite"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={common.close}
        onClick={handleClose}
      />
      <div
        role="status"
        aria-labelledby="notice-title"
        aria-describedby="notice-message"
        className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
        style={{ animation: "notice-modal-in 0.25s ease-out forwards" }}
      >
        <div className="px-6 pb-5 pt-6">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full",
                style.iconWrap,
              )}
            >
              <Icon className={cn("h-7 w-7", style.iconClass)} aria-hidden />
            </div>
            <h2 id="notice-title" className="mt-4 text-lg font-semibold text-ink">
              {notice.title ?? defaultTitles[notice.type]}
            </h2>
            <p id="notice-message" className="mt-2 text-sm leading-relaxed text-gray-600">
              {notice.message}
            </p>
          </div>
        </div>

        <div className="h-1 bg-gray-100">
          <div
            className={cn("h-full origin-left", style.bar)}
            style={{
              animation: `notice-progress ${AUTO_DISMISS_MS}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function DashboardToastProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<NoticeItem | null>(null)

  const dismiss = useCallback(() => setNotice(null), [])

  const api = useMemo<NoticeApi>(
    () => ({
      success: (message, title, onClose) =>
        setNotice({ type: "success", message, title, onClose }),
      error: (message, title, onClose) =>
        setNotice({ type: "error", message, title, onClose }),
      info: (message, title, onClose) =>
        setNotice({ type: "info", message, title, onClose }),
      warning: (message, title, onClose) =>
        setNotice({ type: "warning", message, title, onClose }),
    }),
    [],
  )

  return (
    <NoticeContext.Provider value={api}>
      {children}
      {notice && <NoticeModal notice={notice} onDismiss={dismiss} />}
    </NoticeContext.Provider>
  )
}

export function useDashboardToast(): NoticeApi {
  const ctx = useContext(NoticeContext)
  if (!ctx) {
    throw new Error("useDashboardToast must be used within DashboardToastProvider")
  }
  return ctx
}
