import { Clock, Leaf } from "lucide-react"

export function PhilosophySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid items-center gap-8 @3xl:grid-cols-2 @3xl:gap-10">
        <div className="aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-amber-100 via-stone-200 to-amber-50" />

        <div>
          <h2
            className="text-2xl font-semibold text-[var(--theme-text)] @2xl:text-3xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Less, but better
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--theme-muted)] @2xl:text-base">
            We believe in fewer, more considered pieces — designed to outlast trends
            and integrate seamlessly into a life lived with purpose.
          </p>

          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--theme-accent)" }}
              >
                <Clock className="h-4 w-4 text-[var(--theme-primary)]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--theme-text)]">Timeless</p>
                <p className="text-sm text-[var(--theme-muted)]">
                  Silhouettes that transcend seasons and passing trends.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--theme-accent)" }}
              >
                <Leaf className="h-4 w-4 text-[var(--theme-primary)]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--theme-text)]">Sustainable</p>
                <p className="text-sm text-[var(--theme-muted)]">
                  Responsibly sourced materials with transparent supply chains.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
