import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export const metadata = { title: "Collections" }

export default function CollectionsPage() {
  return ThemePageContent({ pageType: "collections", fallbackTitle: "Collections" })
}
