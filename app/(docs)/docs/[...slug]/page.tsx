import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DocsShell } from "@/features/docs/DocsShell"
import { DocsArticleView } from "@/features/docs/DocsArticle"
import { getRequestLocale } from "@/features/i18n/LocaleShell"
import { getFullMessages } from "@/features/i18n/get-page-messages"
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getArticleSlugParts,
} from "@/features/docs/content"

type Props = {
  params: Promise<{ slug: string[] }>
}

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({
    slug: getArticleSlugParts(slug),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const locale = await getRequestLocale()
  const article = getArticleBySlug(locale, slug.join("/"))
  if (!article) return { title: "Article not found" }
  return {
    title: article.title,
    description: article.description,
  }
}

export default async function DocsArticlePage({ params }: Props) {
  const { slug } = await params
  const articleSlug = slug.join("/")
  const locale = await getRequestLocale()
  const t = await getFullMessages()
  const article = getArticleBySlug(locale, articleSlug)
  if (!article) notFound()

  return (
    <DocsShell activeSlug={article.slug}>
      <div className="mx-auto max-w-4xl">
        <DocsArticleView article={article} locale={locale} t={t.docs} />
      </div>
    </DocsShell>
  )
}
