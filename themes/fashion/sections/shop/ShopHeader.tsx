"use client"

import { ChevronRight, ChevronDown } from "lucide-react"

export function ShopHeader() {
  return (
    <div className="border-b border-stone-200 bg-[var(--theme-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-5 flex items-center gap-1.5 text-xs text-[var(--theme-muted)]">
          <span>Home</span>
          <ChevronRight className="h-3 w-3" />
          <span>Shop All</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-4xl font-medium text-[var(--theme-text)]"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              The Collection
            </h1>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">
              Curated essentials for the modern lifestyle.
            </p>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-[10px] tracking-[0.15em] uppercase text-[var(--theme-muted)]">
              SORT BY
            </span>
            <div className="relative">
              <select
                className="h-9 cursor-pointer appearance-none border-b border-stone-300 bg-transparent pl-2 pr-8 text-sm text-[var(--theme-text)] focus:border-[var(--theme-text)] focus:outline-none"
                defaultValue="featured"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-muted)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
