import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DocsShell } from "@/features/docs/DocsShell"
import {
  DOCS_ARTICLES,
  DOCS_CATEGORIES,
  getArticlesByCategory,
} from "@/features/docs/content"

export const metadata = {
  title: "Dokumentasi Etalase",
  description:
    "Pelajari cara setup toko, template, kustomisasi, katalog, dan operasional di Etalase.",
}

export default function DocsHubPage() {
  return (
    <DocsShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
          Dokumentasi
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Panduan merchant Etalase
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-dash-muted">
          Dari buat toko sampai live di subdomain — semua langkah inti ada di sini.
          Pilih kategori di bawah atau cari dari sidebar.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {DOCS_CATEGORIES.map((category) => {
            const articles = getArticlesByCategory(category.id)
            const first = articles[0]
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
                  {articles.length} artikel
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>

        <section className="mt-12">
          <h2 className="text-sm font-semibold text-ink">Mulai dari sini</h2>
          <ul className="mt-3 space-y-2">
            {DOCS_ARTICLES.slice(0, 4).map((article) => (
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
