import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getAdjacentArticles,
  getCategoryById,
  type DocsArticle,
  type DocsBlock,
} from "@/features/docs/content"

type DocsArticleProps = {
  article: DocsArticle
}

export function DocsArticleView({ article }: DocsArticleProps) {
  const category = getCategoryById(article.categoryId)
  const { prev, next } = getAdjacentArticles(article.slug)

  return (
    <article className="min-w-0">
      <header className="mb-10">
        {category && (
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
            {category.title}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-dash-muted">
          {article.description}
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
        <div className="min-w-0 space-y-10">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="text-xl font-bold tracking-tight text-ink">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.blocks.map((block, i) => (
                  <Block key={`${section.id}-${i}`} block={block} />
                ))}
              </div>
            </section>
          ))}

          <nav className="mt-14 grid gap-3 border-t border-dash-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/docs/${prev.slug}`}
                className="group flex flex-col rounded-2xl border border-dash-border bg-white p-4 transition-colors hover:border-brand/30 hover:bg-brand/[0.03]"
              >
                <span className="inline-flex items-center gap-1 text-xs font-medium text-dash-muted">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Sebelumnya
                </span>
                <span className="mt-1 text-sm font-semibold text-ink group-hover:text-brand">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/docs/${next.slug}`}
                className="group flex flex-col items-end rounded-2xl border border-dash-border bg-white p-4 text-right transition-colors hover:border-brand/30 hover:bg-brand/[0.03] sm:col-start-2"
              >
                <span className="inline-flex items-center gap-1 text-xs font-medium text-dash-muted">
                  Berikutnya
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1 text-sm font-semibold text-ink group-hover:text-brand">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </div>

        <aside className="sticky top-28 mt-10 hidden h-fit lg:mt-0 lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-dash-muted/80">
            Di halaman ini
          </p>
          <ul className="mt-3 space-y-2 border-l border-dash-border pl-3">
            {article.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block text-sm text-dash-muted transition-colors hover:text-brand"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  )
}

function Block({ block }: { block: DocsBlock }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-[15px] leading-relaxed text-dash-ink/85">{block.text}</p>
    )
  }

  if (block.type === "bullets") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-dash-ink/85">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-brand/15 bg-brand/[0.06] px-4 py-3.5",
        "text-[15px] leading-relaxed text-dash-ink/90",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-brand">
        Tips
      </p>
      <p className="mt-1.5">{block.text}</p>
    </div>
  )
}
