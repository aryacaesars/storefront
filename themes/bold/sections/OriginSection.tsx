import { ArrowRight } from "lucide-react"

export function OriginSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[55fr_45fr] md:items-center">
        {/* Left column */}
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--theme-primary)" }}
          >
            THE ORIGIN
          </p>
          <h2
            className="mt-4 text-3xl font-bold leading-tight"
            style={{
              fontFamily: "var(--theme-heading-font)",
              color: "var(--theme-text)",
            }}
          >
            Founded in the crucible of elite competition, Momentum Bold emerged from a
            single question: Can technical precision be felt?
          </h2>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--theme-muted)" }}>
            We started in a small lab in Zurich, obsessing over the molecular structure of
            performance fabrics. What began as a bespoke service for Olympic sprinters has
            evolved into a global standard for those who refuse to compromise. Every stitch is
            a data point. Every silhouette is an aerodynamic victory.
          </p>
          <a
            href="/about"
            className="mt-8 inline-flex items-center gap-2 border px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-70"
            style={{
              borderColor: "var(--theme-primary)",
              color: "var(--theme-primary)",
            }}
          >
            READ THE ARCHIVE
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>

        {/* Right column — image mosaic */}
        <div className="grid grid-cols-2 gap-3">
          <div className="row-span-2 aspect-[3/4] rounded-sm bg-gradient-to-br from-zinc-200 to-zinc-400" />
          <div className="aspect-square rounded-sm bg-gradient-to-br from-zinc-700 to-zinc-900" />
          <div className="aspect-square rounded-sm bg-gradient-to-br from-zinc-400 to-zinc-600" />
        </div>
      </div>
    </section>
  )
}
