"use client"

import { useState } from "react"
import { Truck, ShieldCheck } from "lucide-react"
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

export function ProductGalleryClient({ product }: ProductGalleryClientProps) {
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeColor, setActiveColor] = useState(product.defaultColor)
  const [activeSize, setActiveSize] = useState(product.defaultSize)

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* LEFT — thumbnails + main image */}
      <div className="flex gap-3">
        {/* Thumbnail strip */}
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
              <div className={`h-full w-full ${thumb.imageClass}`} />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="relative flex-1">
          <div
            className={`aspect-square overflow-hidden rounded-sm ${product.thumbnails[activeThumb].imageClass}`}
          />
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

      {/* RIGHT — product details */}
      <div className="space-y-6">
        {/* Series + name */}
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--theme-primary)" }}
          >
            {product.seriesLabel}
          </p>
          <h1
            className="mt-1 text-4xl font-black uppercase leading-none text-zinc-900"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {product.name}
          </h1>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-zinc-500">({product.reviewCount} REVIEWS)</span>
        </div>

        {/* Price */}
        <p className="text-3xl font-black" style={{ color: "var(--theme-primary)" }}>
          ${product.price}.00
        </p>

        {/* Color */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-700">
            COLOR: {activeColor.toUpperCase()}
          </p>
          <div className="mt-2 flex gap-2">
            {product.colors.map((color) => {
              const isActive = activeColor === color.name
              const isLight = color.hex === "#FFFFFF" || color.hex === "#ffffff"
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setActiveColor(color.name)}
                  className="h-8 w-8 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: isLight ? "#D1D5DB" : "transparent",
                    outline: isActive ? "2px solid var(--theme-primary)" : "none",
                    outlineOffset: "2px",
                  }}
                  aria-label={color.name}
                />
              )
            })}
          </div>
        </div>

        {/* Size */}
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
                      : { backgroundColor: "white", color: "#3F3F46", borderColor: "#E5E7EB" }
                  }
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="space-y-2">
          <button
            type="button"
            className="h-12 w-full text-xs font-black uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            ADD TO CART
          </button>
          <button
            type="button"
            className="h-12 w-full border border-zinc-900 text-xs font-bold uppercase tracking-[0.15em] text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            BUY IT NOW
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <Truck className="h-3.5 w-3.5" strokeWidth={1.5} />
            FREE EXPEDITED SHIPPING
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
            30-DAY PERFORMANCE GUARANTEE
          </div>
        </div>
      </div>
    </div>
  )
}
