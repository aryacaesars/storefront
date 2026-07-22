import type { ReactNode } from "react"
import type { Metadata } from "next"
import { LocaleShell } from "@/features/i18n/LocaleShell"

export const metadata: Metadata = {
  title: {
    default: "Documentation",
    template: "%s — Etalase Docs",
  },
  description:
    "Complete Etalase guide: create a store, activate templates, customize, manage catalog and orders, and publish your live storefront.",
}

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return <LocaleShell>{children}</LocaleShell>
}
