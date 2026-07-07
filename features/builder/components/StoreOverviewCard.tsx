import Link from "next/link"
import { ExternalLink, Pencil, Store } from "lucide-react"
import { getStorefrontHost, getStorefrontUrl } from "@/lib/tenant/storefront-url"
import {
  dashboardBtnOutline,
  dashboardBtnPrimary,
  dashboardCard,
  dashboardCardHover,
} from "./dashboard-ui"

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
    <article className={`${dashboardCard} ${variant === "overview" ? dashboardCardHover : ""} p-5 md:p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-dash-primary/10 text-dash-primary">
            <Store className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-gray-800">{name}</p>
            <p className="truncate text-sm text-gray-500">{getStorefrontHost(slug)}</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          aktif
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {variant === "overview" && (
          <Link href={`/stores/${id}/dashboard`} className={`${dashboardBtnPrimary} w-full py-3`}>
            Open Store Dashboard
          </Link>
        )}

        <div className={variant === "overview" ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 gap-3 sm:max-w-md"}>
          <Link
            href={`/stores/${id}/customize`}
            className={`${dashboardBtnOutline} gap-2 py-2.5`}
          >
            <Pencil className="h-4 w-4 shrink-0" />
            customize
          </Link>
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${dashboardBtnOutline} gap-2 py-2.5`}
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            visit store
          </a>
        </div>
      </div>
    </article>
  )
}
