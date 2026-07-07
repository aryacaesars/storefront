import Link from "next/link"
import { FEATURED_PRODUCTS } from "@/themes/fashion/data/mock"

export function SignatureSeries() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--theme-muted)]">
            CURATED SELECTION
          </p>
          <h2
            className="mt-2 text-3xl font-medium text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            The Signature Series
          </h2>
        </div>
        <Link
          href="#"
          className="text-xs tracking-wide text-[var(--theme-muted)] underline hover:text-[var(--theme-text)]"
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {FEATURED_PRODUCTS.map((p) => (
          <div key={p.id}>
            <div className={`relative aspect-[3/4] overflow-hidden rounded-sm ${p.imageClass}`}>
              {p.badge && (
                <span className="absolute right-3 top-3 bg-[var(--theme-text)] px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                  {p.badge}
                </span>
              )}
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-[var(--theme-text)]">{p.name}</h3>
              <p className="mt-0.5 text-sm text-[var(--theme-muted)]">${p.price}.00</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
