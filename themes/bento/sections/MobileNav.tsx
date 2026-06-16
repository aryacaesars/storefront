"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface MobileNavProps {
  links: readonly { label: string; href: string }[]
  basePath?: string
}

function resolveHref(href: string, basePath?: string): string {
  if (!basePath) return href
  if (href === "/") return basePath
  return `${basePath}${href}`
}

export function MobileNav({ links, basePath }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="@3xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#515160] transition-colors hover:text-[var(--theme-primary)]"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        )}
      </button>

      {open && (
        <nav className="absolute inset-x-4 top-full z-50 mt-2 rounded-2xl bg-white p-2 shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
          <ul className="flex flex-col">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={resolveHref(href, basePath)}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-[#515160] transition-colors hover:text-[var(--theme-primary)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
