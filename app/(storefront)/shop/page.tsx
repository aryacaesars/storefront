import { ThemePageContent } from "@/features/storefront/ThemePageContent"

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ShopPage({ searchParams }: PageProps) {
  return ThemePageContent({
    pageType: "shop",
    fallbackTitle: "Shop All",
    searchParams: await searchParams,
  })
}
