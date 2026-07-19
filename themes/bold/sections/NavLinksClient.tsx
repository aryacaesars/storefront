"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useDeviceIsMobile } from "@/themes/engine/device-context"

export interface ResolvedNavLink {
  label: string
  resolvedHref: string
  key: string
  sectionId?: string
}

interface NavLinksClientProps {
  links: ResolvedNavLink[]
  defaultActiveKey?: string
}

export function NavLinksClient({ links, defaultActiveKey }: NavLinksClientProps) {
  const isMobile = useDeviceIsMobile()
  const [activeKey, setActiveKey] = useState(defaultActiveKey ?? "")

  useEffect(() => {
    const sectionLinks = links.filter((l) => l.sectionId)
    if (!sectionLinks.length) return

    const handleScroll = () => {
      const scrollY = window.scrollY + 120

      let current = defaultActiveKey ?? sectionLinks[0]?.key ?? ""
      for (const { key, sectionId } of sectionLinks) {
        const el = document.getElementById(sectionId!)
        if (!el) continue
        if (el.offsetTop <= scrollY) current = key
      }

      setActiveKey(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [links, defaultActiveKey])

  if (isMobile) return null

  return (
    <nav className="flex items-center gap-7">
      {links.map(({ label, resolvedHref, key }) => {
        const isActive = activeKey === key

        return (
          <Link
            key={key}
            href={resolvedHref}
            className={`relative pb-0.5 text-[10px] uppercase tracking-[0.15em] transition-colors ${
              isActive
                ? "text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
