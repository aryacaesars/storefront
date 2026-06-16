"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Preview", href: "/customize?mode=preview" },
  { label: "Deploy", href: "/dashboard" },
]

export function TopbarTabs() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1">
      {tabs.map(({ label, href }) => {
        const active = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              active ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
            )}
          >
            {label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
