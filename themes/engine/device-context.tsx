"use client"

import { createContext, useContext, useSyncExternalStore } from "react"
import type { ReactNode } from "react"
import type { DeviceMode } from "@/themes/engine/device-settings"

/** Mobile breakpoint: <640px (Tailwind `sm`). max-width is inclusive → 639.98px. */
const MOBILE_QUERY = "(max-width: 639.98px)"

const DeviceContext = createContext<{ isMobile: boolean } | null>(null)

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {}
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia(MOBILE_QUERY).matches
}

/** SSR renders desktop; the client reconciles to the real viewport after hydration. */
function getServerSnapshot(): boolean {
  return false
}

interface DeviceProviderProps {
  /** When set, ignores the viewport and forces the layer (used by the editor preview). */
  forcedDevice?: DeviceMode
  children: ReactNode
}

export function DeviceProvider({ forcedDevice, children }: DeviceProviderProps) {
  const measured = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isMobile = forcedDevice ? forcedDevice === "mobile" : measured
  return <DeviceContext.Provider value={{ isMobile }}>{children}</DeviceContext.Provider>
}

/** Returns whether the current render target is mobile. Defaults to desktop (false). */
export function useDeviceIsMobile(): boolean {
  return useContext(DeviceContext)?.isMobile ?? false
}
