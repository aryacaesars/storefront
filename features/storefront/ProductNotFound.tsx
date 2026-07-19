import Link from "next/link"
import { PackageSearch } from "lucide-react"

type ProductNotFoundProps = {
  backHref?: string
  backLabel?: string
}

export function ProductNotFound({
  backHref = "/products",
  backLabel = "Kembali ke daftar produk",
}: ProductNotFoundProps) {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-accent,#f3f4f6)] text-[var(--theme-primary)]">
        <PackageSearch className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-[var(--theme-text)]">
        Produk tidak ditemukan
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted)]">
        Produk ini tidak ada di katalog, sudah dihapus, atau belum dipublikasikan.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={backHref}
          className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          {backLabel}
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-black/10 px-6 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:border-[var(--theme-primary)]"
        >
          Ke beranda
        </Link>
      </div>
    </section>
  )
}
