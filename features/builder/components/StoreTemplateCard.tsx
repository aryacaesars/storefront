import Link from "next/link"
import type { Template } from "@prisma/client"
import { cn } from "@/lib/utils"
import { ThemeHeroThumbnail } from "@/features/builder/components/ThemeHeroThumbnail"
import { TemplateThumbnail } from "@/features/builder/components/TemplateThumbnail"
import { LiveStoreButton } from "@/features/builder/components/LiveStoreButton"
import { dashboardBtnOutline, dashboardBtnPrimary } from "@/features/builder/components/dashboard-ui"
import { normalizeThemeSlug } from "@/server/services/template.service"
import { getTemplatePreviewHref } from "@/themes/engine/registry"
import type { TemplateId, ThemeConfig } from "@/themes/engine/schema"
import type { ActivateForLiveResult } from "@/app/(builder)/(dashboard)/stores/[storeId]/templates/actions"

interface StoreTemplateCardProps {
  storeId: string
  storefrontUrl: string
  template: Template
  isPurchased: boolean
  isActive: boolean
  buyAction: (storeId: string, templateId: string) => Promise<void>
  activateForLiveAction: (
    storeId: string,
    templateId: string,
  ) => Promise<ActivateForLiveResult>
  /** Config thumbnail: vault Livestore bila sudah dikustomisasi, selain itu platform base. */
  themeConfig?: ThemeConfig | null
}

export function StoreTemplateCard({
  storeId,
  storefrontUrl,
  template,
  isPurchased,
  isActive,
  buyAction,
  activateForLiveAction,
  themeConfig,
}: StoreTemplateCardProps) {
  const themeId = normalizeThemeSlug(template.slug)
  const isFree = template.price === 0
  const isOwned = isPurchased || isFree || isActive
  const priceLabel = isFree ? "Free" : `Rp ${template.price.toLocaleString("id-ID")}`
  const customizeHref = `/stores/${storeId}/customize?template=${themeId ?? template.slug}`
  const activate = buyAction.bind(null, storeId, template.id)
  const activateForLive = activateForLiveAction.bind(null, storeId, template.id)

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {themeConfig ? (
          <ThemeHeroThumbnail config={themeConfig} className="absolute inset-0 h-full w-full" />
        ) : themeId ? (
          <TemplateThumbnail id={themeId as TemplateId} className="aspect-auto h-full w-full" />
        ) : template.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={template.previewUrl}
            alt={template.name}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Preview unavailable
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-ink">{template.name}</p>
            <p className="mt-0.5 line-clamp-2 text-sm text-gray-400">
              {template.description ?? themeId ?? template.slug}
            </p>
          </div>
          {isActive ? (
            <span className="shrink-0 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
              Active
            </span>
          ) : isOwned ? (
            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
              Inactive
            </span>
          ) : (
            <span className="shrink-0 text-sm font-semibold text-brand">{priceLabel}</span>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isActive ? (
            <Link href={customizeHref} className={cn(dashboardBtnPrimary, "w-full py-3")}>
              Manage Template
            </Link>
          ) : isPurchased || isFree ? (
            <form action={activate}>
              <button type="submit" className={cn(dashboardBtnPrimary, "w-full py-3")}>
                Activate Template
              </button>
            </form>
          ) : (
            <form action={activate}>
              <button type="submit" className={cn(dashboardBtnPrimary, "w-full py-3")}>
                Buy — {priceLabel}
              </button>
            </form>
          )}

          <div className={cn("grid gap-3", isOwned && themeId ? "grid-cols-2" : "grid-cols-1")}>
            {themeId ? (
              <Link
                href={getTemplatePreviewHref(themeId)}
                target="_blank"
                className={cn(dashboardBtnOutline, "py-2.5")}
              >
                preview
              </Link>
            ) : (
              <span
                aria-disabled
                className={cn(dashboardBtnOutline, "py-2.5 cursor-not-allowed opacity-40")}
              >
                preview
              </span>
            )}
            {isOwned && (
              <LiveStoreButton
                isActive={isActive}
                storefrontUrl={storefrontUrl}
                templateName={template.name}
                activateAction={activateForLive}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
