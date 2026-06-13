import { SHOP_PRODUCTS } from "@/themes/fashion/data/mock"

export function ProductGrid() {
  return (
    <div className="flex-1 min-w-0">
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
        {SHOP_PRODUCTS.map((p) => (
          <div key={p.id}>
            <div className={`relative aspect-[3/4] overflow-hidden ${p.imageClass}`}>
              {p.badge && (
                <span
                  className="absolute left-3 top-3 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white"
                  style={{ backgroundColor: "#B5A642" }}
                >
                  {p.badge}
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/5" />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-sm leading-snug text-[var(--theme-text)]">{p.name}</h3>
              <p className="mt-1 text-sm text-[var(--theme-muted)]">
                ${p.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
