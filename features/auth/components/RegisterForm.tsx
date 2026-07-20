"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import {
  loginWithGoogle,
  registerWithCredentials,
} from "@/features/auth/actions"
import { PasswordField } from "@/features/auth/components/PasswordField"
import { PasswordStrengthBar } from "@/features/auth/components/PasswordStrengthBar"
import type { LoginFormState } from "@/features/auth/types"
import { useMessages } from "@/features/i18n/LocaleProvider"

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/20"

export function RegisterForm() {
  const t = useMessages()
  const [password, setPassword] = useState("")
  const [state, action, pending] = useActionState<LoginFormState, FormData>(
    registerWithCredentials,
    undefined,
  )

  return (
    <div className="w-full space-y-5">
      <form action={action} className="space-y-3">
        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {state.error}
          </p>
        )}
        <input
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t.auth.nameOptional}
          className={inputClass}
        />
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.auth.email}
          className={inputClass}
        />
        <div className="space-y-2">
          <PasswordField
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder={t.auth.password}
            value={password}
            onChange={setPassword}
          />
          <PasswordStrengthBar password={password} />
          <p className="px-0.5 text-xs leading-relaxed text-slate-400">
            {t.auth.passwordHint}
          </p>
        </div>
        <PasswordField
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={t.auth.confirmPassword}
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {pending ? t.auth.pending : t.auth.submitRegister}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
          {t.auth.or}
        </span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <form action={loginWithGoogle}>
        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t.auth.googleRegister}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        {t.auth.hasAccount}{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
          {t.auth.loginLink}
        </Link>
      </p>
    </div>
  )
}
