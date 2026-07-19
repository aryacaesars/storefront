import { ThemePageContent } from "@/features/storefront/ThemePageContent"
import { titleFromSlug } from "@/features/storefront/theme-config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return { title: titleFromSlug(slug) }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return ThemePageContent({
    pageType: "collection",
    fallbackTitle: "Collection",
    slug,
  })
}
