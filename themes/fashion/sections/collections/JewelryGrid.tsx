import { JEWELRY_PRODUCTS } from "@/themes/fashion/data/mock"

export function JewelryGrid() {
  return (
    <div className="flex-1 min-w-0">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {JEWELRY_PRODUCTS.map((p) => (
          <div key={p.id}>
            <div className={`relative aspect-square overflow-hidden ${p.imageClass}`}>
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
              <h3 className="text-sm text-[var(--theme-text)]">{p.name}</h3>
              <p className="mt-0.5 text-sm text-[var(--theme-muted)]">
                ${p.price.toLocaleString()}.00
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
