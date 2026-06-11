import { ArrowRight } from "lucide-react"

export function NewsletterSection() {
  return (
    <section
      className="mx-6 mb-16 rounded-2xl px-6 py-14 sm:px-12"
      style={{ backgroundColor: "var(--theme-accent)" }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
        <div>
          <h2
            className="text-2xl font-semibold text-[var(--theme-text)] sm:text-3xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Join the Circle
          </h2>
          <p className="mt-3 text-sm text-[var(--theme-muted)]">
            Be the first to discover new arrivals, private sales, and stories from
            the studio.
          </p>
          <form className="mt-6 flex max-w-md gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="h-11 flex-1 rounded-l-lg border border-r-0 border-gray-200 bg-white px-4 text-sm outline-none focus:border-[var(--theme-primary)]"
            />
            <button
              type="submit"
              className="flex h-11 items-center gap-1 rounded-r-lg px-5 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-primary)" }}
              aria-label="Subscribe"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            "bg-gradient-to-br from-stone-400 to-stone-600",
            "bg-gradient-to-br from-slate-500 to-slate-700",
            "bg-gradient-to-br from-amber-200 to-amber-400",
            "bg-gradient-to-br from-neutral-300 to-neutral-500",
            "bg-gradient-to-br from-zinc-600 to-zinc-800",
            "bg-gradient-to-br from-stone-300 to-stone-500",
          ].map((cls, i) => (
            <div key={i} className={`aspect-square rounded-sm ${cls}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
