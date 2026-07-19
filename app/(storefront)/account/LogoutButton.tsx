"use client"

import { useTransition } from "react"
import { logoutAction } from "./actions"

export function LogoutButton({ variant = "default" }: { variant?: "default" | "bold" }) {
  const [pending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logoutAction()
      // Full nav (bukan redirect server action) supaya subdomain tetap → theme
      // tidak flip ke default.
      window.location.assign("/")
    })
  }

  if (variant === "bold") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className="inline-flex min-h-11 cursor-pointer items-center border border-zinc-300 px-5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-900 transition-colors duration-200 hover:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Keluar..." : "Keluar"}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="cursor-pointer rounded-full border border-black/10 px-5 py-2 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-black/5 disabled:opacity-50"
    >
      {pending ? "Keluar..." : "Keluar"}
    </button>
  )
}
