import Link from "next/link"

export function CallToActionSection() {
  return (
    <section
      className="px-6 py-24 text-center"
      style={{ backgroundColor: "var(--theme-primary)" }}
    >
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Experience the Art of Less
        </h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-11 items-center border border-white px-8 text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-white hover:text-[var(--theme-primary)]"
          >
            Explore Collections
          </Link>
          <Link
            href="/about"
            className="inline-flex h-11 items-center px-8 text-xs font-bold tracking-[0.14em] text-white/80 uppercase transition-colors hover:text-white"
          >
            Read the Journal
          </Link>
        </div>
      </div>
    </section>
  )
}
