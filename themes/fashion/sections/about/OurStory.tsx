export function OurStory() {
  return (
    <section className="bg-[var(--theme-bg)] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <h2
              className="mb-6 text-4xl font-medium text-[var(--theme-text)]"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              Our Story
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-[var(--theme-muted)]">
              Founded in the quiet outskirts, Luna Soft began as an experiment in texture and form.
              We sought to strip away the unnecessary until only the soul of the object remained.
            </p>
            <p className="text-sm leading-relaxed text-[var(--theme-muted)]">
              Our journey is not measured in seasons or trends, but in the longevity of the pieces
              we create. Each garment is an invitation to slow down, to feel the weight of quality,
              and to embrace the poetry of a life lived intentionally.
            </p>
          </div>

          <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gradient-to-b from-stone-300 via-zinc-400 to-zinc-500" />
        </div>
      </div>
    </section>
  )
}
