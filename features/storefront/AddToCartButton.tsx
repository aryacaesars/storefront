"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { addToCart } from "@/app/(storefront)/cart/actions"

interface AddToCartButtonProps {
  productId: string
  slug: string
  name: string
  price: number
  imageUrl?: string
  variantId?: string
  variantLabel?: string
  label?: string
  /** After add: navigate here (e.g. /checkout for buy now). */
  redirectTo?: string
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
}

export function AddToCartButton({
  productId,
  slug,
  name,
  price,
  imageUrl,
  variantId,
  variantLabel,
  label = "Add to Cart",
  redirectTo,
  className,
  style,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  function handleClick() {
    startTransition(async () => {
      await addToCart({
        productId,
        slug,
        name,
        price,
        imageUrl,
        variantId,
        variantLabel,
      })
      if (redirectTo) {
        router.push(redirectTo)
        return
      }
      router.refresh()
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    })
  }

  const pendingLabel = redirectTo ? "Processing..." : "Adding..."
  const doneLabel = redirectTo ? label : "✓ Added to cart"

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      className={className}
      style={style}
      aria-live="polite"
    >
      {pending ? pendingLabel : added ? doneLabel : label}
    </button>
  )
}
