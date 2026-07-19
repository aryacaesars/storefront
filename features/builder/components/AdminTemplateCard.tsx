import Link from "next/link"
import { cn } from "@/lib/utils"
import { ThemeHeroThumbnail } from "@/features/builder/components/ThemeHeroThumbnail"
import { TemplateThumbnail } from "@/features/builder/components/TemplateThumbnail"
import {
  dashboardBtnOutline,
  dashboardBtnPrimary,
} from "@/features/builder/components/dashboard-ui"
import type { TemplateAdminRow } from "@/server/services/admin.service"
import { normalizeThemeSlug } from "@/server/services/template.service"
import { getTemplatePreviewHref } from "@/themes/engine/registry"
import type { TemplateId, ThemeConfig } from "@/themes/engine/schema"

interface AdminTemplateCardProps {
  template: TemplateAdminRow
  /** Config platform (preview/base) — dipakai untuk thumbnail hero live. */
  themeConfig?: ThemeConfig | null
}

export function AdminTemplateCard({ template, themeConfig }: AdminTemplateCardProps) {
  const themeId = normalizeThemeSlug(template.slug)
  const priceLabel =
    template.price === 0 ? "Gratis" : `Rp ${template.price.toLocaleString("id-ID")}`
  const editDataHref = `/admin/templates/${template.id}`
  const editBaseHref = themeId
    ? `/admin/templates/${template.id}/builder`
    : null
  const previewHref = themeId ? getTemplatePreviewHref(themeId) : null

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
            <p className="mt-1 text-xs text-gray-400">
              {template.purchaseCount} pembelian · {priceLabel}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
              template.published
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-500",
            )}
          >
            {template.published ? "terbit" : "draft"}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {editBaseHref ? (
            <Link href={editBaseHref} className={cn(dashboardBtnPrimary, "w-full py-3")}>
              Theme Builder
            </Link>
          ) : (
            <span
              aria-disabled
              className={cn(dashboardBtnPrimary, "w-full py-3 cursor-not-allowed opacity-40")}
            >
              Theme Builder
            </span>
          )}

          <div className="grid grid-cols-2 gap-3">
            {previewHref ? (
              <Link
                href={previewHref}
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
            <Link href={editDataHref} className={cn(dashboardBtnOutline, "py-2.5")}>
              edit data
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
