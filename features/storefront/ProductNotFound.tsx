import Link from "next/link"

type ProductNotFoundProps = {
  backHref?: string
  backLabel?: string
}

export function ProductNotFound({
  backHref = "/products",
  backLabel = "Kembali ke daftar produk",
}: ProductNotFoundProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold text-[var(--theme-text)]">
        Produk tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-[var(--theme-muted)]">
        Produk ini tidak ada di katalog atau sudah tidak tersedia.
      </p>
      <Link
        href={backHref}
        className="mt-4 inline-block text-sm text-[var(--theme-primary)] hover:underline"
      >
        {backLabel}
      </Link>
    </section>
  )
}
