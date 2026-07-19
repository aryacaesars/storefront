import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Dokumentasi",
    template: "%s — Docs Etalase",
  },
  description:
    "Panduan lengkap Etalase: buat toko, aktifkan template, kustomisasi, katalog, pesanan, dan live storefront.",
}

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return children
}
