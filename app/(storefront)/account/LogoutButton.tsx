"use client"

import { useTransition } from "react"
import { logoutAction } from "./actions"

export function LogoutButton() {
  const [pending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logoutAction()
      // Full nav (bukan redirect server action) supaya subdomain tetap → theme
      // tidak flip ke default.
      window.location.assign("/")
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="rounded-full border border-black/10 px-5 py-2 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-black/5 disabled:opacity-50"
    >
      {pending ? "Keluar..." : "Keluar"}
    </button>
  )
}
