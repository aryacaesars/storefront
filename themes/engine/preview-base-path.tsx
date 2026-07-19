"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { withBasePath } from "@/themes/engine/with-base-path"

const PLATFORM_PREFIXES = [
  "/templates",
  "/admin",
  "/api",
  "/login",
  "/auth",
  "/dashboard",
  "/stores",
]

/**
 * Di mode preview: klik link internal (`/products`, `/cart`, …) diarahkan ke
 * `{basePath}/…` supaya tidak loncat ke storefront tenant / landing.
 */
export function PreviewLinkScope({
  basePath,
  children,
}: {
  basePath: string
  children: ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const anchor = (event.target as Element | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null
      if (!anchor) return

      const raw = anchor.getAttribute("href")
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
        return
      }
      if (/^https?:\/\//i.test(raw)) return
      if (!raw.startsWith("/")) return

      // Link sudah di dalam base preview ini — biarkan Next navigasi normal.
      if (raw === basePath || raw.startsWith(`${basePath}/`)) return

      // Platform / preview theme lain — jangan ganggu.
      if (PLATFORM_PREFIXES.some((p) => raw === p || raw.startsWith(`${p}/`))) return
      if (raw === "/preview" || raw.startsWith("/preview/")) return

      const next = withBasePath(raw, basePath)
      if (next === raw) return

      event.preventDefault()
      event.stopPropagation()
      router.push(next)
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [basePath, router])

  return <>{children}</>
}
