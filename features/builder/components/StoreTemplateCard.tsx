import Link from "next/link"
import type { Template } from "@prisma/client"
import { cn } from "@/lib/utils"
import { TemplateThumbnail } from "@/features/builder/components/TemplateThumbnail"
import { dashboardBtnOutline, dashboardBtnPrimary } from "@/features/builder/components/dashboard-ui"
import { normalizeThemeSlug } from "@/server/services/template.service"
import type { TemplateId } from "@/themes/engine/schema"

interface StoreTemplateCardProps {
  storeId: string
  template: Template
  isPurchased: boolean
  isActive: boolean
  buyAction: (storeId: string, templateId: string) => Promise<void>
}

export function StoreTemplateCard({
  storeId,
  template,
  isPurchased,
  isActive,
  buyAction,
}: StoreTemplateCardProps) {
  const themeId = normalizeThemeSlug(template.slug)
  const isFree = template.price === 0
  const priceLabel = isFree ? "Gratis" : `Rp ${template.price.toLocaleString("id-ID")}`
  const customizeHref = `/stores/${storeId}/customize?template=${themeId ?? template.slug}`
  const activate = buyAction.bind(null, storeId, template.id)

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {template.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={template.previewUrl}
            alt={template.name}
            className="h-full w-full object-cover object-top"
          />
        ) : themeId ? (
          <TemplateThumbnail id={themeId as TemplateId} className="aspect-auto h-full w-full" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Preview tidak tersedia
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
              aktif
            </span>
          ) : (
            <span className="shrink-0 text-sm font-semibold text-brand">{priceLabel}</span>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isActive ? (
            <Link href={customizeHref} className={cn(dashboardBtnPrimary, "w-full py-3")}>
              Kelola Template
            </Link>
          ) : isPurchased || isFree ? (
            <form action={activate}>
              <button type="submit" className={cn(dashboardBtnPrimary, "w-full py-3")}>
                Aktifkan Template
              </button>
            </form>
          ) : (
            <form action={activate}>
              <button type="submit" className={cn(dashboardBtnPrimary, "w-full py-3")}>
                Beli — {priceLabel}
              </button>
            </form>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Link href={customizeHref} className={cn(dashboardBtnOutline, "py-2.5")}>
              customize
            </Link>
            <Link
              href={`${customizeHref}&mode=preview`}
              className={cn(dashboardBtnOutline, "py-2.5")}
            >
              preview
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
