import { NEW_ARRIVALS } from "@/themes/bold/data/performance-mock"

export function NewArrivalsSection() {
  return (
    <section id="section-new-arrivals" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: "var(--theme-accent)" }}
          >
            JUST DROPPED
          </p>
          <h2
            className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            NEW ARRIVALS
          </h2>
          <div
            className="mt-3 h-0.5 w-10"
            style={{ backgroundColor: "var(--theme-primary)" }}
          />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {NEW_ARRIVALS.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div
                className={`relative aspect-[3/4] overflow-hidden rounded-sm ${product.imageClass}`}
              >
                {product.badge && (
                  <span
                    className="absolute left-3 top-3 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-zinc-900"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                  >
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-3">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-900">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-zinc-500">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
