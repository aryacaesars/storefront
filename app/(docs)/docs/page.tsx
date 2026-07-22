import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DocsShell } from "@/features/docs/DocsShell"
import { getRequestLocale } from "@/features/i18n/LocaleShell"
import { getFullMessages } from "@/features/i18n/get-page-messages"
import {
  getDocsArticles,
  getDocsCategories,
  getArticlesByCategory,
} from "@/features/docs/content"

export async function generateMetadata() {
  const t = await getFullMessages()
  return {
    title: t.docs.hubTitle,
    description: t.docs.hubDescription,
  }
}

export default async function DocsHubPage() {
  const locale = await getRequestLocale()
  const t = await getFullMessages()
  const categories = getDocsCategories(locale)
  const articles = getDocsArticles(locale)

  return (
    <DocsShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
          {t.docs.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t.docs.hubTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-dash-muted">
          {t.docs.hubDescription}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const categoryArticles = getArticlesByCategory(locale, category.id)
            const first = categoryArticles[0]
            return (
              <Link
                key={category.id}
                href={first ? `/docs/${first.slug}` : "/docs"}
                className="group flex flex-col rounded-2xl border border-dash-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-brand/25 hover:shadow-[0_8px_24px_-12px_rgba(91,78,230,0.25)]"
              >
                <h2 className="text-base font-bold text-ink group-hover:text-brand">
                  {category.title}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-dash-muted">
                  {category.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  {categoryArticles.length} {t.docs.articlesWord}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>

        <section className="mt-12">
          <h2 className="text-sm font-semibold text-ink">{t.docs.startHere}</h2>
          <ul className="mt-3 space-y-2">
            {articles.slice(0, 4).map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/docs/${article.slug}`}
                  className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm transition-colors hover:border-dash-border hover:bg-white"
                >
                  <span className="font-medium text-dash-ink">{article.title}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-dash-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DocsShell>
  )
}
