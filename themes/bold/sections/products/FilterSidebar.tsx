"use client"

import { useState, useEffect } from "react"
// TODO Sprint 2: reconnect to Prisma data source — StorefrontCategory from Scalev removed
// import type { StorefrontCategory } from "@/lib/scalev/schemas-storefront"
import type { StorefrontCategory } from "@/features/storefront/catalog"

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-900">
      {children}
    </p>
  )
}

export function FilterSidebar() {
  const [categories, setCategories] = useState<StorefrontCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/storefront/categories")
      .then((r) => r.json())
      .then((json) => setCategories(json.data ?? []))
      .catch(() => {})
  }, [])

  const toggleCategory = (key: string) =>
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    )

  if (categories.length === 0) return null

  return (
    <aside className="w-56 shrink-0">
      <FilterLabel>Categories</FilterLabel>
      <div className="space-y-0.5">
        {categories.map((cat) => {
          const key = String(cat.id)
          const checked = selectedCategories.includes(key)
          return (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2.5 py-1"
              onClick={() => toggleCategory(key)}
            >
              <div
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border"
                style={
                  checked
                    ? { backgroundColor: "var(--theme-primary)", borderColor: "var(--theme-primary)" }
                    : { borderColor: "#D1D5DB" }
                }
              >
                {checked && (
                  <svg viewBox="0 0 10 8" className="h-2 w-2.5" fill="none">
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-zinc-700">{cat.name}</span>
            </label>
          )
        })}
      </div>
    </aside>
  )
}
