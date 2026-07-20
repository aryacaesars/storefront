"use client"

import { cn } from "@/lib/utils"
import type { PreviewDevice } from "./EditorTopbar"

export interface BrandingConfig {
  storeName: string
  primaryColor: string
  headingFont: string
  bodyFont: string
  bannerText: string
}

interface StorefrontPreviewProps {
  branding: BrandingConfig
  device: PreviewDevice
}

export function StorefrontPreview({ branding, device }: StorefrontPreviewProps) {
  const { storeName, primaryColor, headingFont, bodyFont, bannerText } = branding

  return (
    <div className="flex h-full items-start justify-center overflow-auto bg-gray-100 p-6">
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl transition-all duration-300",
          device === "mobile" ? "w-[375px]" : "w-full max-w-4xl",
        )}
        style={
          {
            "--preview-primary": primaryColor,
            "--preview-heading": headingFont,
            "--preview-body": bodyFont,
          } as React.CSSProperties
        }
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div className="mx-auto flex-1 max-w-xs rounded-md bg-white px-3 py-1 text-center text-[10px] text-gray-400 border border-gray-200">
            namatoko.etalase.com
          </div>
        </div>

        {/* Announcement bar */}
        <div
          className="px-4 py-2 text-center text-xs text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {bannerText}
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-4 py-3">
          <span
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: headingFont }}
          >
            {storeName || "Store Name"}
          </span>
          <div className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-xs text-gray-400">
            Search products...
          </div>
          <span
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Cart
          </span>
        </div>

        {/* Nav */}
        <div
          className="flex gap-5 border-b border-gray-100 px-4 py-2 text-xs text-gray-500"
          style={{ fontFamily: bodyFont }}
        >
          {["Home", "Products", "Categories", "About", "Contact"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        {/* Hero */}
        <div className="px-4 py-8">
          <div
            className="rounded-2xl px-6 py-10 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: headingFont }}
            >
              Latest Collection
            </h2>
            <p className="text-sm opacity-90 mb-4" style={{ fontFamily: bodyFont }}>
              Discover handpicked products with the best quality.
            </p>
            <span className="inline-block rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-900">
              Shop Now
            </span>
          </div>
        </div>

        {/* Product grid */}
        <div className="px-4 pb-8">
          <p
            className="mb-4 text-sm font-semibold text-gray-900"
            style={{ fontFamily: headingFont }}
          >
            Featured Products
          </p>
          <div className={cn("grid gap-4", device === "mobile" ? "grid-cols-2" : "grid-cols-4")}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="h-2 w-3/4 rounded-full bg-gray-200" />
                <div
                  className="h-2 w-1/2 rounded-full"
                  style={{ backgroundColor: `${primaryColor}33` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
