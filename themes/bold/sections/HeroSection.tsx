export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#0D4A3E]">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Dramatic bottom shadow */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Content — bottom-left */}
      <div className="absolute bottom-0 left-0 max-w-2xl px-8 pb-16">
        <span
          className="inline-block rounded px-3 py-1 text-[10px] uppercase tracking-widest"
          style={{
            border: "1px solid color-mix(in srgb, var(--theme-accent) 50%, transparent)",
            color: "var(--theme-accent)",
          }}
        >
          EST. 2026
        </span>
        <h1
          className="mt-4 text-5xl font-black uppercase leading-none text-white md:text-7xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          DEFINING THE LIMIT OF HUMAN POTENTIAL.
        </h1>
        <p className="mt-4 max-w-md text-sm text-white/60">
          Momentum Bold isn&apos;t just gear. It&apos;s a commitment to the engineering of
          motion and the relentless pursuit of peak performance.
        </p>
      </div>

      {/* Scroll indicator dots — center bottom */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
        <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
      </div>
    </section>
  )
}
