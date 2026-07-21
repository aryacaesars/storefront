"use client"

import { useMemo, useState, useTransition } from "react"
import { Minus, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { addToCart } from "@/app/(storefront)/cart/actions"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"
import {
  isVariantSelectionComplete,
  productHasOptionDimensions,
  productHasVariants,
  resolveSelectedVariant,
} from "@/features/storefront/product-variants"
import { useProductVariantSelection } from "@/features/storefront/ProductVariantSelection"
import { cn } from "@/lib/utils"

interface ProductPurchaseActionsProps {
  product: CatalogProduct
  addLabel?: string
  buyLabel?: string
  className?: string
  buttonClassName?: string
  secondaryButtonClassName?: string
  buttonStyle?: React.CSSProperties
}

export function ProductPurchaseActions({
  product,
  addLabel = "Add to Cart",
  buyLabel = "Buy Now",
  className,
  buttonClassName,
  secondaryButtonClassName,
  buttonStyle,
}: ProductPurchaseActionsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)
  const ctx = useProductVariantSelection()
  const [localSize, setLocalSize] = useState("")
  const [localColor, setLocalColor] = useState("")
  const [localVariantId, setLocalVariantId] = useState("")
  const [selectWarning, setSelectWarning] = useState(false)

  // Kalau dibungkus ProductVariantSelectionProvider, pakai state bersama agar
  // gambar & harga varian ikut berubah; di luar provider fallback state lokal.
  // Tanpa pilihan default — user wajib memilih varian secara eksplisit.
  const selectedSize = ctx?.selectedSize ?? localSize
  const selectedColor = ctx?.selectedColor ?? localColor
  const selectedVariantId = ctx?.selectedVariantId ?? localVariantId
  const setSelectedSize = ctx?.setSelectedSize ?? setLocalSize
  const setSelectedColor = ctx?.setSelectedColor ?? setLocalColor
  const setSelectedVariantId = ctx?.setSelectedVariantId ?? setLocalVariantId

  const hasVariants = productHasVariants(product)
  const hasDimensions = productHasOptionDimensions(product)
  const variants = useMemo(() => product.variants ?? [], [product])

  const selectedVariant = useMemo(() => {
    if (variants.length === 0) return null
    if (hasDimensions) {
      const selected = {
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      }
      if (!isVariantSelectionComplete(product, selected)) return null
      return resolveSelectedVariant(product, selected)
    }
    if (!selectedVariantId) return null
    return variants.find((v) => v.id === selectedVariantId) ?? null
  }, [product, hasDimensions, variants, selectedSize, selectedColor, selectedVariantId])

  const unitPrice = selectedVariant?.price ?? product.price
  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.inStock
  const needsSelection = hasVariants && !selectedVariant
  const disabled = pending || (!inStock && !needsSelection)

  // Batas qty: stok varian terpilih; tanpa varian tak ada batas pasti di sisi
  // katalog (dicek ulang saat checkout).
  const maxQty = selectedVariant ? selectedVariant.stock : Infinity
  const [qty, setQty] = useState(1)

  // orderQty selalu ter-clamp ke stok terkini walau state qty lebih besar
  // (mis. setelah ganti ke varian berstok lebih sedikit).
  const orderQty = Number.isFinite(maxQty) ? Math.min(Math.max(1, qty), Math.max(1, maxQty)) : Math.max(1, qty)

  function decQty() {
    setQty(Math.max(1, orderQty - 1))
  }

  function incQty() {
    setQty(Number.isFinite(maxQty) ? Math.min(maxQty, orderQty + 1) : orderQty + 1)
  }

  // Opsi tersedia bila ada varian yang cocok dengan dimensi lain yang
  // sedang terpilih. Contoh: warna "Biru" terpilih → ukuran "L" nonaktif
  // kalau tidak ada varian (Biru, L).
  function sizeEnabled(size: string) {
    return variants.some(
      (v) => v.size === size && (!selectedColor || v.color === selectedColor),
    )
  }

  function colorEnabled(color: string) {
    return variants.some(
      (v) => v.color === color && (!selectedSize || v.size === selectedSize),
    )
  }

  function comboExists(size: string, color: string) {
    if (!size || !color) return true
    return variants.some((v) => v.size === size && v.color === color)
  }

  function selectSize(value: string) {
    setSelectWarning(false)
    // Klik ulang opsi terpilih = batal pilih (toggle).
    const next = value === selectedSize ? "" : value
    setSelectedSize(next)
    // Kalau kombinasi baru tak ada, reset warna agar user pilih ulang.
    if (next && selectedColor && !comboExists(next, selectedColor)) {
      setSelectedColor("")
    }
  }

  function selectColor(value: string) {
    setSelectWarning(false)
    const next = value === selectedColor ? "" : value
    setSelectedColor(next)
    if (next && selectedSize && !comboExists(selectedSize, next)) {
      setSelectedSize("")
    }
  }

  function selectVariantById(id: string) {
    setSelectWarning(false)
    setSelectedVariantId(id === selectedVariantId ? "" : id)
  }

  function handleAdd(redirectTo?: string) {
    if (needsSelection) {
      setSelectWarning(true)
      return
    }
    startTransition(async () => {
      await addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: unitPrice,
        imageUrl: selectedVariant?.imageUrl ?? product.imageUrl,
        variantId: selectedVariant?.id,
        variantLabel: selectedVariant?.label,
        quantity: orderQty,
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

  return (
    <div className={className}>
      {hasVariants && (
        <div className="mb-4 space-y-4">
          {hasDimensions ? (
            <>
              {product.optionColors && product.optionColors.length > 0 && (
                <VariantOptionGroup
                  label="Varian"
                  options={product.optionColors}
                  selected={selectedColor}
                  onSelect={selectColor}
                  isDisabled={(color) => !colorEnabled(color)}
                />
              )}
              {product.optionSizes && product.optionSizes.length > 0 && (
                <VariantOptionGroup
                  label="Ukuran"
                  options={product.optionSizes}
                  selected={selectedSize}
                  onSelect={selectSize}
                  isDisabled={(size) => !sizeEnabled(size)}
                />
              )}
            </>
          ) : (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                Varian
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const isSelected = variant.id === selectedVariantId
                  const soldOut = variant.stock <= 0
                  const disabledBtn = !isSelected && soldOut
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => selectVariantById(variant.id)}
                      disabled={disabledBtn}
                      aria-pressed={isSelected}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                        isSelected
                          ? "border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white"
                          : disabledBtn
                            ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 line-through"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                      )}
                    >
                      {variant.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {selectedVariant && (
            <p className="text-xs font-medium text-gray-500">
              Selected: {selectedVariant.label} · {formatIdr(selectedVariant.price)}
              {selectedVariant.stock <= 5 && selectedVariant.stock > 0
                ? ` · ${selectedVariant.stock} left`
                : null}
            </p>
          )}
          {selectedVariant && selectedVariant.stock <= 0 && (
            <p className="text-xs font-medium text-red-600">
              Varian ini sedang habis. Pilih varian lain.
            </p>
          )}
          {needsSelection && !selectWarning && (
            <p className="text-xs font-medium text-gray-500">
              Pilih varian terlebih dahulu.
            </p>
          )}
          {selectWarning && (
            <p className="text-xs font-semibold text-amber-700">
              Pilih varian dulu sebelum melanjutkan checkout.
            </p>
          )}
        </div>
      )}

      {inStock && !needsSelection && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Jumlah
          </span>
          <div className="inline-flex items-center rounded-full border border-gray-200">
            <button
              type="button"
              onClick={decQty}
              disabled={orderQty <= 1}
              aria-label="Kurangi jumlah"
              className="flex h-9 w-9 items-center justify-center rounded-l-full text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-semibold text-gray-800">
              {orderQty}
            </span>
            <button
              type="button"
              onClick={incQty}
              disabled={Number.isFinite(maxQty) && orderQty >= maxQty}
              aria-label="Tambah jumlah"
              className="flex h-9 w-9 items-center justify-center rounded-r-full text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {Number.isFinite(maxQty) && maxQty <= 5 && (
            <span className="text-xs text-gray-400">Stok {maxQty}</span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleAdd()}
          disabled={disabled}
          className={buttonClassName}
          style={buttonStyle}
        >
          {pending ? "Adding..." : added ? "✓ Added to cart" : addLabel}
        </button>
        <button
          type="button"
          onClick={() => handleAdd("/checkout")}
          disabled={disabled}
          className={secondaryButtonClassName ?? buttonClassName}
        >
          {pending ? "Processing..." : buyLabel}
        </button>
      </div>
    </div>
  )
}

function VariantOptionGroup({
  label,
  options,
  selected,
  onSelect,
  isDisabled,
}: {
  label: string
  options: string[]
  selected: string
  onSelect: (value: string) => void
  isDisabled?: (value: string) => boolean
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option
          // Opsi terpilih tetap bisa diklik (untuk toggle batal) walau
          // cross-filter menandainya nonaktif.
          const disabled = !isSelected && (isDisabled?.(option) ?? false)
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                isSelected
                  ? "border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white"
                  : disabled
                    ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 line-through"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
