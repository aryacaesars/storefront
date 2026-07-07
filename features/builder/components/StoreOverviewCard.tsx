import Link from "next/link"
import { ExternalLink, Pencil, Store } from "lucide-react"
import { getStorefrontHost, getStorefrontUrl } from "@/lib/tenant/storefront-url"
import { dashboardCard, dashboardCardHover } from "./dashboard-ui"

interface StoreOverviewCardProps {
  id: string
  name: string
  slug: string
  variant?: "overview" | "compact"
}

export function StoreOverviewCard({
  id,
  name,
  slug,
  variant = "overview",
}: StoreOverviewCardProps) {
  const storefrontUrl = getStorefrontUrl(slug)

  return (
    <article className={`${dashboardCard} ${variant === "overview" ? dashboardCardHover : ""} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand/15 to-brand/5 text-brand">
            <Store className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-ink">{name}</p>
            <p className="truncate text-sm text-gray-400">{getStorefrontHost(slug)}</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          aktif
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {variant === "overview" && (
          <Link
            href={`/stores/${id}/dashboard`}
            className="flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Open Store&apos;s Dashboard
          </Link>
        )}

        <div className={variant === "overview" ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 gap-3 sm:max-w-md"}>
          <Link
            href={`/stores/${id}/customize`}
            className="flex items-center justify-center gap-2 rounded-xl border border-brand/80 px-3 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            <Pencil className="h-4 w-4 shrink-0" />
            customize
          </Link>
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-brand/80 px-3 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            visit store
          </a>
        </div>
      </div>
    </article>
  )
}
