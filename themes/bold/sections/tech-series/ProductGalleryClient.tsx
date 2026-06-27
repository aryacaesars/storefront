"use client"

import { useState } from "react"
import type { MockProductDetail } from "@/themes/bold/data/mock"

interface ProductGalleryClientProps {
  product: MockProductDetail
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rating)
        const half = !filled && i < rating
        return (
          <span
            key={i}
            className="text-base leading-none"
            style={{ color: filled || half ? "var(--theme-accent)" : "#D1D5DB" }}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}

function GalleryImage({
  imageClass,
  imageUrl,
  alt,
  className,
}: {
  imageClass: string
  imageUrl?: string
  alt: string
  className?: string
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt={alt} className={className ?? "h-full w-full object-cover"} />
    )
  }
  return <div className={`${imageClass} ${className ?? "h-full w-full"}`} />
}

export function ProductGalleryClient({ product }: ProductGalleryClientProps) {
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeSize, setActiveSize] = useState(product.defaultSize)

  const activeThumbData = product.thumbnails[activeThumb]
  const mainImageUrl = activeThumbData?.imageUrl ?? product.imageUrl
  const outOfStock = product.inStock === false
  const priceDisplay =
    product.priceLabel ?? `$${product.price.toFixed(product.price % 1 === 0 ? 0 : 2)}`

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex gap-3">
        {product.thumbnails.length > 1 && (
          <div className="flex w-12 shrink-0 flex-col gap-2">
            {product.thumbnails.map((thumb, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveThumb(i)}
                className="h-12 w-12 overflow-hidden rounded-sm border-2 transition-colors"
                style={{
                  borderColor: activeThumb === i ? "var(--theme-primary)" : "#E5E7EB",
                }}
                aria-label={thumb.alt}
              >
                <GalleryImage
                  imageClass={thumb.imageClass}
                  imageUrl={thumb.imageUrl}
                  alt={thumb.alt}
                />
              </button>
            ))}
          </div>
        )}

        <div className="relative flex-1">
          <div className="aspect-square overflow-hidden rounded-sm">
            <GalleryImage
              imageClass={activeThumbData?.imageClass ?? product.mainImageClass}
              imageUrl={mainImageUrl}
              alt={product.name}
            />
          </div>
          {product.badge && (
            <span
              className="absolute left-4 top-4 rounded-sm px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              {product.badge}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          {product.seriesLabel && (
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--theme-primary)" }}
            >
              {product.seriesLabel}
            </p>
          )}
          <h1
            className="mt-1 text-4xl font-black uppercase leading-none text-zinc-900"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {product.name}
          </h1>
        </div>

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-zinc-500">({product.reviewCount} REVIEWS)</span>
          </div>
        )}

        <p className="text-3xl font-black" style={{ color: "var(--theme-primary)" }}>
          {priceDisplay}
        </p>

        {product.description && (
          <p className="text-sm leading-relaxed text-zinc-600">{product.description}</p>
        )}


        {product.sizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-700">
                SELECT SIZE (US)
              </p>
              <button
                type="button"
                className="text-[10px] underline"
                style={{ color: "var(--theme-primary)" }}
              >
                SIZE GUIDE
              </button>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {product.sizes.map((size) => {
                const isActive = activeSize === size
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setActiveSize(size)}
                    className="h-11 border text-sm font-bold transition-colors"
                    style={
                      isActive
                        ? {
                            backgroundColor: "var(--theme-primary)",
                            color: "white",
                            borderColor: "var(--theme-primary)",
                          }
                        : {
                            backgroundColor: "white",
                            color: "#3F3F46",
                            borderColor: "#E5E7EB",
                          }
                    }
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <button
            type="button"
            disabled={outOfStock}
            className="h-12 w-full text-xs font-black uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            {outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          </button>
          <button
            type="button"
            disabled={outOfStock}
            className="h-12 w-full border border-zinc-900 text-xs font-bold uppercase tracking-[0.15em] text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            BUY IT NOW
          </button>
        </div>

      </div>
    </div>
  )
}
