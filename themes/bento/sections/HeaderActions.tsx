"use client"

import { useState } from "react"
import Link from "next/link"
import { User, ShoppingBag, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { withBasePath } from "@/themes/engine/with-base-path"

interface HeaderActionsProps {
  basePath?: string
  cartCount: number
  links?: readonly { label: string; href: string }[]
  /** Nama customer yang sedang login — tampil di sebelah ikon profile. */
  customerName?: string | null
}

const iconBtnClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"

const panelMotion = {
  initial: { opacity: 0, y: -8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
}

const itemMotion = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
}

export function HeaderActions({
  basePath,
  cartCount,
  links = [],
  customerName,
}: HeaderActionsProps) {
  const isPreview = Boolean(basePath)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div
        className="flex items-center gap-0.5 rounded-full px-2 py-1"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        {!isPreview && (
          <Link
            href="/account"
            className={
              customerName
                ? "flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2 text-white transition-opacity hover:opacity-80"
                : iconBtnClass
            }
            aria-label="Account"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {customerName && (
              <span className="hidden max-w-[120px] truncate text-xs font-semibold sm:inline">
                {customerName.trim().split(/\s+/)[0]}
              </span>
            )}
          </Link>
        )}

        <Link
          href={withBasePath("/cart", basePath)}
          className={`relative ${iconBtnClass}`}
          aria-label="Cart"
        >
          <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[var(--theme-primary)]">
              {cartCount}
            </span>
          )}
        </Link>

        {links.length > 0 && (
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`${iconBtnClass} relative @3xl:hidden`}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: menuOpen ? -90 : 90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: menuOpen ? 90 : -90, scale: 0.6 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center"
              >
                {menuOpen ? (
                  <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
                ) : (
                  <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        )}
      </div>

      <AnimatePresence>
        {menuOpen && links.length > 0 && (
          <motion.nav
            key="mobile-nav"
            {...panelMotion}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-4 top-full z-50 mt-2 origin-top rounded-2xl bg-white p-2 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] @3xl:hidden"
          >
            <ul className="flex flex-col">
              {links.map(({ label, href }, index) => (
                <motion.li
                  key={href}
                  {...itemMotion}
                  transition={{
                    duration: 0.2,
                    delay: 0.04 + index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={withBasePath(href, basePath)}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-[#515160] transition-colors hover:text-[var(--theme-primary)]"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
