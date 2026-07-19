"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import type { ResolvedNavLink } from "@/themes/bold/sections/NavLinksClient"

interface MobileNavProps {
  links: ResolvedNavLink[]
}

const panelMotion = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.99 },
}

const itemMotion = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
}

const ease = [0.22, 1, 0.36, 1] as const

/** Hamburger menu — visible when device layer is mobile (viewport or forcedDevice). */
export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center text-white/80 transition-colors hover:text-white"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: open ? -90 : 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: open ? 90 : -90, scale: 0.6 }}
            transition={{ duration: 0.18, ease }}
            className="flex items-center justify-center"
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            {...panelMotion}
            transition={{ duration: 0.22, ease }}
            className="absolute inset-x-0 top-full z-50 origin-top border-b border-white/10 bg-[#090909] shadow-lg"
          >
            <ul className="flex flex-col px-6 py-2">
              {links.map(({ label, resolvedHref, key }, index) => (
                <motion.li
                  key={key}
                  {...itemMotion}
                  transition={{
                    duration: 0.2,
                    delay: 0.04 + index * 0.04,
                    ease,
                  }}
                  className="border-b border-white/10 last:border-0"
                >
                  <Link
                    href={resolvedHref}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
