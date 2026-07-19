"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState, useTransition } from "react"
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { StorefrontCategory } from "@/features/storefront/catalog-types"
import type { CatalogListFilters, CatalogSort } from "@/features/storefront/catalog-types"

type ProductCatalogFiltersProps = {
  categories: StorefrontCategory[]
  priceBounds?: { min: number; max: number } | null
  active: CatalogListFilters
  resultCount: number
  /** Visual variant for theme chrome */
  variant?: "bento" | "minimalist" | "bold" | "fashion"
}

type SelectOption = { value: string; label: string }

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "name", label: "Nama A–Z" },
  { value: "popular", label: "Terlaris" },
]

function buildQuery(next: CatalogListFilters): string {
  const params = new URLSearchParams()
  if (next.q) params.set("q", next.q)
  if (next.category) params.set("category", next.category)
  if (next.sort && next.sort !== "name") params.set("sort", next.sort)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

function cyclePriceSort(current?: CatalogSort): CatalogSort | undefined {
  if (current === "price-desc") return "price-asc"
  if (current === "price-asc") return undefined
  return "price-desc"
}

function ThemeSelect({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 max-w-[11rem] items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-left text-sm text-[#1a1c1b] outline-none transition-colors",
          "hover:border-[var(--theme-primary)]/40 focus-visible:border-[var(--theme-primary)]",
          open && "border-[var(--theme-primary)]",
        )}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[#515160] transition-transform",
            open && "rotate-180",
          )}
          strokeWidth={2}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+6px)] z-40 min-w-full overflow-hidden rounded-2xl border border-black/8 bg-white py-1.5 shadow-[0px_8px_24px_rgba(0,0,0,0.12)]"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-[var(--theme-primary)]/10 font-medium text-[var(--theme-primary)]"
                      : "text-[#1a1c1b] hover:bg-black/[0.04]",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                  {isSelected && (
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-[var(--theme-primary)]"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function ProductCatalogFilters({
  categories,
  active,
  resultCount,
  variant = "bento",
}: ProductCatalogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [q, setQ] = useState(active.q ?? "")

  useEffect(() => {
    setQ(active.q ?? "")
  }, [active.q])

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [])

  function pushFilters(next: CatalogListFilters) {
    startTransition(() => {
      router.push(`${pathname}${buildQuery(next)}`)
    })
  }

  function syncSearch(value: string) {
    const trimmed = value.trim()
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)

    if (!trimmed) {
      if (active.q) {
        pushFilters({ ...active, q: undefined })
      }
      return
    }

    searchDebounceRef.current = setTimeout(() => {
      if (trimmed !== (active.q ?? "")) {
        pushFilters({ ...active, q: trimmed })
      }
    }, 350)
  }

  function handleSearchChange(value: string) {
    setQ(value)
    syncSearch(value)
  }

  function togglePriceSort() {
    const next = cyclePriceSort(active.sort)
    pushFilters({
      ...active,
      minPrice: undefined,
      maxPrice: undefined,
      sort: next,
    })
  }

  function clearAll() {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    setQ("")
    pushFilters({})
  }

  const priceActive =
    active.sort === "price-desc" || active.sort === "price-asc"

  const hasActive =
    Boolean(active.q) ||
    Boolean(active.category) ||
    priceActive ||
    active.sort === "popular"

  const shell =
    variant === "bento"
      ? "rounded-2xl bg-white px-3 py-2.5 shadow-[0px_0px_12px_rgba(0,0,0,0.08)]"
      : variant === "minimalist"
        ? "rounded-xl border border-black/5 bg-white/80 px-3 py-2.5"
        : variant === "bold"
          ? "rounded-lg border border-zinc-200 bg-white px-3 py-2.5"
          : "rounded-sm border border-stone-200 bg-white px-3 py-2.5"

  const control =
    "h-9 rounded-full border border-black/10 bg-white px-3 text-sm text-[#1a1c1b] outline-none focus:border-[var(--theme-primary)]"

  const priceLabel =
    active.sort === "price-desc"
      ? "Harga ↓"
      : active.sort === "price-asc"
        ? "Harga ↑"
        : "Harga"

  const PriceIcon =
    active.sort === "price-asc" ? ArrowUpNarrowWide : ArrowDownWideNarrow

  const sortSelectValue = active.sort === "popular" ? "popular" : "name"

  const categoryOptions: SelectOption[] = [
    { value: "", label: "Semua kategori" },
    ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
  ]

  return (
    <div className={`${shell} ${isPending ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[10rem] flex-1 @2xl:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#515160]/70"
            strokeWidth={1.5}
          />
          <input
            id="catalog-q"
            type="search"
            value={q}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari produk..."
            className={`${control} w-full pl-9 pr-8 [&::-webkit-search-cancel-button]:hidden`}
            aria-label="Cari produk"
          />
          {q ? (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-[#515160] hover:bg-black/5"
              aria-label="Hapus pencarian"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          ) : null}
        </div>

        {categories.length > 0 && (
          <ThemeSelect
            label="Kategori"
            value={active.category ?? ""}
            options={categoryOptions}
            onChange={(value) =>
              pushFilters({
                ...active,
                category: value || undefined,
              })
            }
          />
        )}

        <button
          type="button"
          onClick={togglePriceSort}
          aria-pressed={priceActive}
          className={
            priceActive
              ? "inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--theme-primary)] px-3.5 text-xs font-semibold text-white"
              : `${control} inline-flex items-center gap-1.5 text-xs font-medium`
          }
        >
          <PriceIcon className="h-3.5 w-3.5" strokeWidth={2} />
          {priceLabel}
        </button>

        <ThemeSelect
          label="Urutkan"
          value={sortSelectValue}
          options={SORT_OPTIONS}
          onChange={(value) =>
            pushFilters({
              ...active,
              minPrice: undefined,
              maxPrice: undefined,
              sort: value as CatalogSort,
            })
          }
        />

        <span className="ml-auto text-xs text-[#515160]">{resultCount} produk</span>

        {hasActive && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-[#515160] underline-offset-2 hover:underline"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
