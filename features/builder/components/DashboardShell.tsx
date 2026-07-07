import type { ReactNode } from "react"

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
    <div className="p-4 md:p-6 2xl:p-8">
      {showGreeting ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Hi, {displayName ?? "User"}!
            </h1>
            {greetingSubtitle && (
              <p className="mt-1 text-sm text-gray-500">{greetingSubtitle}</p>
            )}
          </div>
          {action}
        </div>
      ) : (
        (pageTitle || pageSubtitle || action) && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              {pageTitle && (
                <h1 className="text-xl font-bold text-gray-800 md:text-2xl">{pageTitle}</h1>
              )}
              {pageSubtitle && (
                <p className="mt-1 text-sm text-gray-500">{pageSubtitle}</p>
              )}
            </div>
            {action}
          </div>
        )
      )}

      {children}
    </div>
  )
}
