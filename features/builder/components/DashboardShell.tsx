import type { ReactNode } from "react"
import { DashboardPageTitle } from "./DashboardHeaderContext"
import { dashboardPage } from "./dashboard-ui"

interface DashboardShellProps {
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
    <div className={dashboardPage}>
      {pageTitle && <DashboardPageTitle>{pageTitle}</DashboardPageTitle>}

      {showGreeting ? (
        <header className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-dash-muted">Selamat datang kembali</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-dash-ink md:text-[1.75rem] lg:text-3xl">
              Hai, {displayName ?? "User"}
            </h1>
            {greetingSubtitle && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dash-muted">
                {greetingSubtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      ) : (
        (pageSubtitle || action) && (
          <header className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              {pageSubtitle && (
                <p className="max-w-2xl text-sm leading-relaxed text-dash-muted">
                  {pageSubtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </header>
        )
      )}

      {children}
    </div>
  )
}
