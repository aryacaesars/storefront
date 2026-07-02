"use client"

import { useActionState, useEffect } from "react"
import { signUpAction, type SignUpState } from "./actions"

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[var(--theme-text)] outline-none transition-colors placeholder:text-[var(--theme-muted)] focus:border-[var(--theme-primary)]"

export function SignUpForm() {
  const [state, action, pending] = useActionState<SignUpState, FormData>(signUpAction, undefined)

  useEffect(() => {
    if (state && "success" in state) {
      window.location.assign("/account")
    }
  }, [state])

  return (
    <form action={action} className="mt-6 space-y-4">
      {state && "error" in state && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <input name="name" type="text" required placeholder="Nama lengkap" className={inputClass} />
      <input name="email" type="email" required placeholder="Email" className={inputClass} />
      <input name="password" type="password" required minLength={6} placeholder="Password (min 6 karakter)" className={inputClass} />
      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        {pending ? "Memproses..." : "Daftar"}
      </button>
    </form>
  )
}
