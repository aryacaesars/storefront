import Link from "next/link"
import { ClearCart } from "@/features/storefront/ClearCart"

export const metadata = { title: "Order Successful" }

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <ClearCart />
      <div className="max-w-md w-full text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6"
          style={{ backgroundColor: "var(--theme-primary, #000)" }}
        >
          ✓
        </div>
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: "var(--theme-heading-font, inherit)" }}
        >
          Order Successful!
        </h1>
        {order && (
          <p className="mt-3 text-gray-500 text-sm">
            Order <span className="font-bold text-gray-900">#{order}</span> has been received.
          </p>
        )}
        <p className="mt-2 text-gray-400 text-sm">
          We will process your order shortly. Check your email for confirmation.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block px-8 py-3 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-zinc-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
