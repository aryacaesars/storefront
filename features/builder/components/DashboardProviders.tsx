"use client"

import type { ReactNode } from "react"
import { DashboardToastProvider } from "@/features/builder/components/DashboardToast"

export function DashboardProviders({ children }: { children: ReactNode }) {
  return <DashboardToastProvider>{children}</DashboardToastProvider>
}
