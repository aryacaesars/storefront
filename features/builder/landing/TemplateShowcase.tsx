import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PublicTemplateCard } from "@/features/builder/components/PublicTemplateCard"
import AnimatedBlurFadeIn from "@/features/builder/landing/AnimatedBlurFadeIn"
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

function ExploreCard() {
  return (
    <Link
      href="/templates"
      className="group flex min-h-[280px] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-brand p-8 text-center transition-colors hover:bg-brand-dark sm:min-h-0"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-300 group-hover:scale-110">
        <ArrowUpRight className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <div>
        <p className="font-display text-xl font-bold text-white">Explore More</p>
        <p className="mt-1 text-sm text-white/70">Lihat semua template di library</p>
      </div>
    </Link>
  )
}

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
        <AnimatedBlurFadeIn
          as="h2"
          className="mx-auto max-w-3xl text-center font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl"
          delayMs={120}
        >
          Template That Might Suit
          <br />
          To Your <span className="text-brand">Store</span>
        </AnimatedBlurFadeIn>

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
          <ExploreCard />
        </div>
      </div>
    </section>
  )
}
