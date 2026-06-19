"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderSearchProps {
  basePath?: string
  cartCount: number
}

function resolveHref(href: string, basePath?: string): string {
  if (!basePath) return href
  if (href === "/") return basePath
  return `${basePath}${href}`
}

export function HeaderSearch({ basePath, cartCount }: HeaderSearchProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (!isOpen) return

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [isOpen])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    const productsHref = resolveHref("/products", basePath)
    router.push(trimmed ? `${productsHref}?q=${encodeURIComponent(trimmed)}` : productsHref)
    setIsOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className="hidden items-center gap-0.5 rounded-full px-2 py-1 transition-[padding] duration-300 ease-out @2xl:flex"
      style={{ backgroundColor: "var(--theme-primary)" }}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "grid transition-[grid-template-columns,opacity,margin] duration-300 ease-out",
          isOpen ? "mr-1 grid-cols-[14rem] opacity-100" : "mr-0 grid-cols-[0rem] opacity-0",
        )}
      >
        <div className="min-w-0 overflow-hidden rounded-full">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
            tabIndex={isOpen ? 0 : -1}
            aria-hidden={!isOpen}
            className={cn(
              "h-8 w-56 rounded-full bg-white px-4 text-sm text-[#1a1c1b] outline-none",
              "placeholder:text-[#515160]/60",
              !isOpen && "pointer-events-none",
            )}
          />
        </div>
      </form>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
        aria-label={isOpen ? "Close search" : "Search"}
        aria-expanded={isOpen}
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>

      <Link
        href={resolveHref("/account", basePath)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
        aria-label="Account"
      >
        <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </Link>

      <Link
        href={resolveHref("/cart", basePath)}
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
        aria-label="Cart"
      >
        <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
        {cartCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[var(--theme-primary)]">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  )
}
