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
      <input
        name="token"
        type="password"
        autoComplete="off"
        placeholder="Masukkan Token Scalev"
        required
        className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-brand px-4 py-3 text-base font-bold text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menghubungkan…" : "Connect"}
      </button>
    </form>
  );
}
