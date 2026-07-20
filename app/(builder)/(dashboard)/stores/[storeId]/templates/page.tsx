import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getPlatformBaseConfig } from "@/server/services/platform-theme.service"
import { readThemeVault } from "@/server/services/theme.service"
import {
  getPublishedTemplates,
  getPurchasedTemplateIds,
  getActiveTemplateId,
  normalizeThemeSlug,
} from "@/server/services/template.service"
import { getStorefrontUrl } from "@/lib/tenant/storefront-url"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  dashboardBtnPrimary,
  DashboardPanel,
} from "@/features/builder/components/dashboard-ui"
import { StoreTemplateCard } from "@/features/builder/components/StoreTemplateCard"
import { TemplatesSearchBar } from "@/features/builder/components/TemplatesSearchBar"
import { DashboardInitialNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import { getPageMessages } from "@/features/i18n/get-page-messages"
import type { ThemeConfig } from "@/themes/engine/schema"
import { buyTemplate, activateOwnedTemplateForLive } from "./actions"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  const t = (await getPageMessages()).storeTemplates
  return { title: store ? `${t.title} — ${store.name}` : t.title }
}

function matchesQuery(
  template: { name: string; description: string | null; slug: string },
  q: string,
): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const haystack = [template.name, template.description ?? "", template.slug]
    .join(" ")
    .toLowerCase()
  return haystack.includes(needle)
}

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>
  searchParams: Promise<{ success?: string; q?: string }>
}) {
  const { storeId } = await params
  const { success, q = "" } = await searchParams
  const pages = await getPageMessages()
  const t = pages.storeTemplates
  const common = pages.common
  const session = await requireSession()
  const store = await getStoreById(storeId)

  if (!store || store.ownerId !== session.userId) notFound()

  const [allTemplates, purchasedIds, activeTemplateId, vaultState] = await Promise.all([
    getPublishedTemplates(),
    getPurchasedTemplateIds(storeId),
    getActiveTemplateId(storeId),
    readThemeVault(storeId),
  ])

  const activeSlug = activeTemplateId
    ? normalizeThemeSlug(activeTemplateId) ?? activeTemplateId
    : null

  // Library milik merchant saja. Belum dibeli → /templates (library global).
  const ownedTemplates = allTemplates.filter((template) => {
    if (purchasedIds.has(template.id)) return true
    const themeSlug = normalizeThemeSlug(template.slug)
    if (
      activeSlug &&
      (activeSlug === themeSlug || activeTemplateId === template.slug)
    ) {
      return true
    }
    if (themeSlug && vaultState?.vault.configs[themeSlug]) return true
    return false
  })

  const templates = ownedTemplates
    .filter((template) => matchesQuery(template, q))
    .sort((a, b) => {
      const aActive =
        activeSlug !== null &&
        (activeSlug === normalizeThemeSlug(a.slug) || activeTemplateId === a.slug)
      const bActive =
        activeSlug !== null &&
        (activeSlug === normalizeThemeSlug(b.slug) || activeTemplateId === b.slug)
      if (aActive === bActive) return a.name.localeCompare(b.name, "id")
      return aActive ? -1 : 1
    })

  const configEntries = await Promise.all(
    templates.map(async (template) => {
      const themeId = normalizeThemeSlug(template.slug)
      if (!themeId) return [template.id, null] as const

      // Sudah ada di vault (dibeli + dikustomisasi / diaktifkan) → Livestore.
      // Belum → platform base (bukan preview showcase).
      const stored = vaultState?.vault.configs[themeId]
      if (stored) {
        return [
          template.id,
          { ...stored, storeName: vaultState.storeName },
        ] as const
      }
      return [template.id, await getPlatformBaseConfig(themeId)] as const
    }),
  )
  const configById = Object.fromEntries(configEntries) as Record<
    string,
    ThemeConfig | null
  >

  const total = templates.length
  const ownedTotal = ownedTemplates.length
  const storefrontUrl = getStorefrontUrl(store.slug)
  const discoverHref = "/templates"

  const pageSubtitle = q.trim()
    ? t.searchResults
        .replace("{n}", String(total))
        .replace("{owned}", String(ownedTotal))
    : t.ownedCount.replace("{n}", String(ownedTotal))

  return (
    <DashboardShell
      pageTitle={t.title}
      pageSubtitle={pageSubtitle}
      action={
        <Link href={discoverHref} className={dashboardBtnPrimary}>
          {t.discover}
        </Link>
      }
    >
      <DashboardInitialNotice
        notice={
          success === "1"
            ? {
                type: "success",
                message: t.activatedToast,
                title: common.success,
              }
            : null
        }
      />

      <div className="mb-5">
        <TemplatesSearchBar
          defaultValue={q}
          placeholder={t.searchPlaceholder}
        />
      </div>

      {ownedTotal === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">{t.emptyOwned}</p>
          <Link
            href={discoverHref}
            className={`${dashboardBtnPrimary} mt-4 inline-flex`}
          >
            {t.discover}
          </Link>
        </DashboardPanel>
      ) : total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">
            {t.emptySearch.replace("{q}", q.trim())}
          </p>
        </DashboardPanel>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => {
            const themeSlug = normalizeThemeSlug(template.slug)
            const isActive =
              activeSlug !== null &&
              (activeSlug === themeSlug || activeTemplateId === template.slug)

            return (
              <StoreTemplateCard
                key={template.id}
                storeId={storeId}
                storefrontUrl={storefrontUrl}
                template={template}
                isPurchased={purchasedIds.has(template.id)}
                isActive={isActive}
                buyAction={buyTemplate}
                activateForLiveAction={activateOwnedTemplateForLive}
                themeConfig={configById[template.id]}
              />
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
