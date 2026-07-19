"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search, Store } from "lucide-react"
import { StoreOverviewCard } from "@/features/builder/components/StoreOverviewCard"
import {
  dashboardBtnPrimary,
  dashboardCard,
  dashboardSectionTitle,
} from "@/features/builder/components/dashboard-ui"

type StoreItem = { id: string; name: string; slug: string }

export function DashboardStoreSection({ stores }: { stores: StoreItem[] }) {
  const [query, setQuery] = useState("")

  const filteredStores = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return stores.filter((store) => {
      if (normalized && !store.name.toLowerCase().includes(normalized)) return false
      return true
    })
  }, [stores, query])

  if (stores.length === 0) {
    return (
      <div className={`${dashboardCard} flex w-full flex-col items-center px-6 py-16 text-center md:py-20`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dash-primary-light text-dash-primary">
          <Store className="h-7 w-7" strokeWidth={1.75} aria-hidden />
        </div>
        <h2 className="mt-5 font-display text-xl font-bold text-dash-ink">Belum ada toko</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-dash-muted">
          Mulai dengan membuat toko pertamamu. Hanya butuh beberapa menit untuk siap berjualan.
        </p>
        <Link href="/stores/new" className={`${dashboardBtnPrimary} mt-8`}>
          Buat Toko Sekarang
        </Link>
      </div>
    )
  }

  return (
    <section>
      <div className="mb-6 flex justify-end">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:min-w-[280px] sm:max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search store"
              className="h-10 w-full rounded-full border-0 bg-dash-surface py-2 pl-5 pr-12 text-sm text-dash-ink shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] outline-none placeholder:text-[#6f6f6f] focus:ring-2 focus:ring-dash-primary/20"
            />
            <span className="pointer-events-none absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-dash-primary text-white">
              <Search className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
            </span>
          </div>
          <Link href="/stores/new" className={`${dashboardBtnPrimary} shrink-0 px-5 py-2.5`}>
            + Buat Toko
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <p className={dashboardSectionTitle}>
          {filteredStores.length} {filteredStores.length === 1 ? "Toko" : "Toko"}
        </p>
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredStores.map((store) => (
          <StoreOverviewCard key={store.id} id={store.id} name={store.name} slug={store.slug} />
        ))}
      </div>
    </section>
  )
}
