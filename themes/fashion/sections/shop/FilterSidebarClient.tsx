"use client"

import { useState } from "react"
import {
  FILTER_CATEGORIES,
  FILTER_MATERIALS,
  FILTER_COLORS,
} from "@/themes/fashion/data/mock"

export function FilterSidebarClient() {
  const [activeCategory, setActiveCategory] = useState<string>("Accessories")
  const [activeMaterials, setActiveMaterials] = useState<string[]>(["Cashmere"])
  const [activeColor, setActiveColor] = useState<string>("#1C1C1A")

  function toggleMaterial(mat: string) {
    setActiveMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    )
  }

  return (
    <div className="w-52 flex-shrink-0">
      {/* Categories */}
      <p className="mb-4 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--theme-muted)]">
        CATEGORIES
      </p>
      <ul className="space-y-3">
        {FILTER_CATEGORIES.map((cat) => (
          <li key={cat.label}>
            <button
              type="button"
              onClick={() => setActiveCategory(cat.label)}
              className="flex w-full items-center justify-between text-sm"
            >
              <span
                className={
                  activeCategory === cat.label
                    ? "font-medium text-[var(--theme-text)]"
                    : "font-normal text-[var(--theme-muted)]"
                }
              >
                {cat.label}
              </span>
              <span className="text-xs text-[var(--theme-muted)]">({cat.count})</span>
            </button>
          </li>
        ))}
      </ul>

      <hr className="my-6 border-stone-200" />

      {/* Price */}
      <p className="mb-4 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--theme-muted)]">
        PRICE
      </p>
      <div className="relative mt-6 mb-3 h-0.5 rounded-full bg-stone-200">
        <div className="absolute inset-0 rounded-full bg-[var(--theme-text)]" />
      </div>
      <div className="flex justify-between text-xs text-[var(--theme-muted)]">
        <span>$0</span>
        <span>$1,000+</span>
      </div>

      <hr className="my-6 border-stone-200" />

      {/* Material */}
      <p className="mb-4 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--theme-muted)]">
        MATERIAL
      </p>
      <div className="flex flex-wrap gap-2">
        {FILTER_MATERIALS.map((mat) => (
          <button
            key={mat}
            type="button"
            onClick={() => toggleMaterial(mat)}
            className={
              activeMaterials.includes(mat)
                ? "rounded-sm bg-[var(--theme-text)] px-3 py-1 text-xs text-white"
                : "rounded-sm border border-stone-300 px-3 py-1 text-xs text-[var(--theme-muted)] hover:border-[var(--theme-text)]"
            }
          >
            {mat}
          </button>
        ))}
      </div>

      <hr className="my-6 border-stone-200" />

      {/* Color */}
      <p className="mb-4 text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--theme-muted)]">
        COLOR
      </p>
      <div className="flex gap-2.5">
        {FILTER_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            aria-label={color.label}
            onClick={() => setActiveColor(color.value)}
            className={`h-6 w-6 rounded-full border-2 transition-all ${
              activeColor === color.value
                ? "border-[var(--theme-text)]"
                : "border-transparent hover:border-stone-400"
            }`}
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>
    </div>
  )
}
