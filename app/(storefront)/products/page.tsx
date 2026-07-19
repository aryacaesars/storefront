import { ThemePageContent } from "@/features/storefront/ThemePageContent"

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  return ThemePageContent({
    pageType: "productList",
    fallbackTitle: "Products",
    searchParams: await searchParams,
  })
}
