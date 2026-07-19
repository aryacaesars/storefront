"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { withBasePath } from "@/themes/engine/with-base-path"

interface MobileNavProps {
  links: readonly { label: string; href: string }[]
  basePath?: string
}

/** Hamburger menu untuk layar < md. Panel menempel di bawah header sticky. */
export function MobileNav({ links, basePath }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="@3xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
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
        <nav className="absolute inset-x-0 top-full border-b border-black/5 bg-[var(--theme-bg)] shadow-lg">
          <ul className="flex flex-col px-6 py-2">
            {links.map(({ label, href }) => (
              <li key={label} className="border-b border-black/5 last:border-0">
                <Link
                  href={withBasePath(href, basePath)}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-xs font-semibold tracking-[0.12em] text-[var(--theme-muted)] uppercase transition-colors hover:text-[var(--theme-text)]"
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
