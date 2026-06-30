"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { clearCart } from "@/app/(storefront)/cart/actions"

/**
 * Bersihkan cart cookie sekali saat mount (dipakai di halaman success setelah
 * pembayaran Stripe berhasil). router.refresh() supaya badge cart di navbar
 * ikut jadi 0. Tidak menampilkan apa pun.
 */
export function ClearCart() {
  const router = useRouter()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true
    void clearCart().then(() => router.refresh())
  }, [router])

  return null
}
