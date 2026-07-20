import Link from "next/link"
import { Sparkles } from "lucide-react"
import { dashboardBtnPrimary } from "./dashboard-ui"

export function SidebarPromoCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-dash-ink p-4">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/3"
        aria-hidden
      />

      <div className="relative">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </div>
        <p className="text-sm font-semibold text-white">Create New Store</p>
        <p className="mt-1 text-xs leading-relaxed text-white/60">
          Launch a new storefront in minutes.
        </p>
        <Link
          href="/stores/new"
          className={`${dashboardBtnPrimary} mt-4 w-full py-2.5 text-sm shadow-[0_4px_14px_-4px_rgba(91,78,230,0.6)]`}
        >
          + Create Store
        </Link>
      </div>
    </div>
  )
}
