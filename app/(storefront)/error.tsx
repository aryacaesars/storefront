"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-[var(--theme-text,#1a1c1b)]">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted,#515160)]">
        This page could not be loaded. Try again, or return to the home page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--theme-primary, #5b4ee6)" }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-black/10 px-6 text-sm font-semibold text-[var(--theme-text,#1a1c1b)]"
        >
          Go to home
        </Link>
      </div>
    </section>
  )
}
