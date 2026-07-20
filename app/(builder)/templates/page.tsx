import Link from "next/link"
import LandingNav from "@/features/builder/landing/LandingNav"
import LandingFooter from "@/features/builder/landing/LandingFooter"
import { PublicTemplateCard } from "@/features/builder/components/PublicTemplateCard"
import { TemplatesSearchBar } from "@/features/builder/components/TemplatesSearchBar"
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
import { LocaleShell } from "@/features/i18n/LocaleShell"
import { purchaseTemplateForStore } from "./actions"

export const metadata = { title: "Template Library" }

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

export default async function GlobalTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = "" } = await searchParams
  const session = await getSession()
  const stores = session ? await getStoresByOwnerId(session.userId) : []
  const storeOptions = stores.map((s) => ({ id: s.id, name: s.name }))
  const ownership = session
    ? await getPaidOwnershipByTemplate(stores.map((s) => s.id))
    : new Map<string, Set<string>>()

  const all = await getPublishedTemplates()
  const templates = all.filter((t) => matchesQuery(t, q))

  const configEntries = await Promise.all(
    templates.map(async (template) => {
      const themeId = normalizeThemeSlug(template.slug)
      if (!themeId) return [template.id, null] as const
      // Library global: selalu base platform (belum ada konteks Livestore toko).
      return [template.id, await getPlatformBaseConfig(themeId)] as const
    }),
  )
  const configById = Object.fromEntries(configEntries) as Record<
    string,
    ThemeConfig | null
  >

  return (
    <LocaleShell>
    <div className="flex h-dvh flex-col overflow-y-auto overflow-x-hidden bg-[#fafafa] font-sans text-ink [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <LandingNav />
      <main className="flex-1 px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 border-b border-black/[0.06] pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Library
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                All Templates
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                {q.trim()
                  ? `${templates.length} results from ${all.length} public templates`
                  : `${all.length} templates ready to use · license per store`}
              </p>
            </div>
            <Link
              href={session ? (session.role === "ADMIN" ? "/admin" : "/dashboard") : "/login"}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              {session
                ? session.role === "ADMIN"
                  ? "Admin"
                  : "Dashboard"
                : "Get started with Etalase"}
            </Link>
          </div>

          <div className="mt-8">
            <TemplatesSearchBar defaultValue={q} placeholder="Search templates..." />
          </div>

          {templates.length === 0 ? (
            <div className="mt-14 rounded-2xl border border-dashed border-black/10 bg-white px-8 py-20 text-center">
              <p className="text-sm text-neutral-500">
                {q.trim()
                  ? `No templates match "${q.trim()}".`
                  : "No templates published yet."}
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {templates.map((template) => {
                const themeId = normalizeThemeSlug(template.slug)
                const owned = ownership.get(template.id)
                return (
                  <PublicTemplateCard
                    key={template.id}
                    template={template}
                    themeConfig={configById[template.id]}
                    themeId={themeId}
                    previewHref={
                      themeId
                        ? getTemplatePreviewHref(themeId)
                        : template.previewUrl
                    }
                    isLoggedIn={Boolean(session)}
                    stores={storeOptions}
                    ownedStoreIds={owned ? Array.from(owned) : []}
                    buyForStoreAction={purchaseTemplateForStore}
                  />
                )
              })}
            </div>
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
    </LocaleShell>
  )
}
