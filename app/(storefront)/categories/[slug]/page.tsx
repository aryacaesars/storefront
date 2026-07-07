import { ThemePageContent } from "@/features/storefront/ThemePageContent"

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
