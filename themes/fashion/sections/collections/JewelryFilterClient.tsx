"use client"

import { useState } from "react"
import {
  JEWELRY_MATERIALS,
  JEWELRY_GEMSTONES,
  JEWELRY_PRICE_RANGES,
} from "@/themes/fashion/data/mock"

export function JewelryFilterClient() {
  const [activeMaterials, setActiveMaterials] = useState<string[]>([])
  const [activeGemstones, setActiveGemstones] = useState<string[]>([])
  const [activePrice, setActivePrice] = useState<string>("")

  function toggleMaterial(mat: string) {
    setActiveMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    )
  }

  function toggleGemstone(gem: string) {
    setActiveGemstones((prev) =>
      prev.includes(gem) ? prev.filter((g) => g !== gem) : [...prev, gem]
    )
  }

  return (
    <div className="w-44 flex-shrink-0">
      {/* Material */}
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--theme-muted)]">
        MATERIAL
      </p>
      <ul className="space-y-2.5">
        {JEWELRY_MATERIALS.map((mat) => (
          <li key={mat}>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={activeMaterials.includes(mat)}
                onChange={() => toggleMaterial(mat)}
                className="h-3.5 w-3.5 border border-stone-300 accent-[var(--theme-text)]"
              />
              <span className="text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
                {mat}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <hr className="my-5 border-stone-200" />

      {/* Gemstones */}
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--theme-muted)]">
        GEMSTONES
      </p>
      <ul className="space-y-2.5">
        {JEWELRY_GEMSTONES.map((gem) => (
          <li key={gem}>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={activeGemstones.includes(gem)}
                onChange={() => toggleGemstone(gem)}
                className="h-3.5 w-3.5 border border-stone-300 accent-[var(--theme-text)]"
              />
              <span className="text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
                {gem}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <hr className="my-5 border-stone-200" />

      {/* Price */}
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--theme-muted)]">
        PRICE
      </p>
      <ul className="space-y-2.5">
        {JEWELRY_PRICE_RANGES.map((range) => (
          <li key={range.value}>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="price"
                value={range.value}
                checked={activePrice === range.value}
                onChange={() => setActivePrice(range.value)}
                className="h-3.5 w-3.5 border border-stone-300 accent-[var(--theme-text)]"
              />
              <span className="text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
                {range.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
