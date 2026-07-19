"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

interface DashboardHeaderContextValue {
  title?: string
  setTitle: (title?: string) => void
}

const DashboardHeaderContext = createContext<DashboardHeaderContextValue | null>(null)

export function DashboardHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>()

  const value = useMemo(() => ({ title, setTitle }), [title])

  return (
    <DashboardHeaderContext.Provider value={value}>{children}</DashboardHeaderContext.Provider>
  )
}

export function useDashboardHeaderTitle() {
  const context = useContext(DashboardHeaderContext)
  if (!context) {
    throw new Error("useDashboardHeaderTitle must be used within DashboardHeaderProvider")
  }
  return context
}

export function DashboardPageTitle({ children }: { children: string }) {
  const { setTitle } = useDashboardHeaderTitle()

  useEffect(() => {
    setTitle(children)
    return () => setTitle(undefined)
  }, [children, setTitle])

  return null
}
