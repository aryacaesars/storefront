"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

/**
 * Fade singkat di area konten saat ganti toko (storeId di URL berubah),
 * supaya navigasi terasa jelas meski layout sidebar sama.
 */
export function DashboardRouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const storeId = pathname.match(/^\/stores\/([^/]+)/)?.[1] ?? null
  const prevStoreId = useRef(storeId)
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle")

  useEffect(() => {
    if (storeId && prevStoreId.current && storeId !== prevStoreId.current) {
      setPhase("out")
      const t1 = window.setTimeout(() => {
        prevStoreId.current = storeId
        setPhase("in")
      }, 90)
      const t2 = window.setTimeout(() => setPhase("idle"), 280)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
      }
    }
    prevStoreId.current = storeId
  }, [storeId, pathname])

  return (
    <div
      className={cn(
        "min-h-0 w-full transition-[opacity,transform] duration-200 ease-out",
        phase === "out" && "translate-y-1 opacity-40",
        phase === "in" && "translate-y-0 opacity-100",
        phase === "idle" && "opacity-100",
      )}
    >
      {children}
    </div>
  )
}
