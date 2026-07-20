import Link from "next/link"
import { PublicTemplateCard } from "@/features/builder/components/PublicTemplateCard"
import {
  ExploreMoreCard,
  TemplateShowcaseHeading,
} from "@/features/builder/landing/TemplateShowcaseCopy"
import { getSession } from "@/features/auth/dal"
import { getPlatformBaseConfig } from "@/server/services/platform-theme.service"
import { getStoresByOwnerId } from "@/server/services/tenant.service"
import {
  getPublishedTemplates,
  getPaidOwnershipByTemplate,
  normalizeThemeSlug,
} from "@/server/services/template.service"
import { getTemplatePreviewHref } from "@/themes/engine/registry"
import type { ThemeConfig } from "@/themes/engine/schema"
import { purchaseTemplateForStore } from "@/app/(builder)/templates/actions"

export default async function TemplateShowcase() {
  const session = await getSession()
  const stores = session ? await getStoresByOwnerId(session.userId) : []
  const storeOptions = stores.map((s) => ({ id: s.id, name: s.name }))
  const ownership = session
    ? await getPaidOwnershipByTemplate(stores.map((s) => s.id))
    : new Map<string, Set<string>>()

  const templates = await getPublishedTemplates()
  const featured = templates.slice(0, 3)

  const configEntries = await Promise.all(
    featured.map(async (template) => {
      const themeId = normalizeThemeSlug(template.slug)
      if (!themeId) return [template.id, null] as const
      return [template.id, await getPlatformBaseConfig(themeId)] as const
    }),
  )
  const configById = Object.fromEntries(configEntries) as Record<
    string,
    ThemeConfig | null
  >

  return (
    <section id="templates" className="relative overflow-hidden bg-white px-6 py-24">
      <div className="relative mx-auto max-w-6xl">
        <TemplateShowcaseHeading />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((template) => {
            const themeId = normalizeThemeSlug(template.slug)
            const owned = ownership.get(template.id)
            return (
              <PublicTemplateCard
                key={template.id}
                template={template}
                themeConfig={configById[template.id]}
                themeId={themeId}
                previewHref={
                  themeId ? getTemplatePreviewHref(themeId) : template.previewUrl
                }
                isLoggedIn={Boolean(session)}
                stores={storeOptions}
                ownedStoreIds={owned ? Array.from(owned) : []}
                buyForStoreAction={purchaseTemplateForStore}
              />
            )
          })}
          <ExploreMoreCard />
        </div>
      </div>
    </section>
  )
}
