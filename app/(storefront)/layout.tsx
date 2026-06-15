import type { ReactNode } from "react"
import { StorefrontShell } from "@/features/storefront/StorefrontShell"

export default async function StorefrontLayout({
  children,
}: {
  children: ReactNode
}) {
  return <StorefrontShell>{children}</StorefrontShell>
}
