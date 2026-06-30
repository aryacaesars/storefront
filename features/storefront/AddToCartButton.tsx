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
  label?: string
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
  label = "Add to Cart",
  className,
  style,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  function handleClick() {
    startTransition(async () => {
      await addToCart(productId, slug, name, price, imageUrl)
      router.refresh() // re-render layout so navbar badge updates
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      className={className}
      style={style}
      aria-live="polite"
    >
      {pending ? "Menambahkan..." : added ? "✓ Masuk keranjang" : label}
    </button>
  )
}
