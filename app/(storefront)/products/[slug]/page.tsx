import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return ThemePageContent({
    pageType: "productDetail",
    fallbackTitle: "Product Detail",
    slug,
  })
}
