"use client"

import Link from "next/link"
import { User, ShoppingBag } from "lucide-react"
import { withBasePath } from "@/themes/engine/with-base-path"

interface HeaderActionsProps {
  basePath?: string
  cartCount: number
}

export function HeaderActions({ basePath, cartCount }: HeaderActionsProps) {
  const isPreview = Boolean(basePath)

  return (
    <div
      className="hidden items-center gap-0.5 rounded-full px-2 py-1 @2xl:flex"
      style={{ backgroundColor: "var(--theme-primary)" }}
    >
      {!isPreview && (
        <Link
          href="/account"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
          aria-label="Account"
        >
          <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </Link>
      )}

      <Link
        href={withBasePath("/cart", basePath)}
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
        aria-label="Cart"
      >
        <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
        {cartCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[var(--theme-primary)]">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  )
}
