"use client"

import { useState } from "react"
import { SlidersHorizontal, ChevronDown } from "lucide-react"

interface FilterBarClientProps {
  totalProducts?: number
}

export function FilterBarClient({ totalProducts = 24 }: FilterBarClientProps) {
  const [sortBy, setSortBy] = useState("featured")

  return (
    <div className="border-y border-stone-200 bg-[var(--theme-bg)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex cursor-pointer items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--theme-muted)]" strokeWidth={1.5} />
            <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--theme-muted)]">
              FILTER
            </span>
          </div>
          <div className="h-4 w-px bg-stone-300" />
          <span className="text-[11px] tracking-wide text-[var(--theme-muted)]">
            SHOWING {totalProducts} PRODUCTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--theme-muted)]">
            SORT BY:
          </span>
          <div className="relative flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent pr-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--theme-text)] outline-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--theme-muted)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
