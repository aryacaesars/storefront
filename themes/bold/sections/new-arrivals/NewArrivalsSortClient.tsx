"use client"

import { useMemo, useState } from "react"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { NewArrivalCard } from "@/themes/bold/sections/new-arrivals/NewArrivalCard"

type SortKey = "newest" | "price-asc" | "price-desc" | "name-az"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "NEWEST FIRST" },
  { value: "price-asc", label: "PRICE: LOW TO HIGH" },
  { value: "price-desc", label: "PRICE: HIGH TO LOW" },
  { value: "name-az", label: "NAME: A–Z" },
]

function sortProducts(products: CatalogProduct[], key: SortKey): CatalogProduct[] {
  const arr = [...products]
  switch (key) {
    case "price-asc":
      return arr.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
    case "price-desc":
      return arr.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
    case "name-az":
      return arr.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return arr
  }
}

interface NewArrivalsSortClientProps {
  products: CatalogProduct[]
}

export function NewArrivalsSortClient({ products }: NewArrivalsSortClientProps) {
  const [sort, setSort] = useState<SortKey>("newest")
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort])

  return (
    <>
      {/* Sort bar */}
      <div className="sticky top-14 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
            {sorted.length} Products
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="cursor-pointer border-none bg-transparent text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 outline-none hover:text-zinc-900"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((product) => (
            <NewArrivalCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  )
}
