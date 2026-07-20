"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export type LandingNavLink = {
  label: string
  href: string
}

function parseHash(href: string): string | null {
  const hashIndex = href.indexOf("#")
  if (hashIndex < 0) return null
  const hash = href.slice(hashIndex + 1)
  return hash || null
}

function smoothScrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: "smooth", block: "start" })
  return true
}

export function LandingNavLinks({ links }: { links: LandingNavLink[] }) {
  const pathname = usePathname()

  // Setelah navigasi ke /#faq dari halaman lain, scroll halus ke target.
  useEffect(() => {
    if (pathname !== "/") return
    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) return

    const frame = window.requestAnimationFrame(() => {
      smoothScrollToId(hash)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pathname])

  return (
    <ul className="hidden items-center gap-9 text-sm font-medium text-slate-600 md:flex">
      {links.map((link) => {
        const hash = parseHash(link.href)
        const isHomeHash = hash === "home"
        const isLandingHash =
          hash !== null && (link.href.startsWith("/#") || link.href.startsWith("#"))

        return (
          <li key={link.label}>
            <Link
              href={link.href}
              className="transition-colors hover:text-ink"
              onClick={(event) => {
                if (!isLandingHash || !hash) return
                // Sudah di landing → smooth scroll, jangan reload.
                if (pathname === "/") {
                  event.preventDefault()
                  if (isHomeHash) {
                    window.scrollTo({ top: 0, behavior: "smooth" })
                    window.history.pushState(null, "", "/#home")
                    return
                  }
                  if (smoothScrollToId(hash)) {
                    window.history.pushState(null, "", `/#${hash}`)
                  }
                }
              }}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
