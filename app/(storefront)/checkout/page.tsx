import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export const metadata = { title: "Checkout" }

export default function CheckoutPage() {
  return ThemePageContent({ pageType: "checkout", fallbackTitle: "Secure Checkout" })
}
