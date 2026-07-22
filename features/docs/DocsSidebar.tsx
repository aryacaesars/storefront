"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
  dashboardInput,
  sidebarNavItemClass,
  sidebarSectionLabel,
} from "@/features/builder/components/dashboard-ui"
import { useLocale } from "@/features/i18n/LocaleProvider"
import {
  getArticlesByCategory,
  getDocsCategories,
  searchArticles,
  type DocsArticle,
  type DocsCategory,
} from "@/features/docs/content"

type DocsSidebarProps = {
  activeSlug?: string
  className?: string
  onNavigate?: () => void
}

export function DocsSidebar({ activeSlug, className, onNavigate }: DocsSidebarProps) {
  const [query, setQuery] = useState("")
  const { locale, messages: t } = useLocale()
  const allCategories = useMemo(() => getDocsCategories(locale), [locale])

  const filtered = useMemo(() => searchArticles(locale, query), [locale, query])
  const filteredSlugs = useMemo(
    () => new Set(filtered.map((a) => a.slug)),
    [filtered],
  )

  const categories = useMemo(() => {
    if (!query.trim()) return allCategories
    return allCategories.filter((category) =>
      getArticlesByCategory(locale, category.id).some((a) => filteredSlugs.has(a.slug)),
    )
  }, [query, filteredSlugs, allCategories, locale])

  return (
    <aside className={cn("flex h-full flex-col", className)}>
      <div className="px-4 pb-3 pt-1">
        <label className="sr-only" htmlFor="docs-search">
          {t.docs.searchPlaceholder}
        </label>
        <input
          id="docs-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.docs.searchPlaceholder}
          className={dashboardInput}
        />
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.length === 0 ? (
          <p className="px-3 py-4 text-sm text-dash-muted">{t.docs.noResults}</p>
        ) : (
          categories.map((category) => (
            <CategoryGroup
              key={category.id}
              category={category}
              articles={getArticlesByCategory(locale, category.id).filter((a) =>
                filteredSlugs.has(a.slug),
              )}
              activeSlug={activeSlug}
              onNavigate={onNavigate}
            />
          ))
        )}
      </nav>
    </aside>
  )
}

function CategoryGroup({
  category,
  articles,
  activeSlug,
  onNavigate,
}: {
  category: DocsCategory
  articles: DocsArticle[]
  activeSlug?: string
  onNavigate?: () => void
}) {
  if (articles.length === 0) return null

  return (
    <div>
      <p className={sidebarSectionLabel}>{category.title}</p>
      <ul className="flex flex-col gap-1">
        {articles.map((article) => {
          const active = article.slug === activeSlug
          return (
            <li key={article.slug}>
              <Link
                href={`/docs/${article.slug}`}
                onClick={onNavigate}
                className={cn(sidebarNavItemClass(active, true), "block truncate")}
              >
                {article.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
