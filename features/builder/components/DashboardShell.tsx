import type { ReactNode } from "react"

interface DashboardShellProps {
  /** Hanya untuk halaman dashboard utama (/dashboard, /stores/{id}/dashboard). */
  showGreeting?: boolean
  displayName?: string
  greetingSubtitle?: string
  pageTitle?: string
  pageSubtitle?: string
  action?: ReactNode
  children: ReactNode
}

export function DashboardShell({
  showGreeting = false,
  displayName,
  greetingSubtitle,
  pageTitle,
  pageSubtitle,
  action,
  children,
}: DashboardShellProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {showGreeting ? (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Hi, <span className="text-brand">{displayName ?? "User"}</span>!
            </h1>
            {greetingSubtitle && (
              <p className="mt-2 text-sm text-gray-500">{greetingSubtitle}</p>
            )}
          </div>
          {action}
        </div>
      ) : (
        (pageTitle || pageSubtitle || action) && (
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              {pageTitle && <h1 className="text-2xl font-bold text-ink">{pageTitle}</h1>}
              {pageSubtitle && <p className="mt-1 text-sm text-gray-400">{pageSubtitle}</p>}
            </div>
            {action}
          </div>
        )
      )}

      {children}
    </div>
  )
}
