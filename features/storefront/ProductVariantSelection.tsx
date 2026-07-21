"use client"

import { createContext, useContext, useMemo, useState } from "react"
import Image from "next/image"
import type {
  CatalogProduct,
  CatalogProductVariant,
} from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"
import {
  isVariantSelectionComplete,
  productHasOptionDimensions,
  resolveSelectedVariant,
} from "@/features/storefront/product-variants"

type ProductVariantSelectionContextValue = {
  product: CatalogProduct
  selectedSize: string
  selectedColor: string
  selectedVariantId: string
  setSelectedSize: (value: string) => void
  setSelectedColor: (value: string) => void
  setSelectedVariantId: (value: string) => void
  selectedVariant: CatalogProductVariant | null
}

const ProductVariantSelectionContext =
  createContext<ProductVariantSelectionContextValue | null>(null)

/** Null di luar provider — komponen pemakai fallback ke state lokal. */
export function useProductVariantSelection() {
  return useContext(ProductVariantSelectionContext)
}

export function ProductVariantSelectionProvider({
  product,
  children,
}: {
  product: CatalogProduct
  children: React.ReactNode
}) {
  // Tanpa pilihan default — user harus memilih varian secara eksplisit.
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedVariantId, setSelectedVariantId] = useState("")

  const selectedVariant = useMemo(() => {
    const variants = product.variants ?? []
    if (variants.length === 0) return null
    // Varian pakai dimensi ukuran/warna → resolusi dari size/color.
    if (productHasOptionDimensions(product)) {
      const selected = {
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      }
      if (!isVariantSelectionComplete(product, selected)) return null
      return resolveSelectedVariant(product, selected)
    }
    // Tanpa dimensi (mis. makanan) → pilih langsung by id.
    if (!selectedVariantId) return null
    return variants.find((v) => v.id === selectedVariantId) ?? null
  }, [product, selectedSize, selectedColor, selectedVariantId])

  const value = useMemo(
    () => ({
      product,
      selectedSize,
      selectedColor,
      selectedVariantId,
      setSelectedSize,
      setSelectedColor,
      setSelectedVariantId,
      selectedVariant,
    }),
    [product, selectedSize, selectedColor, selectedVariantId, selectedVariant],
  )

  return (
    <ProductVariantSelectionContext.Provider value={value}>
      {children}
    </ProductVariantSelectionContext.Provider>
  )
}

interface ProductVariantPriceProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Harga yang mengikuti varian terpilih: sebelum memilih tampil rentang
 * (termurah – termahal), setelah memilih tampil harga varian tersebut.
 * Wajib di dalam ProductVariantSelectionProvider.
 */
export function ProductVariantPrice({ className, style }: ProductVariantPriceProps) {
  const ctx = useProductVariantSelection()
  if (!ctx) return null

  const { product, selectedVariant } = ctx
  const label = selectedVariant
    ? formatIdr(selectedVariant.price)
    : product.priceMax != null && product.priceMax > product.price
      ? `${formatIdr(product.price)} – ${formatIdr(product.priceMax)}`
      : formatIdr(product.salePrice ?? product.price)

  return (
    <span className={className} style={style}>
      {label}
    </span>
  )
}

interface ProductVariantImageProps {
  name: string
  imageClass: string
  wrapperClassName?: string
  badge?: React.ReactNode
  overlay?: React.ReactNode
}

/**
 * Gambar produk yang mengikuti varian terpilih (context). Fallback ke gambar
 * utama produk, lalu gradient imageClass bila tidak ada gambar sama sekali.
 */
export function ProductVariantImage({
  name,
  imageClass,
  wrapperClassName,
  badge,
  overlay,
}: ProductVariantImageProps) {
  const ctx = useProductVariantSelection()
  const imageUrl = ctx?.selectedVariant?.imageUrl ?? ctx?.product.imageUrl

  return (
    <div className={wrapperClassName}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className={`h-full w-full ${imageClass}`} />
      )}
      {badge}
      {overlay}
    </div>
  )
}
