import Link from "next/link"
import { ExternalLink, Pencil, Store } from "lucide-react"
import { getStorefrontHost, getStorefrontUrl } from "@/lib/tenant/storefront-url"
import { cn } from "@/lib/utils"
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
    <article
      className={cn(
        dashboardCard,
        variant === "overview" ? dashboardCardHover : "",
        "flex h-full min-h-[220px] flex-col rounded-[24px] p-5",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dash-primary-light text-dash-primary">
            <Store className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-dash-ink">{name}</p>
            <p className="mt-0.5 truncate text-sm text-dash-muted">{getStorefrontHost(slug)}</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/80 bg-[#ecfdf5] px-2.5 py-1 text-xs font-medium text-[#007a55]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00bc7d]" aria-hidden />
          Active
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-5">
        {variant === "overview" && (
          <Link
            href={`/stores/${id}/dashboard`}
            className={`${dashboardBtnPrimary} w-full rounded-[26px] py-3`}
          >
            Open Store Dashboard
          </Link>
        )}

        <div className="grid w-full grid-cols-2 gap-3">
          <Link
            href={`/stores/${id}/customize`}
            className={`${dashboardBtnOutline} rounded-[27px] py-2.5`}
          >
            <Pencil className="h-4 w-4 shrink-0" aria-hidden />
            Customize
          </Link>
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${dashboardBtnOutline} rounded-[27px] py-2.5`}
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
            Visit Store
          </a>
        </div>
      </div>
    </article>
  )
}
