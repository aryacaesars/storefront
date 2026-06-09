"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import type { LoginFormState } from "../types";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginFormState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground/80">
          Token API Scalev
        </span>
        <input
          name="token"
          type="password"
          autoComplete="off"
          placeholder="Tempel token Scalev kamu"
          required
          className="rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 dark:border-white/15 dark:bg-white/5"
        />
      </label>

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menghubungkan…" : "Connect Scalev"}
      </button>
    </form>
  );
}
