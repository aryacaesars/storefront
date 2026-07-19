"use client"

import { useEffect } from "react"

/** Registers the PWA service worker once on the client. */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return
    // Skip noisy re-registers during Next.js hot reload in development.
    if (process.env.NODE_ENV === "development") return

    const register = () => {
      void navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
    }

    if (document.readyState === "complete") register()
    else window.addEventListener("load", register, { once: true })
  }, [])

  return null
}
