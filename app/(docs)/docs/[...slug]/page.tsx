import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DocsShell } from "@/features/docs/DocsShell"
import { DocsArticleView } from "@/features/docs/DocsArticle"
import {
  DOCS_ARTICLES,
  getArticleBySlug,
  getArticleSlugParts,
} from "@/features/docs/content"

type Props = {
  params: Promise<{ slug: string[] }>
}

export function generateStaticParams() {
  return DOCS_ARTICLES.map((article) => ({
    slug: getArticleSlugParts(article.slug),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug.join("/"))
  if (!article) return { title: "Artikel tidak ditemukan" }
  return {
    title: article.title,
    description: article.description,
  }
}

export default async function DocsArticlePage({ params }: Props) {
  const { slug } = await params
  const articleSlug = slug.join("/")
  const article = getArticleBySlug(articleSlug)
  if (!article) notFound()

  return (
    <DocsShell activeSlug={article.slug}>
      <div className="mx-auto max-w-4xl">
        <DocsArticleView article={article} />
      </div>
    </DocsShell>
  )
}
