import Link from "next/link"
import { PerformancePage } from "@/themes/bold/pages/PerformancePage"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import { ProductCard } from "@/themes/bold/sections/products/ProductCard"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ProductListPage({ config, products = [] }: ThemePageProps) {
  const isLive = products.length > 0

  return (
    <>
      <PerformancePage allProductsHref="/all-products" />
      {isLive && (
        <section className="border-t border-gray-100 bg-white px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--theme-primary)" }}
                >
                  Live Catalog
                </p>
                <h2
                  className="mt-1 text-2xl font-black uppercase text-zinc-900"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                >
                  Scalev Products
                </h2>
              </div>
              <Link
                href="/all-products"
                className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500 hover:text-zinc-900"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.slug} product={product} liveCatalog />
              ))}
            </div>
          </div>
        </section>
      )}
      <PerformanceFooter config={config} />
    </>
  )
}
