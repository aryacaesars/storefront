"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
  DOCS_CATEGORIES,
  getArticlesByCategory,
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

  const filtered = useMemo(() => searchArticles(query), [query])
  const filteredSlugs = useMemo(
    () => new Set(filtered.map((a) => a.slug)),
    [filtered],
  )

  const categories = useMemo(() => {
    if (!query.trim()) return DOCS_CATEGORIES
    return DOCS_CATEGORIES.filter((category) =>
      getArticlesByCategory(category.id).some((a) => filteredSlugs.has(a.slug)),
    )
  }, [query, filteredSlugs])

  return (
    <aside className={cn("flex h-full flex-col", className)}>
      <div className="px-4 pb-3 pt-1">
        <label className="sr-only" htmlFor="docs-search">
          Cari dokumentasi
        </label>
        <input
          id="docs-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari artikel…"
          className="w-full rounded-xl border border-dash-border bg-white px-3.5 py-2 text-sm text-dash-ink placeholder:text-dash-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.length === 0 ? (
          <p className="px-2 py-4 text-sm text-dash-muted">Tidak ada hasil.</p>
        ) : (
          categories.map((category) => (
            <CategoryGroup
              key={category.id}
              category={category}
              articles={getArticlesByCategory(category.id).filter((a) =>
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
    <div className="mb-5">
      <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-dash-muted/80">
        {category.title}
      </p>
      <ul className="space-y-0.5">
        {articles.map((article) => {
          const active = article.slug === activeSlug
          return (
            <li key={article.slug}>
              <Link
                href={`/docs/${article.slug}`}
                onClick={onNavigate}
                className={cn(
                  "block rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-brand/10 font-semibold text-brand"
                    : "text-dash-ink/80 hover:bg-dash-bg hover:text-dash-ink",
                )}
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
