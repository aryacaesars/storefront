"use client"

import type { ReactNode } from "react"

interface PreviewLinkGuardProps {
  children: ReactNode
}

/**
 * Blocks in-preview navigation. Theme sections use real Next.js Links; without
 * this, clicking "Products" escapes the builder and hits empty storefront routes.
 */
export function PreviewLinkGuard({ children }: PreviewLinkGuardProps) {
  return (
    <div
      onClickCapture={(event) => {
        const anchor = (event.target as HTMLElement).closest("a[href]")
        if (anchor) {
          event.preventDefault()
          event.stopPropagation()
        }
      }}
    >
      {children}
    </div>
  )
}
