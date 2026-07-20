"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, LogOut, User, User2 } from "lucide-react"
import { logoutAction } from "@/features/auth/actions"
import { cn } from "@/lib/utils"

type Props = {
  displayName?: string
  subtitle?: string
  showProfile?: boolean
  variant?: "sidebar" | "header"
}

export function SidebarAccountMenu({
  displayName = "Account",
  subtitle = "Pro Merchant",
  showProfile = true,
  variant = "sidebar",
}: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isHeader = variant === "header"

  useEffect(() => {
    if (!open) return

    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={isHeader ? `Account ${displayName}` : undefined}
        className={cn(
          "flex items-center text-left transition-colors",
          isHeader
            ? cn(
                "rounded-full border border-dash-border/70 bg-dash-surface text-dash-muted hover:border-dash-border hover:text-dash-ink",
                // Mobile: icon only; sm+: pill with name
                "inline-flex h-9 w-9 shrink-0 items-center justify-center",
                "sm:h-auto sm:w-full sm:justify-start sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-2.5 sm:text-inherit",
              )
            : cn(
                "w-full gap-2.5 rounded-lg px-3 py-2.5",
                open ? "bg-dash-primary/8 ring-1 ring-dash-primary/15" : "hover:bg-dash-bg",
              ),
        )}
      >
        {isHeader ? (
          <>
            <User2 className="h-4 w-4 sm:hidden" strokeWidth={1.75} />
            <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dash-primary/10 sm:flex">
              <User2 className="h-3.5 w-3.5 text-dash-primary" />
            </span>
            <span className="hidden min-w-0 flex-1 sm:block">
              <span className="block truncate text-[13px] font-semibold leading-tight text-dash-ink">
                {displayName}
              </span>
              <span className="block truncate text-[10px] leading-tight text-dash-muted">{subtitle}</span>
            </span>
            <ChevronDown
              className={cn(
                "hidden h-3.5 w-3.5 shrink-0 text-dash-muted transition-transform duration-200 sm:block",
                open && "rotate-180 text-dash-primary",
              )}
            />
          </>
        ) : (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dash-primary/10">
              <User2 className="h-4 w-4 text-dash-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold leading-tight text-dash-ink">
                {displayName}
              </span>
              <span className="block text-[10px] leading-tight text-dash-muted">{subtitle}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                open && "rotate-180 text-dash-primary",
              )}
            />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute overflow-hidden rounded-xl border border-dash-border bg-dash-surface shadow-lg ring-1 ring-dash-ink/5 z-50",
            isHeader ? "right-0 top-full mt-2 w-48" : "bottom-full left-0 right-0 mb-2",
          )}
        >
          {showProfile && (
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-dash-ink transition-colors duration-200 hover:bg-dash-bg"
            >
              <User className="h-4 w-4 shrink-0 text-gray-400" />
              Profile
            </Link>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 border-t border-dash-border px-3 py-2.5 text-left text-sm font-medium text-dash-danger transition-colors duration-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
