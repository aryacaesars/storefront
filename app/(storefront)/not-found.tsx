import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function StorefrontNotFound() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-accent,#f3f4f6)] text-[var(--theme-primary,#5b4ee6)]">
        <FileQuestion className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--theme-muted,#515160)]">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--theme-text,#1a1c1b)]">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted,#515160)]">
        URL yang kamu buka tidak ada atau sudah dipindahkan.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--theme-primary, #5b4ee6)" }}
        >
          Ke beranda
        </Link>
        <Link
          href="/products"
          className="inline-flex h-11 items-center rounded-full border border-black/10 px-6 text-sm font-semibold text-[var(--theme-text,#1a1c1b)]"
        >
          Lihat produk
        </Link>
      </div>
    </section>
  )
}
