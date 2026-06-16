import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export default function CheckoutPage() {
  return ThemePageContent({ pageType: "checkout", fallbackTitle: "Secure Checkout" })
}
