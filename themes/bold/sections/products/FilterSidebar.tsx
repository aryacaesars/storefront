"use client"

import { useState } from "react"

const CATEGORIES = ["Running Gear", "High-Intensity", "Recovery Wear", "Tech Accessories"]
const PERF_LEVELS = ["Elite Pro", "Advanced", "Foundation"]
const SIZES = ["S", "M", "L", "XL"]
const COLORS = [
  { id: "teal-dark", hex: "#0D4A3E" },
  { id: "black",     hex: "#000000" },
  { id: "white",     hex: "#FFFFFF" },
  { id: "teal",      hex: "#10D9A0" },
] as const

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-900">
      {children}
    </p>
  )
}

export function FilterSidebar() {
  const [selectedCategories, setSelectedCategories] = useState(["Running Gear"])
  const [performanceLevel, setPerformanceLevel] = useState("")
  const [selectedSizes, setSelectedSizes] = useState(["M"])
  const [selectedColors, setSelectedColors] = useState(["teal-dark"])
  const [priceRange, setPriceRange] = useState(500)

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )

  const toggleColor = (id: string) =>
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )

  return (
    <aside className="w-56 shrink-0 space-y-8">
      {/* CATEGORIES */}
      <div>
        <FilterLabel>Categories</FilterLabel>
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => {
            const checked = selectedCategories.includes(cat)
            return (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-2.5 py-1"
                onClick={() => toggleCategory(cat)}
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
                <span className="text-sm text-zinc-700">{cat}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* PERFORMANCE LEVEL */}
      <div>
        <FilterLabel>Performance Level</FilterLabel>
        <div className="space-y-0.5">
          {PERF_LEVELS.map((level) => {
            const selected = performanceLevel === level
            return (
              <label
                key={level}
                className="flex cursor-pointer items-center gap-2.5 py-1"
                onClick={() => setPerformanceLevel(selected ? "" : level)}
              >
                <div
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                  style={
                    selected
                      ? { borderColor: "var(--theme-primary)" }
                      : { borderColor: "#D1D5DB" }
                  }
                >
                  {selected && (
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "var(--theme-primary)" }}
                    />
                  )}
                </div>
                <span className="text-sm text-zinc-700">{level}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div>
        <FilterLabel>Price Range</FilterLabel>
        <div className="flex justify-between text-xs text-zinc-400">
          <span>$0</span>
          <span>$500+</span>
        </div>
        <input
          type="range"
          min={0}
          max={500}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="mt-2 w-full"
          style={{ accentColor: "var(--theme-primary)" }}
        />
      </div>

      {/* SIZE */}
      <div>
        <FilterLabel>Size</FilterLabel>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => {
            const selected = selectedSizes.includes(size)
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className="flex h-10 w-10 items-center justify-center rounded border text-xs font-bold transition-colors"
                style={
                  selected
                    ? {
                        backgroundColor: "var(--theme-primary)",
                        borderColor: "var(--theme-primary)",
                        color: "white",
                      }
                    : { borderColor: "#E5E7EB", color: "#3F3F46" }
                }
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* COLOR */}
      <div>
        <FilterLabel>Color</FilterLabel>
        <div className="flex gap-2">
          {COLORS.map((color) => {
            const selected = selectedColors.includes(color.id)
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => toggleColor(color.id)}
                className="h-8 w-8 rounded-full transition-all"
                style={{
                  backgroundColor: color.hex,
                  border: color.id === "white" ? "1.5px solid #D1D5DB" : "1.5px solid transparent",
                  outline: selected ? "2px solid var(--theme-primary)" : "none",
                  outlineOffset: "2px",
                }}
                aria-label={color.id}
              />
            )
          })}
        </div>
      </div>
    </aside>
  )
}
