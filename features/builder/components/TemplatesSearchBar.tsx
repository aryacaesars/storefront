"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { dashboardInput } from "@/features/builder/components/dashboard-ui"
import { cn } from "@/lib/utils"
import { useMessages } from "@/features/i18n/LocaleProvider"

interface TemplatesSearchBarProps {
  defaultValue?: string
  placeholder?: string
}

/** Search bar scoped ke query `?q=` — filter dilakukan di server (owned only). */
export function TemplatesSearchBar({
  defaultValue = "",
  placeholder,
}: TemplatesSearchBarProps) {
  const pages = useMessages().pages
  const common = pages.common
  const resolvedPlaceholder =
    placeholder ?? pages.templatesLibrary.searchPlaceholder
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    const query = value.trim()
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams()
      if (query) params.set("q", query)
      const next = params.toString() ? `${pathname}?${params.toString()}` : pathname
      const current =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : pathname
      if (next !== current) {
        router.replace(next)
      }
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [value, pathname, router])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={resolvedPlaceholder}
        className={cn(dashboardInput, "h-10 pl-10 pr-10")}
        aria-label={common.search}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label={common.clearSearch}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
